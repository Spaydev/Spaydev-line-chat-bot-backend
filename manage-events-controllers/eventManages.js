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
    console.log(event);

    handleMessageEvent(event)

   async function handleMessageEvent(event) {

        let msg = { 
            "type": "text",
            "text": "dont"
        };
    
        let eventText = event.message.text.toUpperCase();
    
        if (eventText === '!TODAY') {
            msg = {
                "type": "flex",
                "altText": "this is a flex message",
                "contents": {
                    "type": "carousel",
                    "contents": [
                      {
                        "type": "bubble",
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Arm Chair, White",
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
                                  "text": "$49",
                                  "weight": "bold",
                                  "size": "xl",
                                  "flex": 0,
                                  "wrap": true,
                                  "contents": []
                                },
                                {
                                  "type": "text",
                                  "text": ".99",
                                  "weight": "bold",
                                  "size": "sm",
                                  "flex": 0,
                                  "wrap": true,
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
                                "label": "Add to Cart",
                                "uri": "https://linecorp.com"
                              },
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "uri",
                                "label": "Add to wishlist",
                                "uri": "https://linecorp.com"
                              }
                            }
                          ]
                        }
                      },
                      {
                        "type": "bubble",
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "spacing": "sm",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Metal Desk Lamp",
                              "weight": "bold",
                              "size": "lg",
                              "wrap": true,
                              "contents": []
                            },
                            {
                              "type": "box",
                              "layout": "baseline",
                              "flex": 1,
                              "contents": [
                                {
                                  "type": "text",
                                  "text": "$11",
                                  "weight": "bold",
                                  "size": "xl",
                                  "flex": 0,
                                  "wrap": true,
                                  "contents": []
                                },
                                {
                                  "type": "text",
                                  "text": ".99",
                                  "weight": "bold",
                                  "size": "sm",
                                  "flex": 0,
                                  "wrap": true,
                                  "contents": []
                                }
                              ]
                            },
                            {
                              "type": "text",
                              "text": "Temporarily out of stock",
                              "size": "xxs",
                              "color": "#FF5551",
                              "flex": 0,
                              "margin": "md",
                              "wrap": true,
                              "contents": []
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
                                "label": "Add to Cart",
                                "uri": "https://linecorp.com"
                              },
                              "flex": 2,
                              "color": "#AAAAAA",
                              "style": "primary"
                            },
                            {
                              "type": "button",
                              "action": {
                                "type": "uri",
                                "label": "Add to wish list",
                                "uri": "https://linecorp.com"
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
              }
        }else if (eventText === '!TOPCOINSDEFIGAME') {
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
        } else if (eventText === '!COMMAND') {
            msg = [{
                "type": "text",
                "text": "📜 All command"
              },{
                "type": "text",
                "text": "#Daily news about nft games\n - !today\n\n#My interesting coin \n - !mycoin\n - !addcoin [token]\n - !delcoin [token]\n\n#Top 5 Gaming Tokens\n - !topcoinsdefigame\n\n#Set price alerts coin\n - !followcoin [token] [price]\n\n#Notify when it's time to play nft games\n - !mynfttime\n - !addnfttime\n"
              }]
        }else if(eventText.split(" ")[0] === '!ADDCOIN'){
            const coin = eventText.split(" ")[1] || null
            
            if(coin != null){
                const coinTokenCheck = await getTokenInBlockChain(coin)
                if(coinTokenCheck === true){
                    const result = await AboutAlertCoin.addmyCoin(event)
                    if(result != undefined){
                        msg = [{
                            "type": "text",
                            "text": "Token is already"
                        }]
                    }else if(result == undefined){
                        msg = [{
                            "type": "text",
                            "text": " ✅ Coins have been added"
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
            if(getCoinUser){
                const getCoinAPI = await getDetailCoin(getCoinUser)
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
                                "uri": "https://linecorp.com"
                              },
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
                obj={
                    "type": "text",
                    "text": "Please add at least 1 token.\n\n!addcoin name"
                }

                msg.push(obj)
            }
          
        }else if(eventText.split(" ")[0] === '!REMOVECOIN'){
             msg = { 
                "type": "text",
                "text": "REMOVE COIN"
            };
        }else if(eventText.split(" ")[0] === '!FOLLOWCOIN'){

            if(eventText.split(" ")[1] && eventText.split(" ")[2]){
                const coinTokenCheck = await getTokenInBlockChain(eventText.split(" ")[1])
                const price = eventText.split(" ")[2]

                if(isNaN(price)){
                    msg = [{
                        "type": "text",
                        "text": " ⚠️ Price number only.\n\n!followcoin [token] [price USD]"
                    }]
                }else{
                    if(coinTokenCheck === true){
                        obj={
                            event,
                            token:eventText.split(" ")[1].toLowerCase(),
                            price:eventText.split(" ")[2],
                        }

                        const followCoinUser = await AboutAlertCoin.followCoin(obj)
                        console.log(followCoinUser);

                    }else{
                        msg = [{
                            "type": "text",
                            "text": " ⚠️ Token by address: Invalid address.\nplease check the token in web \nhttps://poocoin.app/"
                        }]
                    }
                }
            }else{
                msg={
                    "type": "text",
                    "text": "⚠️ #Example for follow coin\n\n!followcoin [token] [price USD]\n\nIf the coin price reaches the set value You will be notified"
                }
            }
            
        }else if(eventText ==='!MYNFTTIME'){
            data=[]
            sortTime=[]
            msg = [{ 
                "type": "text",
                "text": "⏳ Notify when the time comes"
            },{
                "type": "template",
                "altText": "MYNFTTIME",
                "template": {
                  "type": "carousel",
                  "imageSize": "contain",
                  "columns": data
                }
              }];
            const ResultMyNftTime = await AboutAlertCoin.myNftTime(event)
            for (let i = 0; i < ResultMyNftTime.length; i++) {
                const h = ResultMyNftTime[i].time_alert.split(":")[0]
                const m = ResultMyNftTime[i].time_alert.split(":")[1]
                obj = {
                    "title": `${ResultMyNftTime[i].time_alert} AM`,
                    "text": `${ResultMyNftTime[i].name_nft_game}`,
                    "actions": [{
                            "type": "message",
                            "label": "delete",
                            "text": "!deletenfttime "+ResultMyNftTime[i]._id
                    }]
                        
                }
                data.push(obj)
            }

        }else if(eventText.split(" ")[0] === '!ADDNFTTIME'){
            if(eventText.split(" ")[0] === '!ADDNFTTIME' && eventText.split(" ")[1] && eventText.split(" ")[2]){
                const ResultNftTime = await AboutAlertCoin.addNftTime(event)
                msg={
                    "type": "template",
                    "altText": `${ResultNftTime.name_nft_game}✅ NFT time added`,
                    "template": {
                      "type": "carousel",
                      "columns": [
                        {
                          "title": '✅ NFT time added',
                          "text": `${ResultNftTime.name_nft_game}\ntime : ${ResultNftTime.time_alert}`,
                          "actions": [
                            {
                              "type": "message",
                              "label": "check my NFT time",
                              "text": "!mynfttime"
                            }
                          ],
                        }
                      ]
                    }
                  }
            }else{
                msg = {
                    "type": "text",
                    "text": "📌 #Example\n 24Hr Bangkok (GMT+7) only\n\n!addnfttime 23:59 name description"
                }
            }
        }else if(eventText.split(" ")[0] === '!REMOVENFTTIME'){
             msg = { 
                "type": "text",
                "text": "REMOVE NFT TIME"
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
