import {storeData, getIdxLenght, getAlias} from "./redisDatabank.js"

export async function formatData(redisUrl, rawData, loopIndex) {
    
    if(rawData == undefined||rawData.timestamp == undefined||rawData.user == undefined||rawData.track == undefined)return [false,"api-error-01"];
    if(rawData.track.album == undefined||rawData.track.artist == undefined||rawData.track.context == undefined) return [false,"api-error-02"];

    let userIdx = await getAlias(redisUrl, rawData.user.uri);
    if(userIdx == null){
        let index = await getIdxLenght(redisUrl, "user");
        await storeData(redisUrl,("user:"+(Number(index)+Number(loopIndex))),{"uri":rawData.user.uri,"name":rawData.user.name});
        console.log("Created new Alias \""+ ("user:"+(Number(index)+Number(loopIndex))) +"\" for " + rawData.user.name)
        userIdx = index;
    } 

    let trackIdx = await getAlias(redisUrl, rawData.track.uri);
    if(trackIdx == null){
        let index = await getIdxLenght(redisUrl, "track");
        await storeData(redisUrl,("track:"+(Number(index)+Number(loopIndex))),{"uri":rawData.track.uri,"name":rawData.track.name});
        console.log("Created new Alias \""+ ("track:"+(Number(index)+Number(loopIndex))) +"\" for " + rawData.track.name)
        trackIdx = index;
    } 

    let albumIdx = await getAlias(redisUrl, rawData.track.album.uri);
    if(albumIdx == null){
        let index = await getIdxLenght(redisUrl, "album");
        await storeData(redisUrl,("album:"+(Number(index)+Number(loopIndex))),{"uri":rawData.track.album.uri,"name":rawData.track.album.name});
        console.log("Created new Alias \""+ ("album:"+(Number(index)+Number(loopIndex))) +"\" for " + rawData.track.album.name)
        albumIdx = index;
    } 
    
    let artistIdx = await getAlias(redisUrl, rawData.track.artist.uri);
    if(artistIdx == null){
        let index = await getIdxLenght(redisUrl, "artist");
        await storeData(redisUrl,("artist:"+(Number(index)+Number(loopIndex))),{"uri":rawData.track.artist.uri,"name":rawData.track.artist.name});
        console.log("Created new Alias \""+ ("artist:"+(Number(index)+Number(loopIndex))) +"\" for " + rawData.track.artist.name)
        artistIdx = index;
    } 
    let playlistIdx;
    if(rawData.track.context.uri.split(":")[1]=="playlist"){
        playlistIdx = await getAlias(redisUrl, rawData.track.context.uri);
        if(playlistIdx == null){
            let index = await getIdxLenght(redisUrl, "playlist");
            await storeData(redisUrl,("playlist:"+(Number(index)+Number(loopIndex))),{"uri":rawData.track.context.uri,"name":rawData.track.context.name});
            console.log("Created new Alias \""+ ("playlist:"+(Number(index)+Number(loopIndex))) +"\" for " + rawData.track.context.name)
            playlistIdx = index;
        } 
    }else{ 
        playlistIdx = "0"; 
    }

    let formatedData = {
        "user": userIdx,
        "track":trackIdx,
        "album":albumIdx,
        "artist":artistIdx,
        "playlist":playlistIdx
        
    };
    let key = "ts:"+(rawData.timestamp);
    return ([true, key, formatedData])
}