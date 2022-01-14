const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');

module.exports.AboutAlertCoin = async(req,res) =>{
    console.log("models",req);
   
}

module.exports.addmyCoin = async(req,res) =>{
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("mycoin")
    let obj = {

        "userLineId": req.source.userId,
        "coin": req.message.text.split(" ")[1]
    }

    let query = [{
            '$match': {
                'userLineId': req.source.userId,
                'coin':req.message.text.split(" ")[1]
            }
        }]
    const result = await col.aggregate(query).toArray()
    if(result[0]){

        return result[0]

    }else if(!result[0]){
        
        const resultAddcoin = await col.insertOne(obj, function (err, result) {
            if (err) throw err;
            return
        });
        return result[0]
    }
 


     
}

module.exports.myCoin = async(req,res) =>{
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("mycoin")
    let query = [{
        '$match': {
            'userLineId': req.source.userId,
        }
    }]
    const mycoin = []
    const result = await col.aggregate(query).toArray()
    if(result[0]){
        for (let i = 0; i < result.length; i++) {
            mycoin.push(result[i].coin)
        }
        return mycoin
    }else{
        console.log("fials");
    }

     
}
