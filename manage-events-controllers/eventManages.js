const axios = require('axios');
require('dotenv').config()
const puppeteer = require('puppeteer')
const line = require('@line/bot-sdk');
const CC = require('currency-converter-lt')
const AboutAlertCoin = require('../models/AboutAlertCoin');
let currencyConverter = new CC()
const dayjs = require('dayjs')


//////////////// config  ////////////////
const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};
const client = new line.Client(config);


module.exports.EventManage = async(req,res) =>{
    const event = req.body.events[0]
    console.log(event);

    handleMessageEvent(event)

   async function handleMessageEvent(event) {
    
        let msg = [{ 
            "type": "text",
            "text": "🤖 : What do you want sir?"
        },{ 
            "type": "text",
            "text": "👉 can use !command"
        }];
        if(event.message){
            const eventText = event.message.text.toUpperCase()

            if (eventText.split(" ")[0] === '!TODAY') {
                const resultNews = await AboutAlertCoin.getNewsToday()
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
                            "text": resultNews[0].categorie,
                            "weight": "bold",
                            "size": "xs",
                            "color": "#2E2E2EFF",
                            "contents": []
                          },
                          {
                            "type": "text",
                            "text":  dayjs(resultNews[0].created_at).format('DD/MM/YYYY'),
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
                        "url": resultNews[0].image,
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                          "type": "uri",
                          "label": "Action",
                          "uri": resultNews[0].link
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
                                "text": resultNews[0].title,
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
                                "text": resultNews[0].content,
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
                              "uri": resultNews[0].link
                            },
                            "color": "#0AAA6DFF",
                            "style": "primary"
                          }
                        ]
                      }
                    }
                  }]

            }else if (eventText.split(" ")[0] === '!TOPCOINS') {
                const coinData = await getListTopGamesCryptoToday()
                array=[]
                msg={
                    "type": "flex",
                    "altText": "TOP 5 COIN",
                    "contents": {
                        "type": "bubble",
                        "hero": {
                        "type": "image",
                        "url": "https://sv1.picz.in.th/images/2022/01/18/nEfSQn.jpg",
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                            "type": "uri",
                            "label": "Action",
                            "uri": "https://coinmarketcap.com/th/view/gaming/"
                        }
                        },
                        "body": {
                        "type": "box",
                        "layout": "vertical",
                        "spacing": "md",
                        "action": {
                            "type": "uri",
                            "label": "Action",
                            "uri": "https://coinmarketcap.com/th/view/gaming/"
                        },
                        "contents": [
                            {
                            "type": "text",
                            "text": "TOP 5",
                            "weight": "bold",
                            "size": "xl",
                            "contents": []
                            },
                            {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": array
                            }
                        ]
                        },
                        "footer": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                            "type": "spacer",
                            "size": "xxl"
                            },
                            {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "See",
                                "uri": "https://coinmarketcap.com/th/view/gaming/"
                            },
                            "color": "#905C44",
                            "style": "primary"
                            }
                        ]
                        }
                    }
                }
                for (let i = 0; i < coinData.length; i++) {
                    data={
                        "type": "box",
                        "layout": "baseline",
                        "contents": [
                        {
                            "type": "icon",
                            "url": coinData[i].image[0]
                        },
                        {
                            "type": "text",
                            "text": coinData[i].name,
                            "weight": "bold",
                            "margin": "sm",
                            "contents": []
                        },
                        {
                            "type": "text",
                            "text": `${coinData[i].marketcap}`,
                            "size": "sm",
                            "color": "#AAAAAA",
                            "align": "end",
                            "contents": []
                        }
                        ]
                    }
                    array.push(data)
                }
            } else if (eventText.split(" ")[0] === '!COMMAND') {
                msg = [{
                    "type": "flex",
                    "altText": "Your Coin",
                    "contents": {
                        "type": "bubble",
                        "direction": "ltr",
                        "hero": {
                          "type": "image",
                          "url": "https://www.img.in.th/images/e1052472fb66c53b91dc4d02dd7dfcfc.jpg",
                          "size": "4xl",
                          "aspectRatio": "1.51:1",
                          "aspectMode": "fit",
                          "backgroundColor": "#FFFFFFFF"
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "spacing": "sm",
                          "margin": "xl",
                          "contents": [
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "top coins",
                                "text": "!topcoins"
                              },
                              "color": "#205951FF",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "Mytime",
                                "text": "!mytime"
                              },
                              "color": "#205951FF",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "Mycoin",
                                "text": "!mycoin"
                              },
                              "color": "#205951FF",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "message",
                                "label": "new update",
                                "text": "!today"
                              },
                              "color": "#205951FF",
                              "style": "primary"
                            }
                          ]
                        }
                      }
                }];
            }else if(eventText.split(" ")[0] === '!ADDCOIN'){
                const coin = eventText.split(" ")[1] || null
                
                if(coin != null){
                    const coinTokenCheck = await getTokenInBlockChain(coin)
                    if(coinTokenCheck === true){
                        const result = await AboutAlertCoin.addmyCoin(event)
                        if(result != undefined){
                            msg = [{
                                "type": "text",
                                "text": "👍 Coins is already"
                            }]
                        }else if(result == undefined){
                            msg = [{
                                "type": "text",
                                "text": " ✅ Coins added"
                            }]
                        }
                    }else{
                        msg = [{
                            "type": "text",
                            "text": "❗️Could not find coin with the given id.\nplease check the token in web \nhttps://www.coingecko.com/en/searchbox"
                        }]
                    }   
                }else{
                    msg = [{
                        "type": "text",
                        "text": "❗️Invalid format.\n\n#example\n!addcoin token"
                    }]
                }
            
            // console.log(coin);

            }else if(eventText.split(" ")[0] === '!MYCOIN'){
                const getCoinUser = await AboutAlertCoin.myCoin(event)
                if(getCoinUser !== undefined){
                    const getCoinAPI = await getDetailCoin(getCoinUser)
                    console.log(getCoinAPI);
                    data=[];
                    msg = [{
                        "type": "flex",
                        "altText": "Your Coin",
                        "contents": {
                            "type": "carousel",
                            "contents": data
                        }
                    }];
                    for (let i = 0; i < getCoinAPI.length; i++) {
                        const colorLiveRate = getCoinAPI[i].changePercentage1h < 0 ? "#F05757FF" : "#31A047FF"
                        obj = {
                            "type": "bubble",
                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [
                                {
                                "type": "text",
                                "text": `${getCoinAPI[i].name} (${getCoinAPI[i].symbol})`,
                                "weight": "bold",
                                "size": "md",
                                "wrap": true,
                                "contents": []
                                },
                                {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                    "type": "icon",
                                    "url": getCoinAPI[i].image.small,
                                    "size": "4xl"
                                    }
                                ]
                                },
                                {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                    "type": "text",
                                    "text": "Price : "+getCoinAPI[i].price+" USD",
                                    "contents": []
                                    },
                                    {
                                    "type": "text",
                                    "text": ""+getCoinAPI[i].changePercentage1h+"%",
                                    "color": colorLiveRate,
                                    "align": "end",
                                    "gravity": "top",
                                    "contents": []
                                    }
                                ]
                                }
                            ]
                            },
                            "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [
                                {
                                "type": "button",
                                "action": {
                                    "type": "uri",
                                    "label": "more",
                                    "uri": "https://www.coingecko.com/en/coins/"+getCoinAPI[i].id
                                },
                                "style": "primary"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "buy",
                                        "uri": "https://poocoin.app/tokens/"+getCoinAPI[i].contractAddress
                                    },
                                    "color": "#EB9400FF",
                                    "style": "primary"
                                    },
                                {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "remove coin",
                                    "text": "!removecoin "+getCoinAPI[i].id
                                }
                                }
                            ]
                            }
                        }
                        data.push(obj)
                    }
                }else{
                    msg={
                        "type": "text",
                        "text": "Please add at least 1 token.\n\n!addcoin name\n\n#example\n!addcoin space-crypto\n\nhttps://www.coingecko.com/"
                    }
                }
            
            }else if(eventText.split(" ")[0] === '!REMOVECOIN'){
                const result = await AboutAlertCoin.rmmCoin(event)
                if(result !== undefined){
                    msg = { 
                        "type": "text",
                        "text": "✅ Successfully deleted"
                    };            
                }else{
                    msg = { 
                        "type": "text",
                        "text": "I can't delete it. 😥 not found "
                    };  
                }
            }else if(eventText ==='!MYTIME'){
                const myTime = await AboutAlertCoin.myNftTime(event)
                if(myTime.length){
                    data=[];
                    msg = [{
                        "type": "flex",
                        "altText": "Your Times",
                        "contents": {
                            "type": "carousel",
                            "contents": data
                        }
                    }];
                    for (let i = 0; i < myTime.length; i++) {
                        obj ={
                            "type": "bubble",
                            "body": {
                              "type": "box",
                              "layout": "vertical",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "⏱ Reminder at "+myTime[i].time_alert,
                                  "weight": "bold",
                                  "size": "xl",
                                  "wrap": true,
                                  "contents": []
                                },
                                {
                                  "type": "box",
                                  "layout": "baseline",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": myTime[i].name,
                                      "weight": "bold",
                                      "size": "xl",
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
                                      "text": myTime[i].text || "no text",
                                      "contents": []
                                    }
                                  ]
                                }
                              ]
                            },
                            "footer": {
                              "type": "box",
                              "layout": "vertical",
                              "spacing": "sm",
                              "contents": [
                                {
                                  "type": "button",
                                  "action": {
                                    "type": "message",
                                    "label": "remove",
                                    "text": "!removetime "+myTime[i]._id
                                  }
                                }
                              ]
                            }
                          }
                     data.push(obj)   
                    }
                }else{
                    msg={
                        "type":"text",
                        "text":"🤔 please add you time \n\n👉 !addtime name text"
                    } 
                }
            }else if(eventText.split(" ")[0] === '!ADDTIME'){
                msg={
                    type :'text',
                    text : ' 👉 !addtime name'
                }
                if(eventText.split(" ")[0] === '!ADDTIME' && eventText.split(" ")[1] || eventText.split(" ")[2]){

                    msg = [{
                        "type": "flex",
                        "altText": "Your Coin",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                            {
                                "type": "bubble",
                                "direction": "ltr",
                                "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Select Time",
                                        "align": "center",
                                        "contents": []
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
                                        "type": "datetimepicker",
                                        "label": "Time",
                                        "data": event.message.text,
                                        "mode": "time",
                                        "initial": "",
                                        "max": "23:59",
                                        "min": "00:00"
                                    },
                                    "color": "#0F69A7FF",
                                    "style": "primary"
                                    }
                                ]
                                }
                            }
                            ]
                        }
                    }];
                }
            }else if(eventText.split(" ")[0] === '!REMOVETIME'){
                const result = await AboutAlertCoin.rmNftTime(event)
                if(result !== undefined){
                    msg = { 
                        "type": "text",
                        "text": "✅ Successfully deleted"
                    };            
                }else{
                    msg = { 
                        "type": "text",
                        "text": "❗️ Not found in your list"
                    };  
                }
                // console.log(result);
                
            }
        }else if (event.postback){
            const eventPostback = event.postback ? { 'data':event.postback.data, 'time':event.postback.time} : ''
            if(eventPostback.data.split(" ")[0].toUpperCase() === '!ADDTIME'){
                const result = await AboutAlertCoin.addNftTime(event)
                if(result){
                    msg = {
                        "type": "flex",
                        "altText": "Your Coin",
                        "contents": {
                            "type": "carousel",
                            "contents": [
                              {
                                "type": "bubble",
                                "body": {
                                  "type": "box",
                                  "layout": "horizontal",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text":  "✅ The notification has been saved.",
                                      "wrap": true
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
                                            "type": "message",
                                            "label": "Check List",
                                            "text": "!mytime"
                                        },
                                        "style": "primary"
                                    }
                                    ]
                                }
                              }
                            ]
                        }
                    }
                }
            }
        }else if(event.type == "memberJoined"){
             msg = { 
                "type": "text",
                "text": "Hi There++"
            };
        }

        return await client.replyMessage(event.replyToken, msg);
    }
    

    
    
}
///// get top list on web https://dappradar.com/rankings/category/games
getListTopGamesCryptoToday = async(req,res) =>{
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    const objCrypto = []

    await page.goto('https://coinmarketcap.com/th/view/gaming/')
    for(i = 1; i <= 5; i++){
        let nameElemet = await page.waitForSelector("#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > div > a > div > div > p")
        let name = await page.evaluate(nameElemet => nameElemet.textContent, nameElemet)

        let coinElemet = await page.waitForSelector("#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child("+i+") > td:nth-child(3) > div > a > div > div > div > p")
        let coin = await page.evaluate(coinElemet => coinElemet.textContent, coinElemet)

        let priceElemet = await page.waitForSelector("#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child("+i+") > td:nth-child(4) > div")
        let price = await page.evaluate(priceElemet => priceElemet.textContent, priceElemet)
        
        let image = await page.$$eval('#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child('+i+') > td:nth-child(3) > div > a > div > img', imgs => imgs.map(img => img.getAttribute('src')));
        
        let urlElemet = await page.$('#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child('+i+') > td:nth-child(3) > div > a');
        let url = await page.evaluate(anchor => anchor.getAttribute('href'), urlElemet);

        let marketcapElemet = await page.waitForSelector("#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr:nth-child("+i+") > td:nth-child(7) > p > span.sc-1ow4cwt-0.iosgXe")
        let marketcap = await page.evaluate(marketcapElemet => marketcapElemet.textContent, marketcapElemet)


        objCrypto.push({name,coin,price,image,url,marketcap})
    }
    browser.close()
    return objCrypto

}
getTokenInBlockChain = async(name) =>{
    
    return await axios.get(`https://api.coingecko.com/api/v3/coins/${name.toLowerCase()}`)
        .then(function (response) {
            return true
        }).catch(error=>{
            return false
        });
}

getDetailCoin = async(value) =>{
    data = []
    for (let i = 0; i < value.length; i++) {
        await axios.get("https://api.coingecko.com/api/v3/coins/"+value[i]+"?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false")
        .then(function (response) {
            obj = { 
                'id' : response.data.id,
                'name' : response.data.name,
                'symbol' : response.data.symbol,
                'price' : response.data.market_data.current_price.usd,
                'changePercentage24h' : response.data.market_data.price_change_percentage_24h_in_currency.usd,
                'changePercentage1h' : response.data.market_data.price_change_percentage_1h_in_currency.usd,
                'contractAddress' :response.data.contract_address,
                'image' : response.data.image,
                'links' : response.data.links.homepage
            }
            data.push(obj)
        }).catch(error=>{
            // console.log(error);
        });
        
        
    } 
  return data 
}
