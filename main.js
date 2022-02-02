const buddyList = require('spotify-buddylist')
const fs = require('fs')
const cron = require('node-cron')



fs.readFile('./config.cfg', 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    var config = await JSON.parse(data);
    const RedisUrl = config.url;
    cron.schedule('* * * * *', async () => {
        console.log(config);
        const {
            accessToken
        } = await buddyList.getWebAccessToken(config["spotify-token"]);
        const friendActivity = await buddyList.getFriendActivity(accessToken);

        Array.from(friendActivity.friends).forEach(element => {
            if (element["user"]["name"] == "Felix") {
                console.log(element.track.name + " from " + element.track.artist.name);
            
            }
        });
    });
})