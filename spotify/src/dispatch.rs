use std::{sync::Arc, time::Duration};

use axum::extract::ws::{Message, WebSocket};
use futures::lock::Mutex;
use rspotify::AuthCodeSpotify;
use serde_json::json;
use tokio::time::interval;

use crate::{get_listening_data, SpotifyListeningInfo};

struct Instant(std::time::Instant);

impl std::ops::Deref for Instant {
    type Target = std::time::Instant;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl std::ops::Sub for &Instant {
    type Output = Duration;

    fn sub(self, rhs: Self) -> Self::Output {
        self.elapsed() - rhs.elapsed()
    }
}

impl From<std::time::Instant> for Instant {
    fn from(value: std::time::Instant) -> Self {
        Instant(value)
    }
}

fn should_emit_client_update(
    listening_data: &Option<SpotifyListeningInfo>,
    prev_listening_data: &Option<SpotifyListeningInfo>,
    cur_time: &Instant,
    prev_time: &Instant,
) -> bool {
    const THRESHOLD_MS: i64 = 1000;

    match (prev_listening_data, listening_data) {
        (None, None) => false,
        (Some(_prev_data), None) => true,
        (None, Some(_cur_data)) => true,
        (Some(prev_data), Some(cur_data)) if cur_data.progress - prev_data.progress < 0 => true,
        (Some(prev_data), Some(cur_data)) => {
            let progress_delta: i64 = (cur_data.progress - prev_data.progress) * 1000;
            let time_delta: i64 = (prev_time - cur_time).as_millis().try_into().unwrap_or(0);

            let jitter = (progress_delta - time_delta).abs();
            jitter > THRESHOLD_MS
        }
    }
}

pub async fn spotify_ws_dispatch(
    clients_mtx: Arc<Mutex<Vec<WebSocket>>>,
    spt_authcode_mtx: Arc<Mutex<AuthCodeSpotify>>,
) {
    let mut prev_data: Option<SpotifyListeningInfo> = None;
    let mut prev_time = std::time::Instant::now().into();

    let mut interval = interval(Duration::from_secs(2));
    interval.tick().await;

    loop {
        interval.tick().await;

        let mut clients = clients_mtx.lock().await;
        let spt_authcode = spt_authcode_mtx.lock().await;

        if clients.is_empty() {
            println!("No clients... skipping for this tick");
            continue;
        }

        println!("Clients this tick: {}", clients.len());

        let listening_data = get_listening_data(&spt_authcode).await;
        let cur_time = std::time::Instant::now().into();

        // calculate if an update needs to be emitted

        if should_emit_client_update(&listening_data, &prev_data, &cur_time, &prev_time) {
            let msg = match get_listening_data(&spt_authcode).await {
                Some(data) => Message::Text(
                    serde_json::to_string(&json! {{
                        "ok": true,
                        "type": "update",
                        "playing": true,
                        "paused": if let Some(prev_data) = prev_data { prev_data.progress == data.progress } else { false },
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
            };

            let len = clients.len();
            for index in (0..len).rev() {
                if let Err(err) = clients[index].send(msg.clone()).await {
                    println!("!!! Failed to send message to clients@{index}. Failed with error: {err}. Dropping client...");
                    clients.remove(index).close().await.ok(); // allow failure-- it's possible the ws has a broken pipe
                    println!("Dropped");
                }
            }
        }

        prev_data = listening_data;
        prev_time = cur_time;
    }
}
