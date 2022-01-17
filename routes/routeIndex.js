const express = require('express')
const router = express.Router();


const routeAuth = require("./routeAuth")
const routeWebhook = require("./routeWebhook")
const routeSocket = require("./routeSocket")


router.use('/api/auth',routeAuth)
router.use('/webhook',routeWebhook)
router.use('/socket',routeSocket)

module.exports = router;