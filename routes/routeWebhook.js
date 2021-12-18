const express = require('express')
const router = express.Router();
const controllerWebhook = require('../controllers/controllerWebhook');
const request = require('request')
require('dotenv').config()


router.post('/', (req, res) => {
    console.log(req.body.events);
    let reply_token = req.body.events[0].replyToken
    reply(reply_token)
    res.sendStatus(200)
})
function reply(reply_token) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ChannelAccessToken}`
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        },
        {
            type: 'text',
            text: 'How are you?'
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

router.use(`*`,(req,res) => res.status(400).end())
module.exports = router;