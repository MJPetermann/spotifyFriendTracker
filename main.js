import fs from 'fs'
import buddyList from 'spotify-buddylist'
import cron from 'node-cron'
import {
    createClient
} from 'redis';
import {
    cLog
} from './modules/logConsole.js';

import {
    getAlias,
    createIndex,
    createSetupIndex
} from "./modules/redisDatabank.js"
// import {formatData} from "./modules/formatAndAlias.js"

//  Testing

// await client.ft.dropIndex("idx:datapoint:0")
// await client.ft.dropIndex("idx:datapoint:1")
// await client.ft.dropIndex("idx:datapoint:2")
// await client.ft.dropIndex("idx:datapoint:3")
// await client.ft.dropIndex("idx:datapoint:4")
// await client.ft.dropIndex("idx:datapoint:5")
// await client.ft.dropIndex("idx:datapoint:6")
// await client.ft.dropIndex("idx:datapoint:7") 
// await client.ft.dropIndex("idx:datapoint:8") 
//  Format
//  dp: [userIdx]:  [dpIdx] 
//      ts:         [timestamp]
//      user:       [idx]
//      track:      [idx]
//      artist:     [idx]
//      context:    [idx]

//  WTG:
//      Check-User/s                                                    <-      [userURI, RedisSearch]
//          exists                      ->      [userIdx]   
//          doesnt exist
//              create Idx              ->      [userIdx]               <-      [RedisPush]
//      check last entry for timestamp                                  <-      [userIdx, timestamp]
//          same                        ->      [end]
//          new
//              Check other data 4 idx                                  <-      [track-/artist-/album-/playlistIdx]
//                  exists              ->      [*Idx]   
//                  doesnt exist
//                      create Idx      ->      [*Idx]                  <-      [RedisPush]
//      create new DP                                                   <-      [*Idx, userIdx, RedisPush]



cron.schedule('* * * * *', async () => {
    cLog("-----------------------------------")
    cLog("start - checking for new datapoints")
    cLog("-----------------------------------")
    const {
        accessToken
    } = await buddyList.getWebAccessToken(await getFromFile("spotify-token"));
    const friendActivity = await buddyList.getFriendActivity(accessToken);

    const client = createClient({
        url: (await getFromFile("url"))
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const checkValues = [
        "track",
        "track.artist",
        "track.context"
    ]

    let counts = {
        user: Number((await client.ft.info("idx:user")).numDocs),
        track: Number((await client.ft.info("idx:track")).numDocs),
        artist: Number((await client.ft.info("idx:artist")).numDocs),
        context: Number((await client.ft.info("idx:context")).numDocs)
    }

    for (let friend of friendActivity.friends) {
        if (!friend || !friend.user || !friend.track) continue;

        let usrIdx = await getAlias(client, friend.user.uri, "user")
        if (usrIdx && await dpExist(client, usrIdx, friend.timestamp)) continue;
        let dpData = {}

        if (!usrIdx) {
            await client.hSet("user:" + (counts.user), {
                name: friend.user.name,
                uri: friend.user.uri
            });
            usrIdx = (counts.user)
            await createIndex(client, usrIdx)
            cLog("added index [" + usrIdx + "] for user \""+friend.user.name+"\"")
            counts.user++
        }
        for (const value of checkValues) {
            let lastArrayValue = value.split(".").slice(-1)
            let idx = await getAlias(client, (friend[value] ?? friend[value.split(".")[0]][value.split(".")[1]]).uri, lastArrayValue)

            if (!idx) {
                await client.hSet(lastArrayValue + ":" + (counts[lastArrayValue]), {
                    name: (friend[value] ?? friend[value.split(".")[0]][value.split(".")[1]]).name,
                    uri: (friend[value] ?? friend[value.split(".")[0]][value.split(".")[1]]).uri
                });
                idx = (counts[lastArrayValue])
                counts[lastArrayValue]++
                cLog("added index [" + idx + "] for "+lastArrayValue+" \""+(friend[value] ?? friend[value.split(".")[0]][value.split(".")[1]]).name+"\"")
            }
            dpData[lastArrayValue] = idx;

        }
        dpData.ts = friend.timestamp
        dpData.user = usrIdx
        cLog("added datapoint:")
        cLog(JSON.stringify(dpData))
        await client.hSet("dp:" + usrIdx + ":" + (await client.ft.info("idx:datapoint:" + usrIdx)).numDocs, dpData)

        
    }
    await client.quit()
    async function dpExist(client, usrIdx, timestamp) {
        if ((await client.ft.search("idx:datapoint:" + usrIdx, '@ts:[' + timestamp + " " + timestamp + "]")).total > 0) return true;
        return false;
    }
    cLog("-----------------------------------")
    cLog("end - checking for new datapoints")
    cLog("-----------------------------------")
});


function getFromFile(key) {

    var value = new Promise(function (resolve, reject) {
        fs.readFile('./config.cfg', 'utf8', async (err, data) => {
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