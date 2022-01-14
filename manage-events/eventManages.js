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

            if(coin === null){
                msg = [{
                    "type": "text",
                    "text": "example\n\n !addcoin token"
                }]
            }else if(coin.length == 42 && coin !== null ){
                const result = await AboutAlertCoin.addmyCoin(event)
                if(result != undefined){
                    msg = [{
                        "type": "text",
                        "text": "Token is already"
                    }]
                }else if(result == undefined){
                    msg = [{
                        "type": "text",
                        "text": "Coins have been added"
                    }]
                }
            
          }else if(coin.length < 42){
            msg = {
              "type": "template",
              "altText": "this is a buttons template",
              "template": {
                "type": "buttons",
                "title": "Question 1",
                "text": "Where do you spend your money most ? ",
              
              }
            }
          }
          
          // console.log(coin);

        }else if(eventText.split(" ")[0] === 'MYCOIN'){

          msg = [
              {
                "type": "text",
                "text":"Your Coins"
              },{
                "type": "sticker",
                "packageId": "11537",
                "stickerId": "52002759"
              }
          ];
          const getCoinUser = await AboutAlertCoin.myCoin(event)
          const getCoinAPI = await getDetailCoin(getCoinUser)

          for (let i = 0; i < getCoinAPI.length; i++) {
            const price_coin = parseFloat(getCoinAPI[i].price) 
            let currencyConverter = await new CC({from:"USD", to:"THB", amount:price_coin}).convert();
            obj = {
              "type": "text",
              "text": `${getCoinAPI[i].name} coin : ${getCoinAPI[i].symbol}\n\nUSD : ${parseFloat(getCoinAPI[i].price).toFixed(3)}\nTHB : ${currencyConverter}\n\ntoken : ${getCoinAPI[i].token}`
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
    objCoins = []
    for (let i = 0; i < token.length; i++) {
        await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${token[i]}`)
        .then(function (response) {
            data = { 
                name:response.data.data.name,
                symbol:response.data.data.symbol,
                price:response.data.data.price,
                price_BNB:response.data.data.price_BNB,
                token:token[i]
            }
            objCoins.push(data)
        }).catch(error=>{
            // obj.push(token[i]+" Token by address: Invalid address")
        });
    } 
    console.log(objCoins);
  return objCoins 
}