const database = require('./database.js');

   
function getGoals(username, enabled, goalname, goalnameregex, limit) {
    username = username || "";
    goalname = goalname || "";
    goalnameregex = goalnameregex || "";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                {owner: username},
                {goalname: goalname},
                {goalname: {$regex: goalnameregex}},
                {enabled: enabled}
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

function modifyGoal(name, activities, date, enabled, newGoalObject) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            goalname: name,
            activities: activities,
            enabled: enabled,
            date: date
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

function deleteGoal(owner, name, activities, date, enabled) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            owner: owner,
            goalname: name,
            activities: activities,
            date: date,
            enabled: enabled
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