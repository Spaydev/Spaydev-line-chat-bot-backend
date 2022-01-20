const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');
const dayjs = require('dayjs')

module.exports.AboutAlertCoin = async(req,res) =>{
    console.log("models",req);
   
}

module.exports.addmyCoin = async(req,res) =>{
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("mycoin")

    let obj = {

        "userLineId": req.source.userId,
        'status':true,
        'created_at': new Date(),
        'updated_at': new Date(),
        "coin": req.message.text.split(" ")[1]
    }

    let query = [{
            '$match': {
                'userLineId': req.source.userId,
                'coin':req.message.text.split(" ")[1],
                'status':true,
                'created_at': new Date(),
                'updated_at': new Date(),
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
        console.log();
        for (let i = 0; i < result.length; i++) {
            mycoin.push(result[i].coin)
        }
        return mycoin
    }

     
}


module.exports.followCoin = async(req,res) =>{
    let data = {
        'userLineId':req.event.source.userId,
        'token': req.token,
        'price': req.priceAlert,
        'created_at': new Date(),
        'updated_at': new Date(),
    }
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("followcoin")

    const result = await col.insertOne(data)
        .then(result => {
            return true
        })
        .catch(err => {
            console.log(err);
            return false
        });;
    return result

     
}

module.exports.addNftTime = async(req,res) =>{  

    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("alert_nft_time")
    const userTextCommand =  req.message.text 
    const more_message_cmd = req.message.text.split(" ")[3] ? " "+req.message.text.split(" ")[3] : ''
    const time = userTextCommand.split(" ")[1]
    data = {
        'userLineId':req.source.userId,
        'time_alert':time,
        'name_nft_game':userTextCommand.split(" ")[2]+more_message_cmd,
        'status':'ON',
        'created_at':new Date(),
        'updated_at':new Date(),
    }

    const result = await col.insertOne(data)
    .then(result => {
        return data
    })
    .catch(err => {
        console.log(err);
        return false
    });;
    
    return result
   
}

module.exports.myNftTime = async(req,res) =>{  
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("alert_nft_time")

    let query = [{
        '$match': {
            'userLineId': req.source.userId,
        }
    }]
    const result = await col.aggregate(query).toArray()
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err);
        return false
    });;
    
    return result
   
}


module.exports.userNftTime = async(req,res) =>{  

    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("alert_nft_time")
    data =[]
    const result = await col.find({}).toArray()
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err);
        return false
    });;
    return result
   
}