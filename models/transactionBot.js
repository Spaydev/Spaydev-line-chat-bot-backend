const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');

module.exports.transactionBot = async(req,res) =>{
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("transaction_bot")

    console.log(req);


}