import main from "./../main.js";
import { createClient } from 'redis';
const client = createClient({
  url: main.url
});



export function printMsg() {
    client.on('error', err => {
      console.log('Error ' + err);
    });
  }
export function printMsg() {
    console.log("Node.js is awesome!");
}