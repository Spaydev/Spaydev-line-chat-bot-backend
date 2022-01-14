const axios = require('axios');
require('dotenv').config()
const puppeteer = require('puppeteer')
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.ChannelAccessToken,
    channelSecret: process.env.ChannelSecret
};


module.exports.EventManage = async(req,res) =>{

    const reply_token = req.body.events[0].replyToken
    const guest_message = req.body.events[0].message

    if( guest_message.text == "topcoin"){
        // const topCoinToday = await getListTopGamesCryptoToday()
        data = {
            replyToken: reply_token,
            messages: {
                type: "flex",
                altText: "This is a Flex message",
                contents: {
                    type: 'text',
                    text: 'What do u want?'
                }
               
                }
            }
        replyMessage(data)

    }else if(guest_message.text == "mycoin"){
        
    }else if(guest_message.text == "today"){
        
    }else if(guest_message.text == "command"){
       
        replyMessage(data)
    }else{
        const data = {
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: 'What do u want?'
            },{
                type: 'text',
                text: 'toow the moon??'
            },{
                type: 'text',
                text: 'Command not found try again'
            }]
        }
        replyMessage(data)
    }

    function replyMessage(data) {
        axios.post(
            "https://api.line.me/v2/bot/message/reply", 
            data, {
            headers: headers
        }).then((res) => {
            console.log('status = ' + res.status);
            console.log(req.body.events[0]);
        }).catch((error) => {
            console.log(error)
        });

    }
    
}
///// get top list on web https://dappradar.com/rankings/category/games
getListTopGamesCryptoToday = async(req,res) =>{
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    const objCrypto = []

    await page.goto('https://dappradar.com/rankings/category/games')
    for(i = 4; i < 11; i++){
        let rankElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.sc-hmvnCu.jzvBVe")
        let rank = await page.evaluate(rankElemet => rankElemet.textContent, rankElemet)
        let nameElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.rankings-column.rankings-column__name > div.sc-cTAIfT.ekXXni > span")
        let name = await page.evaluate(nameElemet => nameElemet.textContent, nameElemet)

        let balanceElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.sc-lheXJl.eEudeu.rankings-column.rankings-column__balance")
        let balance = await page.evaluate(balanceElemet => balanceElemet.textContent, balanceElemet)

        // let userElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.sc-lheXJl.eEudeu.rankings-column.rankings-column__users > div.sc-hoHwyw.igjgsL")
        // let userCryptoGame = await page.evaluate(userElemet => userElemet.textContent, userElemet)

        // let perUserElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.sc-lheXJl.eEudeu.rankings-column.rankings-column__users > div.sc-jnrVZQ.faopnI")
        // let perUserCryptoGame = await page.evaluate(perUserElemet => perUserElemet.textContent, perUserElemet)

        let valumeElemet = await page.waitForSelector("#root > div.App.lang-en > div.rankings-page > div.Container.css-119jrnd > section > div > div.sc-iLOkMM.eeFfdY.rankings-table > a:nth-child("+i+") > div > div > div.sc-lheXJl.eEudeu.rankings-column.rankings-column__volume > div")
        let valume = await page.evaluate(valumeElemet => valumeElemet.textContent, valumeElemet)

        objCrypto.push({rank,name,balance,valume})
    }

    browser.close()
    return objCrypto

}