const cron = require('node-cron');
const dayjs = require('dayjs')
require('dotenv').config()
const AboutAlertCoin = require('../models/AboutAlertCoin');
const transactionBot = require('../models/transactionBot');
const axios = require('axios');
const line = require('@line/bot-sdk');
const colors = require('colors');
const cheerio = require("cheerio");
const timeBroadcastMessage = "07:00"

//////////////// config  ////////////////
const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};
const client = new line.Client(config);

////get news every 12 hr
cron.schedule("0 */12 * * *",async function() {
    await addNewsNFTGAME()
    console.log("Fetch News NFT GAME (NewsNFTGAME)".brightGreen);
});

////update data mytime every 15 second
cron.schedule("*/60 * * * * *",async function() {

    await sendBroadcastMessageToUser()
    const getuserNFTTime = await getUserIndataBase() 
    await proccessTimeMyNFT(getuserNFTTime)

    console.log("Fetch Data (getuserNFTTime)".brightGreen);
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


addNewsNFTGAME = async(req,res) =>{
  const url = "https://nftplazas.com/nft-gaming-news/";
  let obj = {};
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const ArrayGame = [];

    const Categories = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_categories");
    const Title = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_title");
    const Link = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_title");
    const Image = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_featured");
    const Content = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_body ");
    const DateTime = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_meta");

    Categories.each((idx, el) => { 
      obj.categorie = $(el).children("").text();
    });

    Title.each((idx, el) => {
      obj.title = $(el).children("").text();
    });

    Link.each((idx, el) => {
      obj.link = $(el).children("").attr('href');
    });

    Image.each((idx, el) => {
      obj.image = $(el).children("").attr('src');
    });

    Content.each((idx, el) => {
      obj.content = $(el).children(".post_content").text().replace(/\r?\n?\t|\r/g, "");
    });

    DateTime.each((idx, el) => {
      obj.date = $(el).children(".post_date").text();
    });
    
  } catch (err) {
    console.error(err);
  }
  await AboutAlertCoin.addNewsToday(obj)
}


sendBroadcastMessageToUser = async(req,res) =>{
  const nowTime = dayjs(new Date()).format('HH:mm')
  const resultNews = await AboutAlertCoin.getNewsToday()
  if(timeBroadcastMessage == nowTime){

      msg = [{
        "type": "flex",
        "altText": "NEWS TO DAYS !!!!",
        "contents": {
          "type": "bubble",
          "header": {
            "type": "box",
            "layout": "horizontal",
            "backgroundColor": "#FFFFFFFF",
            "borderColor": "#FFFFFFFF",
            "contents": [
              {
                "type": "text",
                "text": "NFT Gaming News",
                "weight": "bold",
                "size": "xs",
                "color": "#2E2E2EFF",
                "contents": []
              },
              {
                "type": "text",
                "text": "02/01/2022",
                "weight": "regular",
                "size": "xxs",
                "color": "#2B6BA0FF",
                "align": "end",
                "contents": []
              }
            ]
          },
          "hero": {
            "type": "image",
            "url": "https://nftplazas.com/wp-content/uploads/2021/09/Mix-247x203.jpg",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "label": "Action",
              "uri": "https://linecorp.com/"
            }
          },
          "body": {
            "type": "box",
            "layout": "horizontal",
            "spacing": "md",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "flex": 2,
                "spacing": "md",
                "contents": [
                  {
                    "type": "text",
                    "text": "MixMarvel & Polygon Studios Team Up to Enrich the Blockchain Gaming Ex...",
                    "weight": "bold",
                    "color": "#1A7E97FF",
                    "flex": 1,
                    "contents": []
                  },
                  {
                    "type": "separator"
                  },
                  {
                    "type": "text",
                    "text": "Polygon Studios, the gaming and NFT arm of Polygon, announced its late",
                    "weight": "regular",
                    "flex": 2,
                    "gravity": "center",
                    "contents": []
                  }
                ]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "More",
                  "uri": "https://linecorp.com"
                },
                "color": "#0AAA6DFF",
                "style": "primary"
              }
            ]
          }
        }
      }]
    await client.broadcast(msg)
    .then(async(response) => {
        //  transactionBot(err)
      console.log(response);
    })
    .catch(async(err) => {
        //  transactionBot(err)
        console.log(err);
    });
  }
}
