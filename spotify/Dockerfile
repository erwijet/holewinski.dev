# syntax=docker/dockerfile:1.3-labs
# ^ enable heredocs & buildkit: https://www.docker.com/blog/introduction-to-heredocs-in-dockerfiles/
# note: this requires either DOCKER_BUILDKIT=1 be set if not building with `$ docker buildx`

FROM rust:1.76 AS build

RUN cargo new /spotify
COPY ./Cargo.toml ./Cargo.lock /spotify/

WORKDIR /spotify
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

COPY ./ /spotify

RUN --mount=type=cache,target=/usr/local/cargo/registry <<EOF
  set -e
  # update timestamps to force a new build (this time with the actual sources)
  touch /spotify/src/main.rs
  cargo build --release
EOF

##

FROM debian:bullseye-slim AS app
COPY --from=build /spotify/target/release/spotify /spotify
COPY .env /.env

RUN <<EOF
  apt-get update
  apt-get install -y ca-certificates
  update-ca-certificates
EOF

CMD ["/spotify"]