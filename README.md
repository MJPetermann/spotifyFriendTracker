# spotifyFriendTracker
This programm written with Node.js can request the latest music your friends been listing to from spotify and stores this information with a timestamp in a database. To reduce storage usage every information is automaticly indexed and only referenced by the timestamps. 

## Requirements
- a redis database (30 MB for free with the [official hosting solution](https://redis.com/try-free/))
- spotify premium
- friends (you can also just follow other people, as long as they share their activity)

## Installation
1. clone the repo `git clone https://github.com/MJPetermann/spotifyFriendTracker.git`
2. install the needed modules`npm install`
2. get your `spotify-token` with the help of [this guide](https://github.com/MJPetermann/spotifyFriendTracker#getting-the-spotify-token).
3. create config.cfg and paste this inside:
   ```
   {
      "spotify-token": "<spotify token>",
      "url": "<redis url>"
   }
   ```
4. replace <redis url> and <spotify token> with your respected `spotify-token` and `redis-url`.
5. start the tracking `npm start`
   
## Getting the `spotify-token`
(these instructions only are for Desktop Chrome)
1. sign in on the [offical spotify webinterface](https://open.spotify.com/)
2. open developer tool(f12)
3. change section to Application
4. look up the value of the `sp_dc` Cookie under `Cookies`/`https://open.spotify.com`
