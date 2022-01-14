const eventManage = require('../manage-events/eventManages');

module.exports.Webhook = async(req,res) =>{

   await eventManage.EventManage(req)
    
}