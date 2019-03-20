const mongoose = require('mongoose');
const database = require('../database.js');
const formula_utils = require('./formula_utils.js');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
const scraper = require('./sales_scraper.js')

function getSkus(filterSchema, limit) {
    return new Promise(function (resolve, reject) {
        database.skuModel.find(filterSchema).limit(limit).deepPopulate('formula.ingredientsandquantities.ingredient').exec((err, skus) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(skus);
        });
    });
}

function createSku(newObject) {
    return new Promise(function (resolve, reject) {
        let sku = new database.skuModel(newObject);
        sku.save().then(response => {
            scraper.createdSkus.push(response);
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifySku(filterSchema, newObject) {
    return new Promise(function (resolve, reject) {
        database.skuModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteSku(filterSchema) {
    return new Promise(function (resolve, reject) {
        database.skuModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function createUniqueSkuNumber() {
    return new Promise((resolve, reject) => {
        database.skuModel.find({}).select('skunumber -_id').exec((err, skuNums) => {
            if (err) {
                reject(Error(err));
                return
            }
            var skuNum = Math.round(Math.random() * 100000000);
            var maxIterations = 10000;
            var iterations = 0;
            while (skuNums.includes(skuNum)) {
                var skuNum = Math.round(Math.random() * 100000000);
                iterations = iterations + 1;
                if (iterations >= maxIterations) {
                    reject(Error("Could not generate unique SKU Number."));
                }
            }
            resolve(skuNum);
        });
    });
}


function createUniqueCaseUpcNumber() {
    return new Promise((resolve, reject) => {
        database.skuModel.find({}).select('caseupcnumber -_id').exec((err, upcNums) => {
            if (err) {
                reject(Error(err));
                return
            }
            var upcNum = Math.round(Math.random() * 10000000000);
            var firstDigitOption1 = Number("1" + upcNum); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.

            var maxIterations = 10000;
            var iterations = 0;
            while (upcNums.includes(upcNum)) {
                upcNum = Math.round(Math.random() * 10000000000);
                firstDigitOption1 = Number("1" + upcNum); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
                iterations = iterations + 1;
                if (iterations >= maxIterations) {
                    reject(Error("Could not generate UPC."));
                }
            }
            resolve(upcNum);
        });
    });
}

function createUnitUpcNumber() {
    var newUnitUpcNumber;
    var firstDigitOption1;
    newUnitUpcNumber = Math.round(Math.random() * 10000000000);
    firstDigitOption1 = Number("1" + newUnitUpcNumber); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
    return (firstDigitOption1);
}

function printSKU(skuObject) {
    let skuString = '';
    skuString += '<' + skuObject['skuname'] + '>: <' + skuObject['unitsize'] + '> * <' + skuObject['countpercase'] + '>';
    return skuString;
}


module.exports = {
    getSkus: getSkus,
    createSku: createSku,
    modifySku: modifySku,
    deleteSku: deleteSku
};