import { createClient, SchemaFieldTypes } from 'redis';
const client = createClient({url: "redis://default:7JPzSgykN1ytv8ezs8PbLb8VhNXvisUt@redis-12720.c250.eu-central-1-1.ec2.cloud.redislabs.com:12720"});
client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();
try {
    await client.ft.create('idx:artists', {
        uri: SchemaFieldTypes.TEXT
    }, {
        ON: 'HASH',
        PREFIX: 'artist'
    });
} catch (e) {
    if (e.message === 'Index already exists') {
        console.log('Index exists already, skipped creation.');
    } else {
        // Something went wrong, perhaps RediSearch isn't installed...
        console.error(e);
        process.exit(1);
    }
}

const results = await client.ft.search('idx:artists', '@uri:{'+"spotify:artist:5ZEAzHE2TzAwUcOj6jMIgf"+'}');
console.log(results);