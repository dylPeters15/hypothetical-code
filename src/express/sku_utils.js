const database = require('./database.js');

   
function getSkus(username, goalName, limit) {
    let current_username = req.headers['username'];
      db.collection('skus').find({
          user: current_username
      }).toArray(function(err,results) {
          if(results.length > 0){
            res.send(results);
          }
          else {
              res.send({
                message: "No skus found for user " + current_username
              })
          }  
      });
    
}

function createSku(name, sku, quantity, date) {
    return new Promise(function (resolve, reject) {
        let goal = new database.goalsModel({
            goalName: name,
            sku: sku,
            quantity: quantity,
            date: Date.parse(date)
        });
        sku.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifySku(searchCriteria, username, password) {
    //pretty much same as 
}

function deleteSku(searchCriteria) {

}

module.exports = {
    getSku: getSkus,
    createSku: createSku,
    modifySku: modifySku,
    deleteSku: deleteSku
};