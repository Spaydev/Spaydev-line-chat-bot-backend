const express = require('express')
const router = express.Router();
const controllerSocket = require('../controllers/controllerSocket');



router.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
  


router.use(`*`,(req,res) => res.status(400).end())
module.exports = router;