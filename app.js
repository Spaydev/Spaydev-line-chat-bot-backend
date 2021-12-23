const express = require('express')
const app = express()
const port = process.env.EXPRESS_PORT || 3000
const bodyParser = require('body-parser');
require('dotenv').config()
const colors = require('colors');


//////connext DB
var connextDB = require( './connextDB' );
connextDB.connectDB( function( err, client ) {
  if (err){
    console.log(err);
  }else{
    console.log(`${colors.underline("MONGO_DB_CONNEXT_SHARING SUCCESS !!")}`);
  }
} );


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb'}))


const routeIndex = require('./routes/routeIndex')
app.use('/', routeIndex)


app.listen(port, '0.0.0.0', async () => {
  console.log(`${colors.yellow(`SERVER RUN http://localhost:${port}`)}`)
})