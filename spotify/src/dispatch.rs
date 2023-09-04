use std::{sync::Arc, time::Duration};

use axum::extract::ws::{Message, WebSocket};
use futures::lock::Mutex;
use rspotify::AuthCodeSpotify;
use serde_json::json;
use tokio::time::interval;

use crate::get_listening_data;

pub async fn spotify_ws_dispatch(
    clients_mtx: Arc<Mutex<Vec<WebSocket>>>,
    spt_authcode_mtx: Arc<Mutex<AuthCodeSpotify>>,
) {
    let mut interval = interval(Duration::from_secs(2));
    interval.tick().await;

    loop {
        interval.tick().await;

        let mut clients = clients_mtx.lock().await;
        // let mut previous_track_progress = prev_track_progress_tx.lock().await.unwrap();
        let spt_authcode = spt_authcode_mtx.lock().await;

        if clients.is_empty() {
            println!("No clients... skipping for this tick");
            continue;
        }

        println!("Clients this tick: {}", clients.len());

        match get_listening_data(&spt_authcode)
                .await
                .map_or_else(
                    || serde_json::to_string(&json!({ "type": "update", "ok": true, "playing": false })),
                    |data| {
                        serde_json::to_string(
                            &json!({ "type": "update", "ok": true, "playing": true, "paused": false, "data": data }),
                        )
                    },
                )
                .ok()
                .map(|str| Message::Text(str))
            {
                Some(msg) => {
                    let len = clients.len();
                    for index in (0..len).rev() {
                        if let Err(err) = clients[index].send(msg.clone()).await {
                            println!("!!! Failed to send message to clients@{index}. Failed with error: {err}. Dropping client...");
                            clients
                                .remove(index)
                                .close()
                                .await
                                .ok(); // allow failure-- it's possible the ws has a broken pipe
                            println!("Dropped");
                        }
                    }
                },
                None => {
                    println!("Spotify query returned no data.");
                }
            }
    }
}
