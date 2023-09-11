use std::{sync::Arc, time::Duration};

use axum::extract::ws::{Message, WebSocket};
use futures::lock::Mutex;
use tokio::time::interval;

pub async fn ws_heartbeat(clients_mtx: Arc<Mutex<Vec<WebSocket>>>) {
    let mut interval = interval(Duration::from_secs(2));
    interval.tick().await;

    loop {
        interval.tick().await;
        let mut clients = clients_mtx.lock().await;

        let len = clients.len();
        for index in (0..len).rev() {
            if let Err(_) = clients[index]
                .send(Message::Ping(vec![7, 1, 9, 6, 2, 3]))
                .await
            {
                println!("!! Could not ping clients@{index}. Dropping client...");
                clients.remove(index).close().await.ok();
                println!("clients@{index} dropped ✔️");
            }
        }
    }
}
