const AboutUser = require('../models/AboutUser')

module.exports.Login = async(req,res) =>{

    // res.send(req.query)
    let dataLogin = req.query
    let result = await AboutUser.LoginUser(dataLogin)
    console.log("controllerAuth",result);
}

module.exports.Register = async(req,res) =>{
    let dataRegister = req.query
    let result = await AboutUser.RegisterUser(dataRegister)
    console.log("controllerAuth",result);
}