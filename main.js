import fs from 'fs'
import buddyList from 'spotify-buddylist'
import cron from 'node-cron'
import {testStorenGet} from "./modules/redis.js"

testStorenGet(await getFromFile("url"));
cron.schedule('* * * * *', async () => {
    const { accessToken } = await buddyList.getWebAccessToken(await getFromFile("spotify-token"));
    const friendActivity = await buddyList.getFriendActivity(accessToken);

    Array.from(friendActivity.friends).forEach(element => {
        if (element["user"]["name"] == "Felix") {
            console.log(element.track.name + " from " + element.track.artist.name);
        }
    });
});
function getFromFile(key){
    
        var value = new Promise(function(resolve, reject)
        {fs.readFile('./config.cfg', 'utf8', async (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            var config = await JSON.parse(data);
            resolve(config[key]);
            })
        
        })
    return value;
}