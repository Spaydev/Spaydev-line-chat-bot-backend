const express = require('express')
const app = express()
const port = process.env.EXPRESS_PORT || 3000
const bodyParser = require('body-parser');
require('dotenv').config()
const colors = require('colors');
var cors = require('cors')
const server = require('http').createServer(app);
require('./manage-events-controllers/cron-jobsPushMessage.js');

//////cors
app.use(cors())

//////connect DB
var connextDB = require( './connextDB' );
connextDB.connectDB( function( err, client ) {
  err ? console.log(err) : console.log(`${colors.underline("MONGO_DB_CONNEXT_SHARING SUCCESS !!")}`);
});

//////bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb'}))


//////routes
const routeIndex = require('./routes/routeIndex')
app.use('/', routeIndex)


server.listen(port, '0.0.0.0', async () => {
    console.log(`${colors.yellow(`SERVER RUN http://localhost:${port}`)}`);
});

