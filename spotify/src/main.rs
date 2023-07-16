use std::sync::Arc;

use actix_web::{
    get,
    web::{Data, Query},
    App, HttpResponse, HttpServer, Responder,
};
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

#[get("/")]
async fn get_healthcheck() -> impl Responder {
    HttpResponse::Ok().json(json!({ "ok": true }))
}

#[get("/current")]
async fn get_current_song(data: Data<AppData>) -> impl Responder {
    let spotify = data.spotify.lock().await.unwrap();
    let current_playing = spotify
        .current_playing(None, Some(vec![&AdditionalType::Track]))
        .await
        .unwrap()
        .unwrap();

    if let Some(PlayableItem::Track(track)) = current_playing.item {
        return HttpResponse::Ok().json(json!({
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

    HttpResponse::Ok().json(json!({ "ok": true }))
}

#[derive(Deserialize)]
struct GetCallbackQuery {
    code: String,
}

#[get("/callback")]
async fn get_callback(query: Query<GetCallbackQuery>, data: Data<AppData>) -> impl Responder {
    let code = &query.code;
    let spotify = data.spotify.lock().await.unwrap();
    let mut should_accept_callback = data.should_accept_callback.lock().await.unwrap();

    if !*should_accept_callback {
        return HttpResponse::Unauthorized()
            .json(json!({ "ok": false, "err": "Tokens may not be set at this time. Please navigate to `/auth` to begin the oauth flow" }));
    }

    *should_accept_callback = false;

    if let Err(err) = spotify.request_token(&code).await {
        return HttpResponse::InternalServerError()
            .json(json!({ "ok": false, "err": err.to_string() }));
    }

    HttpResponse::Ok().json(json!({ "ok": true, "code": code }))
}

#[derive(Deserialize)]
struct GetSpotifyAuthQuery {
    passkey: String,
}

#[get("/auth")]
async fn get_spotify_auth(
    query: Query<GetSpotifyAuthQuery>,
    data: Data<AppData>,
) -> impl Responder {
    let spotify = data.spotify.lock().await.unwrap();
    let url = spotify.get_authorize_url(false).unwrap();

    if query.passkey != std::env::var("PASSKEY").expect("fetching env var `PASSKEY`") {
        return HttpResponse::Unauthorized()
            .json(json!({ "ok": "false", "err": "missing or invalid invalid passkey" }));
    }

    let mut should_accept_callback = data.should_accept_callback.lock().await.unwrap();

    *should_accept_callback = true;
    return HttpResponse::TemporaryRedirect()
        .append_header(("location", url))
        .finish();
}

#[derive(Clone)]
struct AppData {
    spotify: Arc<Mutex<AuthCodeSpotify>>,
    should_accept_callback: Arc<Mutex<bool>>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(app_data.clone()))
            .service(get_healthcheck)
            .service(get_current_song)
            .service(get_spotify_auth)
            .service(get_callback)
    })
    .bind(("0.0.0.0", 8888))?
    .run()
    .await
}
