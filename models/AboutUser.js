const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');

module.exports.RegisterUser = async(req,res) =>{

    const client = mongoShare.getDATABASE();
    const result = await client.collection("users").findOne({username: req.username});
        if(result === null){
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
            });  
            return { status:'' ,message:'Register Success' };

        }else {
            return { status:'' ,message:'Register Fail' };
        }
   
}

module.exports.LoginUser = async(req,res) =>{
    const client = mongoShare.getDATABASE();
    const result = await client.collection("users").findOne({username: req.username});
    if(result !== null ){
        const match = await bcrypt.compare(req.password, result.password);
        if(match) {
           const userData = {
                idUser: result._id,
                username: result.username,
                email: result.email ,
                status: result.status,
                point: result.point,
           }
            return [userData,{ status:'' ,message:'Login Success' }];
        }else{
            return [null,{ status:'' ,message:'Login Fail' }];
        }
    }


}