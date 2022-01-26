const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');
const dayjs = require('dayjs')
const {ObjectId} = require('mongodb'); 


module.exports.addmyCoin = async(req,res) =>{
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("mycoin")

    let obj = {

        "userLineId": req.source.userId,
        "coin": req.message.text.split(" ")[1],
        'status':true,
        'created_at': new Date(),
        'updated_at': new Date()
       
    }

    let query = [{
            '$match': {
                'userLineId': req.source.userId,
                'coin':req.message.text.split(" ")[1],
                'status':true,
            }
        }]
        
    await Transaction_space(req)
    const result = await col.aggregate(query).toArray()
    console.log(result);
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

    await Transaction_space(req)
    const result = await col.aggregate(query).toArray()
    if(result[0]){
        console.log();
        for (let i = 0; i < result.length; i++) {
            mycoin.push(result[i].coin)
        }
        return mycoin
    }

     
}

module.exports.rmmCoin = async(req,res) =>{  

    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("mycoin")

    let query = [{
        '$match': {
            'userLineId':req.source.userId,
            'coin':req.message.text.split(" ")[1],
        }
    }]
    
    await Transaction_space(req)
    const result = await col.aggregate(query).toArray() 
    .then(async result => {
        await col.deleteOne({'userLineId':req.source.userId,'coin':req.message.text.split(" ")[1],})
        return result[0]
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


    const time = req.postback.params.time
    const name = req.postback.data.split(" ")[1]
    const text = req.postback.data.split(" ")[2] ? req.postback.data.split(" ")[2] : ""
    data = {
        'userLineId':req.source.userId,
        'time_alert':time,
        'name':name,
        'text':text,
        'status':'ON',
        'created_at':new Date(),
        'updated_at':new Date(),
    }
    await Transaction_space(req)
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

    await Transaction_space(req)
    const result = await col.aggregate(query).toArray()
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err);
    });

    return result
    
   
}

module.exports.rmNftTime = async(req,res) =>{  
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("alert_nft_time")


    let query = [{
        '$match': {
            'userLineId':req.source.userId,
            '_id':new ObjectId(req.message.text.split(" ")[1])
        }
    }]

    await Transaction_space(req)
    const result = await col.aggregate(query).toArray() 
    .then(async result => {
        await col.deleteOne({'_id':new ObjectId(req.message.text.split(" ")[1])})
        return result[0]
    })
    .catch(err => {
        console.log(err);
        return false
    });;
    
    return result
   
}

module.exports.getUserTimeToPlay = async(req,res) =>{  
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("alert_nft_time")

    const result = await col.find({}).toArray()
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err);
    });

    return result
    
   
}

module.exports.addNewsToday = async(req,res) =>{  
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("news_today")

    obj = {
        categorie: req.categorie,
        title: req.title,
        link: req.link,
        image: req.image,
        content: req.content,
        date: req.date,
        created_at: new Date(),
        updated_at: new Date(),
    }
    const result = await col.insertOne(obj)
    .then(result => {
    })
    .catch(err => {
        console.log(err);
    });;
    

   
}

module.exports.getNewsToday = async(req,res) =>{  
    const clientMongo = mongoShare.getDATABASE();
    const col = clientMongo.collection("news_today")

    let query =[
        {
          '$sort': {
            '_id': -1
          }
        }, {
          '$limit': 1
        }
      ]

    const result = await col.aggregate(query).toArray()
    .then(result => {
        return result
    })
    .catch(err => {
        console.log(err);
    });;

    return result
   
}



Transaction_space = async(req,res) =>{ 

    let History = {}
    History.userLineId = req.source.userId
    History.command_data = req.message ? req.message : req.postback
    History.data = req
    History.type = req.type
    History.create_at = new Date()

    const clientMongo = mongoShare.getDATABASE();
    const col2 = clientMongo.collection("transaction_space")
    await col2.insertOne(History)
    .then(async result => {
        return true
    })
    .catch(err => {
        console.log(err);
        return false
    });;
   
}