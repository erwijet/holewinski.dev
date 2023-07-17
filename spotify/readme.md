## spotify.holewinski.dev

A service that publishes live current listening data for whatever track I'm playing on spotify right now.

### Explore the API

You can explore the [`openapi.json`](openapi.json) file [here](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/erwijet/holewinski.dev/main/spotify/openapi.json)

### Hosting your own

Want to run your own spotify current track service? No problem!

```sh
# create a copy of the `.env` template
$ cp .env.template .env
```

After you've created the copy, open up the new `.env` file and make sure to supply a value for each of the keys.

| Key                     | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | The client id of your spotify oauth project                             |
| `SPOTIFY_CLIENT_SECRET` | The client secret of your spotify oauth project                         |
| `SPOTIFY_REDIRECT_URI`  | The redirect URL to use for the oauth flow                              |
| `PASSKEY`               | The key to pass to the `/auth?passkey=` route to allow only you to auth |

Once the `.env` file has been set up, you're ready to build your image.

```sh
# ensure docker is running
$ docker info

# build the image
$ cd "holewinski.dev/spotify"
$ docker build . -t holewinski-dev/spotify:latest

# and then deploy!
$ docker run -d --name spt-cur-track-svc -p "8888:8888" holewinski-dev/spotify:latest
```