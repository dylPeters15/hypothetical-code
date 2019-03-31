const database = require('../database.js');
const user_utils = require('./user_utils.js');


function getLine(filterSchema, limit) {
    return new Promise((resolve, reject) => {
        database.manufacturingLineModel.find(filterSchema).limit(limit).populate('skus.sku').exec(function (err, results) {
            if (err) {
                reject(Error(err));
            } else {
                resolve(results);
            }
        });
    });
}

function createLine(newObject) {
    return new Promise((resolve, reject) => {
        let newLine = new database.manufacturingLineModel(newObject);
        newLine.save().then(response => {
            database.userModel.updateOne({
                username: 'admin',
                localuser: true
            }, 
            {
                $push:{
                    manufacturinglinestomanage: {
                        manufacturingline: response._id
                    }
                }
            }, (err, modifyUserResponse) => {
                if (err) {
                    reject(Error(err));
                    return
                }
                resolve(response);
            });
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyLine(filterSchema, newObject) {
    return new Promise((resolve, reject) => {
        database.manufacturingLineModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteLine(filterSchema) {
    return new Promise((resolve, reject) => {
        database.manufacturingLineModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getLine: getLine,
    createLine: createLine,
    modifyLine: modifyLine,
    deleteLine: deleteLine
};