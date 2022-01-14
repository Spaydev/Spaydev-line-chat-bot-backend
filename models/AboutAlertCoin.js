const mongoShare = require( '../connextDB' );
const bcrypt = require('bcrypt');

module.exports.AboutAlertCoin = async(req,res) =>{
    console.log("models",req);
   
}


module.exports.myCoin = async(req,res) =>{
    const userId = req.source['userId']
    const dataUserCoin = [
        { userId: 'U40564fe286e7cff861e7d260d008f2e8' ,
            coin:['0x0ecaf010fc192e2d5cbeb4dfb1fee20fbd733aa1','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x55d398326f99059ff775485246999027b3197955'] 
        }
    ]

    function search(arr, searchKey) {
        return arr.filter(function(obj) {
          return Object.keys(obj).some(function(key) {
            return obj[key].includes(searchKey);
          })
        });
    }
    const result = await search(dataUserCoin, userId) || "null"; 
    return result
     
}
