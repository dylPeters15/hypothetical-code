const database = require('../database.js');


function getGoals(filterSchema, limit) {
    return new Promise((resolve, reject) => {
        database.goalsModel.find(filterSchema).limit(limit).populate('owner').deepPopulate('activities.activity.sku.formula.ingredientsandquantities.ingredient').exec(function (err, results) {
            if (err) {
                reject(Error(err));
            } else {
                console.log("FOUND: ", results)
                resolve(results);
            }
        });
    });
}

function createGoal(newObject) {
    return new Promise((resolve, reject) => {
        newObject['lastedit'] = new Date() + "";
        console.log("CREATING:", newObject);
        let goal = new database.goalsModel(newObject);
        goal.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyGoal(filterSchema, newObject) {
    return new Promise((resolve, reject) => {
        newObject['$set']['lastedit'] = new Date() + "";
        database.goalsModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteGoal(filterSchema) {
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