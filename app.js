const express = require('express')
const app = express()
const port = process.env.EXPRESS_PORT || 3000
const bodyParser = require('body-parser');
require('dotenv').config()

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_SV);
const dbName = process.env.MONGODB_DB_NMAE;

async function connect_mongo() {
  await client.connect();
  return "Connected successfully to server \n###Let's Goooo MongoDB###"
}

connect_mongo().then(console.log).catch(console.error).finally(() => client.close());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb'}))

const routeIndex = require('./routes/routeIndex')
app.use('/', routeIndex)

app.listen(port, '0.0.0.0', async () => {
  console.log(`Example app listening at http://localhost:${port}`)
})