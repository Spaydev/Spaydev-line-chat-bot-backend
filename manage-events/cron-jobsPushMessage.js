const cron = require('node-cron');
const dayjs = require('dayjs')
require('dotenv').config()
const AboutAlertCoin = require('../models/AboutAlertCoin');
const line = require('@line/bot-sdk');


//////////////// config  ////////////////
const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};
const client = new line.Client(config);


////update data base every 15min
let getuserNFTTime
cron.schedule("*/15 * * * * *",async function() {
    getuserNFTTime = await getUserIndataBase() 
    console.log("(getuserNFTTime) DATA BASE HAVE UPDATED ");
});

////main
cron.schedule("*/5 * * * * *",async function() {
    console.log(dayjs(new Date()).format('hh:mm'));
    await proccessTimeMyNFT(getuserNFTTime)
});


getUserIndataBase = async(req,res) =>{

   const result = await AboutAlertCoin.userNftTime()
   data =[]
   for (let i = 0; i < result.length; i++) {
        obj = {
            'userLineId':result[i].userLineId,
            'time_alert':result[i].time_alert,
            'name_nft_game':result[i].name_nft_game,
        }
       data.push(obj)
   }
   return data

}

proccessTimeMyNFT = async(req,res) =>{
    const nowTime = dayjs(new Date()).format('hh:mm')
    data = []
    for (var i = 0; i < req.length; i++) { 
        if(req[i].time_alert == nowTime ){
            pushMessageLineBot(req[i]) 
        }
        
    }
}

pushMessageLineBot = async(req,res) =>{
    const msg = [{
        "type": "text",
        "text": `Hey @Spay`
      },{
        "type": "template",
        "altText": "this is a buttons template",
        "template": {
            "type": "buttons",
            "title": `🚨 NFT time has arrived. ${req.time_alert}`,
            "text": `${req.name_nft_game}`,
            "actions": [
            {
                "type": "message",
                "label": "check my NFT time",
                "text": "!mynfttime"
            }
            ]
        }
        }]
      
    await client.pushMessage(req.userLineId, msg)
        .then((response) => {
        //   console.log("ok");
        })
        .catch((err) => {
          console.log(err);
        });

}


