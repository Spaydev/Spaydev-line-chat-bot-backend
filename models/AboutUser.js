const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');

module.exports.RegisterUser = async(req,res) =>{

    const client = mongoShare.getDATABASE();
    let findUser = false;

    const checkUser = await client.collection("users").findOne({username: req.username}, function (err, result) {
        if (err) throw err;
    });      

    console.log(checkUser);

    if(findUser === true){
        const obj = {
            username: req.username,
            email: req.email,
            password: bcrypt.hashSync(req.password, bcrypt.genSaltSync(10)),
            status: "member",
            point: 0,
            create_at: new Date(),
        }
        client.collection("users").insertOne(obj, function (err, result) {
            if (err) throw err;
            console.log("1 Recorded Inserted");
            return "OK"
        });  
    }

   
}

module.exports.LoginUser = async(req,res) =>{
    const client = mongoShare.getDATABASE();
    const obj = {
        username: req.username
    }
    
    const result = await client.collection( 'users' ).findOne(obj);
    return result
}