use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Redirect},
    routing::get,
    Json, Router,
};
// use actix_web::{
//     get,
//     web::{Data, Query},
//     App, HttpResponse, HttpServer, Responder,
// };
use dotenv::dotenv;
use rspotify::{
    model::{AdditionalType, PlayableItem},
    prelude::OAuthClient,
    scopes,
    sync::Mutex,
    AuthCodeSpotify, Config, Credentials, OAuth,
};
use serde::Deserialize;
use serde_json::json;

async fn healthcheck() -> impl IntoResponse {
    Json(json!({ "ok": true }))
}

async fn current(State(state): State<AppData>) -> impl IntoResponse {
    let spotify = state.spotify.lock().await.unwrap();
    let current_playing = spotify
        .current_playing(None, Some(vec![&AdditionalType::Track]))
        .await
        .unwrap()
        .unwrap();

    if let Some(PlayableItem::Track(track)) = current_playing.item {
        return Json(json!({
            "ok": true,
            "is_listening": true,
            "track": {
                "title": track.name,
                "artists": track.artists,
                "images": track.album.images,
                "track_id": track.id,
                "duration": track.duration.num_seconds()
            },
            "progress": current_playing.progress.map(|progress| progress.num_seconds())
        }));
    }

    Json(json!({ "ok": true }))
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
    let spotify = state.spotify.lock().await.unwrap();
    let mut should_accept_callback = state.should_accept_callback.lock().await.unwrap();

    if !*should_accept_callback {
        return (
            StatusCode::UNAUTHORIZED,
            Json(
                json!({ "ok": false, "err": "Tokens may not be set at this time. Please navigate to `/auth` to begin the oauth flow" }),
            ),
        );
    }

    *should_accept_callback = false;

    if let Err(err) = spotify.request_token(&code).await {
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "ok": true, "code": code })),
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
    let spotify = state.spotify.lock().await.unwrap();
    let url = spotify.get_authorize_url(false).unwrap();

    if query.passkey != std::env::var("PASSKEY").expect("fetching env var `PASSKEY`") {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({ "ok": false, "err": "missing or invalid invalid passkey" })),
        ).into_response();
    }

    let mut should_accept_callback = state.should_accept_callback.lock().await.unwrap();

    *should_accept_callback = true;
    Redirect::temporary(&url).into_response()
}

#[derive(Clone)]
struct AppData {
    spotify: Arc<Mutex<AuthCodeSpotify>>,
    should_accept_callback: Arc<Mutex<bool>>,
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
    };

    // then configure actix

    let app = Router::new()
        .route("/", get(healthcheck))
        .route("/auth", get(auth))
        .route("/callback", get(callback))
        .route("/current", get(current))
        .with_state(app_data);

    axum::Server::bind(&SocketAddr::from(([0, 0, 0, 0], 8888)))
        .serve(app.into_make_service())
        .await
        .unwrap();
}
