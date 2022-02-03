import fs from 'fs'
import buddyList from 'spotify-buddylist'
import cron from 'node-cron'
import {storeData, getIdxLenght, getAlias, createIndex, checkTs} from "./modules/redisDatabank.js"
import {formatData} from "./modules/formatAndAlias.js"

cron.schedule('* * * * *', async () => {
    const { accessToken } = await buddyList.getWebAccessToken(await getFromFile("spotify-token"));
    const friendActivity = await buddyList.getFriendActivity(accessToken);
    Array.from(friendActivity.friends).forEach(async (element,index) => {
        var data = await formatData(await getFromFile("url"), element, index);
        if (data[0] == false || (data==undefined)){
            console.log("api-data uncomplete")
        }else if((await checkTs(await getFromFile("url"),data[1]))=="1"){
            console.log("timestamp is already added")
        }
        else{
            storeData(await getFromFile("url"), data[1], data[2]);
            console.log("added timestamp: \""+data[1]+"\"")
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