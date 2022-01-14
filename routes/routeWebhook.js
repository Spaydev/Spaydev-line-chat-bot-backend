const express = require('express')
const router = express.Router();
const controllerWebhook = require('../controllers/controllerWebhook');
require('dotenv').config()


router.post('/',controllerWebhook.Webhook)

// router.post('/get', (req, res) => {
//     console.log(req.body.events);
//     const reply_token = req.body.events[0].replyToken
//     const guest_text = req.body.events[0].message
//     reply(reply_token)
//     res.sendStatus(200)
// })

// function reply(reply_token) {
//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.ChannelAccessToken}`
//     }
//     const body = JSON.stringify({
//         replyToken: reply_token,
//         messages: [{
//             type: 'text',
//             text: 'toow the moon?'
//         }]
//     })
//     request.post({
//         url: 'https://api.line.me/v2/bot/message/reply',
//         headers: headers,
//         body: body
//     }, (err, res, body) => {
//         console.log('status = ' + res.statusCode);
//     });
// }

router.use(`*`,(req,res) => res.status(400).end())
module.exports = router;