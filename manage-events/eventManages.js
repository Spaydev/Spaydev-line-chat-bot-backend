const axios = require('axios');
require('dotenv').config()
const puppeteer = require('puppeteer')
const line = require('@line/bot-sdk');
const CC = require('currency-converter-lt')
const AboutAlertCoin = require('../models/AboutAlertCoin');
let currencyConverter = new CC()

//////////////// config  ////////////////
const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};
const client = new line.Client(config);


module.exports.EventManage = async(req,res) =>{
    const event = req.body.events[0]

    handleMessageEvent(event)

   async function handleMessageEvent(event) {

        let msg = {
            type: 'text',
            text: 'toow the moon'
        };
    
        let eventText = event.message.text.toUpperCase();
    
        if (eventText === 'TODAY') {
            msg = {
              "type": "text",
              "text": "TO DAY"
            }
        }else if (eventText === 'TOPCOINSDEFIGAME') {
          const topCoinToday = await getListTopGamesCryptoToday()
          console.log(topCoinToday);
          objAdd = [];
          msg = [{
            "type": "text",
            "text": "TOP COIN TO DAY"
        },{
              "type": "template",
              "altText": "this is a carousel template",
              "template": {
                "type": "carousel",
                "imageSize": "contain",
                "columns": objAdd
            }
          }]
         Object.keys(topCoinToday).map( function(key, index) {
                data = {
                  "thumbnailImageUrl": topCoinToday[index].chart,
                  "title": topCoinToday[index].rank+". "+topCoinToday[index].name,
                  "text": "balance : "+topCoinToday[index].balance +"\nvalume : "+topCoinToday[index].valume,
                  "actions": [
                    {
                      "type": "message",
                      "label": "View detail",
                      "text": "Choose LINE Brown Card"
                    }
                  ]
                }
                objAdd.push(data)
          });
        } else if (eventText === 'COMMAND') {
            msg = {
              "type": "template",
              "altText": "this is a command list",
              "template": {
                "type": "buttons",
                "imageBackgroundColor": "#C6F016",
                "title": "command list",
                "text": " ",
                "actions": [
                  {
                    "type": "message",
                    "label": "News",
                    "text": "today"
                  },
                  {
                    "type": "message",
                    "label": "Top Gamefi Coins",
                    "text": "topcoindefigame"
                  },
                  {
                    "type": "message",
                    "label": "My coin",
                    "text": "mycoin"
                  },
                  {
                    "type": "message",
                    "label": "Add coin",
                    "text": "!addcoin"
                  }
                ]
              }
            } 
        }else if(eventText.split(" ")[0] === '!ADDCOIN'){

          const coin = eventText.split(" ")[1] || null
          const price = await new CC({ from:"USD", to:"THB", amount:0.933289 }).convert()
          console.log(price);


        }else if(eventText.split(" ")[0] === 'MYCOIN'){

          msg = [];
          const getCoinUser = await AboutAlertCoin.myCoin(event)
          const getCoinAPI = await getDetailCoin(getCoinUser)
          console.log(getCoinAPI);
          for (let i = 0; i < getCoinAPI.length; i++) {
            const price_coin = parseFloat(getCoinAPI[i].data.price)
            let currencyConverter = await new CC({from:"USD", to:"THB", amount:price_coin}).convert();
            obj = {
              "type": "text",
              "text": `${getCoinAPI[i].data.name} coin : ${getCoinAPI[i].data.symbol}\n\nUSD : ${parseFloat(getCoinAPI[i].data.price).toFixed(3)}\nTHB : ${currencyConverter}\n\ntoken : ${getCoinAPI[i].data.token}`
            }
            msg.push(obj)
          }
        }
    
        return await client.replyMessage(event.replyToken, msg);
    }
    

    
    
}
///// get top list on web https://dappradar.com/rankings/category/games
getListTopGamesCryptoToday = async(req,res) =>{
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    const objCrypto = []

    await page.goto('https://crypto.com/price/categories/gamefi')
    for(i = 4; i < 11; i++){

        let nameElemet = await page.waitForSelector("#__next > div.css-19qzm77 > div.chakra-container.css-p5b43h > div > div.css-1y0bycm > table > tbody > tr:nth-child("+i+") > td.css-1qxvubu > div > a > span.chakra-text.css-1mrk1dy")
        let name = await page.evaluate(nameElemet => nameElemet.textContent, nameElemet)

        let coinElemet = await page.waitForSelector("#__next > div.css-19qzm77 > div.chakra-container.css-p5b43h > div > div.css-1y0bycm > table > tbody > tr:nth-child("+i+") > td.css-1qxvubu > div > a > span.chakra-text.css-44ctie")
        let coin = await page.evaluate(coinElemet => coinElemet.textContent, coinElemet)

        let priceElemet = await page.waitForSelector("#__next > div.css-19qzm77 > div.chakra-container.css-p5b43h > div > div.css-1y0bycm > table > tbody > tr:nth-child("+i+") > td.css-1fhswl6 > div > a")
        let price = await page.evaluate(priceElemet => priceElemet.textContent, priceElemet)

        objCrypto.push({name,coin,price})
    }

    browser.close()
    return objCrypto

}

getDetailCoin = async(token) =>{
  obj = []
  for (let i = 0; i < token[0].coin.length; i++) {
    await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${token[0].coin[i]}`)
    .then(function (response) {
      obj.push(response.data)
      obj[i].push(obj[i].data.token = token[0].coin[i])
    }).catch(error=>{
    });
  }
  return obj 
}