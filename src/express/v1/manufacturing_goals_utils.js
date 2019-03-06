const database = require('../database.js');

   
function getGoals(username, enabled, goalname, goalnameregex, limit) {
    username = username || null;
    goalname = goalname || "";
    goalnameregex = goalnameregex || "";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                {enabled: enabled},
                {owner: username},
                {goalname: goalname},
                {goalname: {$regex: goalnameregex}}

            ]
        }
        database.goalsModel.find(filterSchema).limit(limit).deepPopulate('activities.activity.sku.formula.ingredientsandquantities.ingredient').exec(function(err,results) {
            if(results != undefined && results != null){
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

function modifyGoal(goalname, newGoalObject) {
    console.log("NEW OBJ: " + JSON.stringify(newGoalObject))
    return new Promise((resolve, reject) => {
        var filterSchema = {
            goalname: goalname
        }
        database.goalsModel.updateOne(filterSchema, newGoalObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteGoal(name) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            goalname: name,
        }
        database.goalsModel.deleteOne(filterSchema, (err, response) => {
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