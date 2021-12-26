const MongoClient = require( 'mongodb' ).MongoClient;
let _db;

module.exports = {

    connectDB: async function( callback ) {
      await MongoClient.connect( process.env.MONGODB_SV,  { useNewUrlParser: true }, function( err, client ) {
      _db = client.db('demo_chat');
      return callback( err );
    } );
  },

  getDATABASE: function() {
    return _db;
  }

};