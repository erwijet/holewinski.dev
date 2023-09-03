#!/usr/bin/env python3

## This is a plugin script for a custom iterm2 component that displays your current spotify track
## 
## Please place this script in your /Users/tyler/Library/Application Support/iTerm2/Scripts/AutoLaunch directory
## + note: you may need to create the 'AutoLaunch' directory
## + make sure to `$ pip3 install iterm2` and enable the python api in your iterm2 preferences
##
## You can read more about custom iterm2 statusbar components
## + here: https://iterm2.com/documentation-status-bar.html
## + and also here (if you like examples): https://iterm2.com/python-api/examples/statusbar.html

import iterm2
import json
from urllib.request import urlopen

HOST = "spotify.holewinski.dev" # update to whatever your host is :)

async def main(connection):
    component = iterm2.StatusBarComponent(
        short_description="Current Song",
        detailed_description="Display current spotify song",
        knobs=[],
        exemplar="🎧 Title - Artist",
        update_cadence=1,  # Update every second
        identifier="dev.holewinski.iterm2.statusbar.spotifycurrentsong"
    )

    @iterm2.StatusBarRPC
    async def clock_coroutine(knobs):
        payload = json.loads(urlopen(f"https://{HOST}/current").read())

        if not payload['has_data']:
            return ["No music playing"]
        
        title = payload['data']['title']
        artist = ", ".join([artist['name'] for artist in payload['data']['artists']])

        return [f"🎧 {title} - {artist}", f"{title}"]

    # Register the component and coroutine with iTerm2.
    await component.async_register(connection, clock_coroutine)

iterm2.run_forever(main)

