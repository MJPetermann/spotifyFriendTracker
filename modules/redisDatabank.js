import { SchemaFieldTypes } from 'redis';
import { cLog } from './logConsole.js';


export async function getAlias(client, uri, type){
  const result = await client.ft.search('idx:'+type, '@uri:'+uri.split(":")[2]);
  if (result.total > 0){
    let alias = result.documents[0].id.split(":")[1]
    return (alias)
  }else{
    return null
  }
}


export async function createIndex(client, userIdx){
  await client.ft.create('idx:datapoint:'+userIdx, {
    ts: SchemaFieldTypes.NUMERIC,
    user: SchemaFieldTypes.NUMERIC,
    track: SchemaFieldTypes.NUMERIC,
    artist: SchemaFieldTypes.NUMERIC,
    context: SchemaFieldTypes.NUMERIC
    }, {
      ON: 'HASH',
      PREFIX: ('dp:'+userIdx+":")
    }
  );
  cLog("Added Index: " + userIdx)
}

export async function createSetupIndex(client, valie, velu){
  await client.ft.create('idx:'+ valie, {
    name: SchemaFieldTypes.TEXT,
    uri: SchemaFieldTypes.TEXT
    }, {
      ON: 'HASH',
      PREFIX: (velu+":")
    }
  );
}
