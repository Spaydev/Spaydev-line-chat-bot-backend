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
            type: 'text',
            text: 'toow the moon'
        };
    
        let eventText = event.message.text.toUpperCase();
    
        if (eventText === '!TODAY') {
            msg = {
              "type": "text",
              "text": "TO DAY"
            }
        }else if (eventText === '!TOPCOINSDEFIGAME') {
            const coinData = await getListTopGamesCryptoToday()
            array=[]
            msg=[{
                "type": "text",
                "text": " ⭐️ Top Gaming Tokens by Market Capitalization!!! \n By https://coinmarketcap.com/view/gaming/"
            },{
                "type": "template",
                "altText": "this is a carousel template",
                "template": {
                "type": "carousel",
                "imageSize": "contain",
                "columns": array
                }
            }]
            for (let i = 0; i < coinData.length; i++) {
                data={
                    "thumbnailImageUrl": coinData[i].image[0],
                    "title": "#"+(i+1)+" "+coinData[i].name,
                    "text": `#${coinData[i].coin}\nMarket Cap : ${coinData[i].marketcap}`,
                    "actions": [{
                        "type": "uri",
                        "label": "link",
                        "uri": `https://coinmarketcap.com/${coinData[i].url}`
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
                        "text": " ❗️ Token by address: Invalid address.\nplease check the token in web \nhttps://poocoin.app/"
                    }]
                }   
            }else{
                msg = [{
                    "type": "text",
                    "text": " ❗️ Invalid format.\n\n#example\n!addcoin token"
                }]
            }
            - !addcoin [token]
          
          // console.log(coin);

        }else if(eventText.split(" ")[0] === '!MYCOIN'){

            msg = [];
            const getCoinUser = await AboutAlertCoin.myCoin(event)
            if(getCoinUser){
                const getCoinAPI = await getDetailCoin(getCoinUser)
                for (let i = 0; i < getCoinAPI.length; i++) {
                    const price_coin = parseFloat(getCoinAPI[i].price) 
                    let currencyConverter = await new CC({from:"USD", to:"THB", amount:price_coin}).convert();
                    obj = {
                        "type": "text",
                        "text": `${getCoinAPI[i].name} #${getCoinAPI[i].symbol}\n\nUSD : ${parseFloat(getCoinAPI[i].price).toFixed(3)}\nTHB : ${currencyConverter}\n\ntoken : ${getCoinAPI[i].token}`
                    }
                    msg.push(obj)
                }
            }else{
                obj={
                    "type": "text",
                    "text": "Please add at least 1 token.\n #use !addcoin token"
                }
                msg.push(obj)
            }
          
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
            const ResultMyNftTime = await AboutAlertCoin.myNftTime(event)
            console.log(ResultMyNftTime);

        }else if(eventText.split(" ")[0] === '!ADDNFTTIME'){
            if(eventText.split(" ")[0] === '!ADDNFTTIME' && eventText.split(" ")[1] && eventText.split(" ")[2]){
                const ResultNftTime = await AboutAlertCoin.addNftTime(event)
                msg={
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                      "type": "carousel",
                      "columns": [
                        {
                          "title": '✅ NFT time added',
                          "text": `${ResultNftTime.name_nft_game}\n${ResultNftTime.time_alert}`,
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
                    "text": "#Example\n 24Hr Bangkok (GMT+7) only\n\n!addnfttime 23:59 name description"
                }
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
getTokenInBlockChain = async(token) =>{

    return await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${token.toLowerCase()}`)
        .then(function (response) {
            return true
        }).catch(error=>{
            return false
        });
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
  return objCoins 
}