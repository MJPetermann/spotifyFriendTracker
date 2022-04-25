import fs from 'fs'
import buddyList from 'spotify-buddylist'
import cron from 'node-cron'

import {getAlias} from "./modules/redisDatabank.js"
import { count } from 'console';
// import {formatData} from "./modules/formatAndAlias.js"

//  Testing
const { accessToken } = await buddyList.getWebAccessToken(await getFromFile("spotify-token"));
const friendActivity = await buddyList.getFriendActivity(accessToken);

//  Format
//  dp: [userIdx]:  [dpIdx] 
//      ts:         [timestamp]
//      user:       [idx]
//      track:      [idx]
//      artist:     [idx]
//      album:      [idx]
//      playlist:   [idx]

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




let storeList = []
let counts = await getIdxCounts();    //{user:[numOfUsers],track:[num*]...}
for(let friend of friendActivity.friends){
    if(!friend || !friend.user || !friend.track) continue;

    let usrIdx = await getAlias(await getFromFile("url"), friend.user.uri)
    if(usrIdx && dpExist(usrIdx)) continue;
    if(!usrIdx){
        storeList.push({["user:"+(counts.user+1)]:{name:friend.user.name,uri:friend.user.uri}});
        usrIdx = (counts.user+1)
        count.user++
    }
    
    console.log(friend.user.uri)
    dpList.push()
}

// cron.schedule('* * * * *', async () => {
//     const { accessToken } = await buddyList.getWebAccessToken(await getFromFile("spotify-token"));
//     const friendActivity = await buddyList.getFriendActivity(accessToken);
//     Array.from(friendActivity.friends).forEach(async (element,index) => {
//         var data = await formatData(await getFromFile("url"), element, index);
//         if (data[0] == false || (data==undefined)){
//             console.log("api-data uncomplete")
//         }else if((await checkEntry(await getFromFile("url"),data[1]))=="1"){
//             console.log("timestamp is already added")
//         }
//         else{
//             storeData(await getFromFile("url"), data[1], data[2]);
//             console.log("added timestamp: \""+data[1]+"\"")
//         }
//     });
// });


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