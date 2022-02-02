import { createClient } from 'redis';

export async function testStorenGet(RedisUrl) 
{ 
  console.log("1");
  async () => {
    const client = createClient({
      url: RedisUrl
    });
    console.log("2");
    client.on('error', (err) => console.log('Redis Client Error', err));
    console.log("3");
    await client.connect();
    console.log("4");
    await client.set('key', 'value');
    const value = await client.get('key');
  }

}