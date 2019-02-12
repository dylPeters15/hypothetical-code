const database = require('./database.js');


function getSkus(skuName, skuNumber, limit) {

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or: [
                { skuName: skuName },
                { skuNumber: skuNumber },
                { skuName: { $regex: /skuName/ } }
            ]
        }
        database.skuModel.find(filterSchema).limit(limit).exec((err, skus) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(skus);
        });
    });

}

function createSku(name, number, case_upc, unit_upc, unit_size, count, comment) {
    return new Promise(function (resolve, reject) {
        createUniqueSkuNumber().then(response => {
            var newSkuNumber;

            if (number == null) {
                newSkuNumber = Number(response)
            }
            else {
                newSkuNumber = number
            }
            // newingredientnumber = ingredientnumber || Number(response);

            createUniqueCaseUpcNumber().then(response => {
                var newCaseUpcNumber;

                if (case_upc == null) {
                    newCaseUpcNumber = Number(response)
                }
                else {
                    newCaseUpcNumber = case_upc
                }
                // newingredientnumber = ingredientnumber || Number(response);

                createUnitUpcNumber().then(response => {
                    var newUnitUpcNumber;

                    if (unit_upc == null) {
                        newUnitUpcNumber = Number(response)
                    }
                    else {
                        newUnitUpcNumber = unit_upc
                    }
                    // newingredientnumber = ingredientnumber || Number(response);

                    let sku = new database.skusModel({
                        skuName: newSkuNumber,
                        skuNumber: number,
                        caseUpcNumber: newCaseUpcNumber,
                        unitUpcNumber: newUnitUpcNumber,
                        unitSize: unit_size,
                        countPerCase: count,
                        comment: comment
                    });
                    sku.save().then(response => {
                        resolve(response);
                    }).catch(err => {
                        reject(Error(err));
                    });

                }).catch(err => {
                    throw (Error(err));
                });

            }).catch(err => {
                throw (Error(err));
            });

        }).catch(err => {
            throw (Error(err));
        });
    });
}

function modifySku(oldName, name, number, case_upc, unit_upc, unit_size, count, comment) {

    return new Promise(function (resolve, reject) {
        const filterschema = {
            skuName: oldName

        };
        database.skuModel.updateOne(filterschema, {
            $set: {
                skuName: name,
                skuNumber: number,
                caseUpcNumber: case_upc,
                unitUpcNumber: unit_upc,
                unitSize: unit_size,
                countPerCase: count,
                comment: comment
            }
        }, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });

}

function deleteSku(skuName) {
    return new Promise(function (resolve, reject) {
        const filterschema = {
            name: skuName
        };
        database.skuModel.deleteOne(filterschema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function createUniqueSkuNumber() {
    var newSkuNumber;
    var numFound = false;
    while (!numFound) {
        newSkuNumber = Math.round(Math.random() * 100000000);
        return new Promise(function (resolve, reject) {
            database.skuModel.find({ 'skuNumber': newSkuNumber }, 'skuNumber').exec((err, result) => {
                if (result == null) {
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    numFound = true;
                }


            });
            resolve(newSkuNumber);
        });
    }
}

function createUniqueCaseUpcNumber() {
    var newCaseUpcNumber;
    var firstDigitOption1;
    var numFound = false;
    while (!numFound) {
        newCaseUpcNumber = Math.round(Math.random() * 10000000000);
        firstDigitOption1 = "1" + int.Parse(newCaseUpcNumber.ToString()); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
        newCaseUpcNumber = parseInt(firstDigitOption1);
        return new Promise(function (resolve, reject) {
            database.skuModel.find({ 'caseUpcNumber': newCaseUpcNumber }, 'caseUpcNumber').exec((err, result) => {
                if (result == null) {
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    numFound = true;
                }


            });
            resolve(newCaseUpcNumber);
        });
    }
}

function createUnitUpcNumber() {
    var newUnitUpcNumber;
    var firstDigitOption1;
    var numFound = false;
    while (!numFound) {
        newUnitUpcNumber = Math.round(Math.random() * 10000000000);
        firstDigitOption1 = "1" + int.Parse(newUnitUpcNumber.ToString()); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
        newUnitUpcNumber = parseInt(firstDigitOption1)
        return new Promise(function (resolve, reject) {
            database.skuModel.find({ 'unitUpcNumber': newUnitUpcNumber }, 'unitUpcNumber').exec((err, result) => {
                if (result == null) {
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    numFound = true;
                }


            });
            resolve(newUnitUpcNumber);
        });
    }
}


module.exports = {
    getSku: getSkus,
    createSku: createSku,
    modifySku: modifySku,
    deleteSku: deleteSku
};