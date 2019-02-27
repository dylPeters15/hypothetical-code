const database = require('./database.js');


function getGoals(filterSchema, limit, optionsDict) {
    return new Promise((resolve, reject) => {
        database.goalsModel.find(filterSchema).limit(limit).deepPopulate('activities.activity.sku.formula.ingredientsandquantities.ingredient').exec(function (err, results) {
            if (err) {
                reject(Error(err));
            } else {
                resolve(results);
            }
        });
    });
}

function createGoal(newObject) {
    return new Promise((resolve, reject) => {
        let goal = new database.goalsModel(newObject);
        goal.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyGoal(filterSchema, newObject, optionsDict) {
    return new Promise((resolve, reject) => {
        database.goalsModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteGoal(filterSchema, optionsDict) {
    return new Promise((resolve, reject) => {
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