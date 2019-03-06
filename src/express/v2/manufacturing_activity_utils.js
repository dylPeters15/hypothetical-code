const database = require('../database.js');


function getActivity(filterSchema, limit) {
    return new Promise((resolve, reject) => {
        database.manufacturingActivityModel.find(filterSchema).limit(limit).deepPopulate('sku.formula.ingredientsandquantities.ingredient').populate('line').exec(function (err, results) {
            if (err) {
                reject(Error(err));
            } else {
                resolve(results);
            }
        });
    });
}

function createActivity(newObject) {
    return new Promise((resolve, reject) => {
        let newActivity = new database.manufacturingActivityModel(newObject);
        newActivity.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyActivity(filterSchema, newObject) {
    return new Promise((resolve, reject) => {
        database.manufacturingActivityModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteActivity(filterSchema) {
    return new Promise((resolve, reject) => {
        database.manufacturingActivityModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getActivity: getActivity,
    createActivity: createActivity,
    modifyActivity: modifyActivity,
    deleteActivity: deleteActivity
};