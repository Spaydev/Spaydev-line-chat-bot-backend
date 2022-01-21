const cron = require('node-cron');
const dayjs = require('dayjs')
require('dotenv').config()
const AboutAlertCoin = require('../models/AboutAlertCoin');
const transactionBot = require('../models/transactionBot');

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
cron.schedule("*/2 * * * * *",async function() {
    getuserNFTTime = await getUserIndataBase() 
    console.log("Fetch Data (getuserNFTTime)".brightGreen);
});

////main
cron.schedule("*/30 * * * * *",async function() {
    console.log(dayjs(new Date()).format('HH:mm'));
    await proccessTimeMyNFT(getuserNFTTime)
});


getUserIndataBase = async(req,res) =>{

   const result = await AboutAlertCoin.getUserTimeToPlay()
   data =[]
   for (let i = 0; i < result.length; i++) {
        obj = {
            'userLineId':result[i].userLineId,
            'name':result[i].name,
            'text':result[i].text,
            'time':result[i].time_alert
        }
       data.push(obj)
   }
   return data

}

proccessTimeMyNFT = async(req,res) =>{
    const nowTime = dayjs(new Date()).format('HH:mm')
    data = []
    for (var i = 0; i < req.length; i++) { 
        req[i].time == nowTime ? pushMessageLineBot(req[i]) : ''

    }
}

pushMessageLineBot = async(req,res) =>{
    console.log(req);
    const msg = {
        "type": "flex",
        "altText": "Hey Yho",
        "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "🚨 It's time "+req.time,
                  "weight": "bold",
                  "size": "lg",
                  "color": "#FF5100FF",
                  "wrap": true,
                  "contents": []
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "About : "+req.name,
                      "weight": "bold",
                      "size": "md",
                      "color": "#126975FF",
                      "flex": 0,
                      "wrap": true,
                      "contents": []
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Des : "+req.text,
                      "contents": []
                    }
                  ]
                }
              ]
            }
          }
    }

    console.log(msg);
      
    await client.pushMessage(req.userLineId, msg)
        .then(async(response) => {
            //  transactionBot(err)
          console.log(response);
        })
        .catch(async(err) => {
            //  transactionBot(err)
            console.log(err);
        });

}


