const database = require('./database.js');

   
function getGoals(username, goalName, limit) {
    return new Promise(function(resolve, reject) {
        database.testdb.collection('goals').find({
            user: current_username,
            goalName: goalName
        }).toArray(function(err,results) {
            if(results.length > 0){
              resolve(results);
            }
            else {
                reject(Error(err));
            }  
        });
    })
     
    
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