const express = require('express')
const router = express.Router();


const routeAuth = require("./routeAuth")
const routeWebhook = require("./routeWebhook")

router.use('/api/auth',routeAuth)
router.use('/api/webhook',routeWebhook)

module.exports = router;