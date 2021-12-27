const express = require('express')
const router = express.Router();
const controllerAuth = require('../controllers/controllerAuth');



router.post('/login', controllerAuth.Login)


router.post('/register', controllerAuth.Register)



router.use(`*`,(req,res) => res.status(400).end())
module.exports = router;