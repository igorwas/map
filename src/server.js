const WebSocket = require('ws');
const { MongoClient, ReadPreference } = require('mongodb');

const wss = new WebSocket.Server({ port: 3030 });
const MONGO_URL = 'mongodb+srv://igorwas:igortest@testtask.alfym.mongodb.net/test';

wss.on('connection', function connection(ws) {

  (async () => {
    console.log('start')
    const mongoClient = await MongoClient.connect(MONGO_URL, {
      appname: 'test',
      readPreference: ReadPreference.PRIMARY,
      useNewUrlParser: true,
    });
    const db = await mongoClient.db('test');

    const changeStream = db.collection('markers').watch([], { 'fullDocument': 'updateLookup' });

    changeStream.on('change', (event) => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(event.fullDocument));
        }
      });
    });
  })();
});