import { createClient, SchemaFieldTypes } from 'redis';
import date from 'date-and-time';

export async function storeData(RedisUrl, key, data) 
{ 
  //let now = date.format(new Date(),'YYYY-MM-DD_HH:mm');
  const client = createClient({
    url: RedisUrl
  });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  
  await client.hSet(key, data);
 
  await client.quit();
  

}
export async function getIdxLenght(RedisUrl, type) 
{ 
  const client = createClient({
    url: RedisUrl
  });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  let IdxLenght = (await client.ft.info("idx:"+type+"s")).numDocs
  await client.quit();
  return IdxLenght;

}

export async function getAlias(RedisUrl, uri){
  let type = uri.split(":")[1]+"s";
  const client = createClient({
    url: RedisUrl
  });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  const result = await client.ft.search('idx:'+type, '@uri:'+uri.split(":")[2]);
  if (result.total > 0){
    let alias = (await client.ft.search('idx:'+type, '@uri:'+uri.split(":")[2])).documents[0].id.split(":")[1]
    await client.quit();
    return (alias)
  }else{
    await client.quit();
    return null
  }
  
}


export async function createIndex(RedisUrl){
  const client = createClient({
    url: RedisUrl
  });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.ft.create('idx:timestamps', {
    user: SchemaFieldTypes.NUMERIC,
    track: SchemaFieldTypes.NUMERIC,
    album: SchemaFieldTypes.NUMERIC,
    artist: SchemaFieldTypes.NUMERIC,
    playlist: SchemaFieldTypes.NUMERIC,
    }, {
      ON: 'HASH',
      PREFIX: 'ts'
    }
  );
  await client.quit();
}

export async function checkTs(RedisUrl, timestamp){
  const client = createClient({
    url: RedisUrl
  });
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  if(await client.exists(timestamp) == 1){
    await client.quit();
    return 1
  }else{
    await client.quit();
    return 0
  }
}