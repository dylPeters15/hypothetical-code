const database = require('./database.js');

   
function getGoals(username, goalName, limit) {
    let current_username = req.headers['username'];
      db.collection('goals').find({
          user: current_username
      }).toArray(function(err,results) {
          if(results.length > 0){
            res.send(results);
          }
          else {
              res.send({
                message: "No goals found for user " + current_username
              })
          }  
      });
    
}

function createGoal(name, sku, quantity, date) {
    return new Promise(function (resolve, reject) {
        let goal = new database.goalsModel({
            goalName: name,
            sku: sku,
            quantity: quantity,
            date: Date.parse(date)
        });
        goal.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyGoal(searchCriteria, username, password) {
    //pretty much same as 
}

function deleteGoal(searchCriteria) {

}

module.exports = {
    getGoals: getGoals,
    createGoal: createGoal,
    modifyGoal: modifyGoal,
    deleteGoal: deleteGoal
};