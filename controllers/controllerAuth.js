const AboutUserModels = require('../models/AboutUser');
const jwt = require("jwt-simple");

module.exports.Login = async(req,res) =>{
    try{
        const dataLogin = req.body
        const result = await AboutUserModels.LoginUser(dataLogin)
        return res.send(result)

    }catch (err) {
        console.log(err)
        response.setResponse(`Error`, 500, null, null, err.message)
        return res.status(500).send(response)
    }
}

module.exports.Register = async(req,res) =>{
    try{
    const dataRegister = req.body
    const result = await AboutUserModels.RegisterUser(dataRegister)
    res.send(result);

    }catch (err) {
        console.log(err)
        response.setResponse(`Error`, 500, null, null, err.message)
        return res.status(500).send(response)
    }
}