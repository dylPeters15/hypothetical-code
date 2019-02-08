const database = require('./database.js');

   
function getGoals(username, goalname, goalnameregex, limit) {
    username = username || "";
    goalname = goalname || "";
    goalnameregex = goalnameregex || "";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            owner: username,
            $or: [
                {goalname: goalname},
                {goalname: {$regex: goalnameregex}}
            ]
        }
        database.goalsModel.find(filterSchema).limit(limit).toArray(function(err,results) {
            if(results.length > 0){
              resolve(results);
            }
            else {
                reject(Error(err));
            }  
        });
    })
     
    
}

function createGoal(goalObject) {
    return new Promise((resolve, reject) => {
        let goal = new database.goalsModel(goalObject);
        goal.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyGoal(owner, name, sku, quantity, date, newGoalObject) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            goalname: name,
            owner: owner,
            sku: sku,
            quantity: quantity,
            date: date
        }
        database.formulaModel.updateOne(filterSchema, newGoalObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteGoal(goalname,sku,quantity,date) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            goalname: goalname,
            sku: sku,
            quantity: quantity,
            date: date
        }
        database.userModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getGoals: getGoals,
    createGoal: createGoal,
    modifyGoal: modifyGoal,
    deleteGoal: deleteGoal
};