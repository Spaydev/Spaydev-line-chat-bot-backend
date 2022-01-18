const cron = require('node-cron');
const dayjs = require('dayjs')
require('dotenv').config()
const AboutAlertCoin = require('../models/AboutAlertCoin');
const line = require('@line/bot-sdk');
const colors = require('colors');


//////////////// config  ////////////////
const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};
const client = new line.Client(config);


////update data base every 15 second
let getuserNFTTime
cron.schedule("*/15 * * * * *",async function() {
    getuserNFTTime = await getUserIndataBase() 
    console.log("(getuserNFTTime) DATA BASE HAVE UPDATE".brightGreen);
});

////main
cron.schedule("*/15 * * * * *",async function() {
    console.log(dayjs(new Date()).format('HH:mm'));
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
    const nowTime = dayjs(new Date()).format('HH:mm')
    data = []
    for (var i = 0; i < req.length; i++) { 
        req[i].time_alert == nowTime ? pushMessageLineBot(req[i]) : ''

    }
}

pushMessageLineBot = async(req,res) =>{
    const msg = [{
        "type": "text",
        "text": `Hey`
      },{
        "type": "template",
        "altText": `${req.time_alert} | ${req.name_nft_game}`,
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
        //   console.log(response);
        })
        .catch((err) => {
          console.log("pushMessage",err);
        });

}


