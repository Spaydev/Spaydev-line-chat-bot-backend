const eventManage = require('../manage-events-controllers/eventManages');

module.exports.WebhookLineEventManage = async(req,res) =>{

   await eventManage.EventManage(req)
   return 
    
}
