FROM rust:bullseye as deps-builder

RUN cd /tmp && cargo new app
COPY Cargo.* /tmp/app

WORKDIR /tmp/app

RUN cargo install cargo-build-deps
RUN cargo build-deps --release

##

FROM rust:bullseye
WORKDIR /app

COPY --from=deps-builder /tmp/app/target/ /app/target

COPY ./ /app
RUN cargo build --release

CMD ["./target/release/spotify"]