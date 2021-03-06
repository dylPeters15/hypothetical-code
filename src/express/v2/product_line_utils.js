const mongoose = require('mongoose');
const database = require('../database.js');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

function getProductLines(filterSchema, limit) {
    return new Promise(function (resolve, reject) {
        database.productLineModel.find(filterSchema).limit(limit).deepPopulate('skus.sku.formula.ingredientsandquantities.ingredient').exec((err, productLines) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(productLines);
        });
    });

}

function createProductLine(newObject) {
    return new Promise(function (resolve, reject) {
        let productLine = new database.productLineModel(newObject);
        productLine.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyProductLine(filterSchema, newObject) {
    return new Promise(function (resolve, reject) {
        database.productLineModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });

}

function deleteProductLine(filterSchema) {
    return new Promise(function (resolve, reject) {
        database.productLineModel.deleteOne(filterschema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}


module.exports = {
    getProductLines: getProductLines,
    createProductLine: createProductLine,
    modifyProductLine: modifyProductLine,
    deleteProductLine: deleteProductLine
};