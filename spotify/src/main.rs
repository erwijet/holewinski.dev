use dispatch::spotify_ws_dispatch;
use futures::lock::Mutex;
use heartbeat::ws_heartbeat;
use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, Query, State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::{IntoResponse, Redirect},
    routing::get,
    Json, Router,
};
use dotenv::dotenv;
use rspotify::{
    model::{AdditionalType, CurrentlyPlayingContext, Image, PlayableItem, SimplifiedArtist},
    prelude::OAuthClient,
    scopes, AuthCodeSpotify, Config, Credentials, OAuth,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

mod dispatch;
mod heartbeat;

#[derive(Serialize)]
struct SpotifyListeningInfo {
    title: String,
    artists: Vec<SimplifiedArtist>,
    images: Vec<Image>,
    track_id: String,
    duration: i64,
    progress: i64,
}

impl TryFrom<CurrentlyPlayingContext> for SpotifyListeningInfo {
    type Error = ();
    fn try_from(value: CurrentlyPlayingContext) -> Result<Self, Self::Error> {
        if let Some(PlayableItem::Track(track)) = value.item {
            Ok(SpotifyListeningInfo {
                title: track.name,
                artists: track.artists,
                images: track.album.images,
                track_id: track.id.map(|id| id.to_string()).unwrap_or("".into()),
                duration: track.duration.num_seconds(),
                progress: value.progress.map_or(0, |progress| progress.num_seconds()),
            })
        } else {
            eprintln!("Failed spt payload conversion. got: {value:?}");
            Err(())
        }
    }
}

trait Flatten<T> {
    fn flatten(self) -> Option<T>;
}

impl<T> Flatten<T> for Option<Option<T>> {
    fn flatten(self) -> Option<T> {
        match self {
            Some(v) => v,
            None => None,
        }
    }
}

async fn get_listening_data(spotify: &AuthCodeSpotify) -> Option<SpotifyListeningInfo> {
    let current_playing = spotify
        .current_playing(None, Some(vec![&AdditionalType::Track]))
        .await
        .unwrap()?;

    current_playing.try_into().ok()
}

async fn healthcheck() -> impl IntoResponse {
    Json(json!({ "ok": true }))
}

async fn current(State(state): State<AppData>) -> impl IntoResponse {
    let spotify = state.spotify.lock().await;
    let data = get_listening_data(&spotify).await;

    Json(json!({ "ok": true, "has_data": data.is_some(), "data": data }))
}

#[derive(Deserialize)]
struct GetCallbackQuery {
    code: String,
}

async fn callback(
    Query(query): Query<GetCallbackQuery>,
    State(state): State<AppData>,
) -> impl IntoResponse {
    let code = &query.code;
    let spotify = state.spotify.lock().await;
    let mut should_accept_callback = state.should_accept_callback.lock().await;

    if !*should_accept_callback {
        return (
            StatusCode::PRECONDITION_FAILED,
            Json(
                json!({ "ok": false, "err": "Tokens may not be set at this time. Please navigate to `/auth` to begin the oauth flow" }),
            ),
        );
    }

    *should_accept_callback = false;

    if let Err(err) = spotify.request_token(&code).await {
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "ok": true, "err": err.to_string() })),
        );
    }

    (StatusCode::OK, Json(json!({ "ok": true, "code": code })))
}

#[derive(Deserialize)]
struct GetSpotifyAuthQuery {
    passkey: String,
}

async fn auth(
    Query(query): Query<GetSpotifyAuthQuery>,
    State(state): State<AppData>,
) -> impl IntoResponse {
    let spotify = state.spotify.lock().await;
    let url = spotify.get_authorize_url(false).unwrap();

    if query.passkey != std::env::var("PASSKEY").expect("fetching env var `PASSKEY`") {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({ "ok": false, "err": "missing or invalid invalid passkey" })),
        )
            .into_response();
    }

    let mut should_accept_callback = state.should_accept_callback.lock().await;

    *should_accept_callback = true;
    Redirect::temporary(&url).into_response()
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppData>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    println!("Incoming connect from {addr}...");

    ws.on_upgrade(move |mut socket| async move {
        if socket.send(Message::Ping(vec![5, 8, 7, 8])).await.is_err() {
            println!("!! Failed to send ack to incoming socket. Client will not be added.");
            return;
        }

        if let Ok(payload) = serde_json::to_string(&json!({ "type": "ack", "ok": true })) {
            if socket.send(Message::Text(payload)).await.is_err() {
                println!("!! Failed to send ack to incoming socket. Client will not be added.");
                return;
            }
        }

        let msg = {
            let spt_authcode = state.spotify.lock().await;

            // calculate if an update needs to be emitted

            match get_listening_data(&spt_authcode).await {
                Some(data) => Message::Text(
                    serde_json::to_string(&json! {{
                        "ok": true,
                        "type": "update",
                        "playing": true,
                        "paused": false,
                        "data": data
                    }})
                    .unwrap(),
                ),

                None => Message::Text(
                    serde_json::to_string(&json! {{
                        "ok": true,
                        "type": "update",
                        "playing": false,
                    }})
                    .unwrap(),
                ),
            }
        };

        if socket.send(msg).await.is_err() {
            println!(
                "!! Failed to send initial payload to incoming socket. Client will not be added."
            );
            return;
        }

        state.ws_clients.lock().await.push(socket);
    })
}

#[derive(Clone)]
struct AppData {
    spotify: Arc<Mutex<AuthCodeSpotify>>,
    should_accept_callback: Arc<Mutex<bool>>,
    ws_clients: Arc<Mutex<Vec<WebSocket>>>,
}

#[tokio::main]
async fn main() {
    dotenv().expect("loading `.env`");

    // configure spotify client

    let creds = Credentials::new(
        &*std::env::var("SPOTIFY_CLIENT_ID").expect("reading env var `SPOTIFY_CLIENT_ID`"),
        &*std::env::var("SPOTIFY_CLIENT_SECRET").expect("reading env var `SPOTIFY_CLIENT_SECRET`"),
    );

    let conf = Config {
        token_refreshing: true,
        ..Config::default()
    };

    let oauth = OAuth {
        scopes: scopes!("user-read-currently-playing"),
        redirect_uri: std::env::var("SPOTIFY_REDIRECT_URI")
            .expect("reading env var `SPOTIFY_REDIRECT_URI`"),
        ..Default::default()
    };

    let spotify = AuthCodeSpotify::with_config(creds, oauth, conf);

    let app_data = AppData {
        spotify: Arc::new(Mutex::new(spotify)),
        should_accept_callback: Arc::new(Mutex::new(false)),
        ws_clients: Arc::new(Mutex::new(vec![])),
    };

    tokio::spawn(spotify_ws_dispatch(
        app_data.ws_clients.clone(),
        app_data.spotify.clone(),
    ));

    tokio::spawn(ws_heartbeat(app_data.ws_clients.clone()));

    let app = Router::new()
        .route("/", get(healthcheck))
        .route("/auth", get(auth))
        .route("/callback", get(callback))
        .route("/current", get(current))
        .route("/ws", get(ws_handler))
        .with_state(app_data);

    axum::Server::bind(&SocketAddr::from(([0, 0, 0, 0], 8888)))
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}
