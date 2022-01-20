const MongoClient = require( 'mongodb' ).MongoClient;
var ObjectID = require('mongodb').ObjectID;
let _db;

module.exports = {

    connectDB: async function( callback ) {
      await MongoClient.connect( process.env.MONGODB_SV,  { useNewUrlParser: true }, function( err, client ) {
      _db = client.db(process.env.MONGODB_DB_NAME);
      return callback( err );
    } );
  },

  getDATABASE: function() {
    return _db;
  }



};