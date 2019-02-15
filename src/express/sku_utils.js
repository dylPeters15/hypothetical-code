const database = require('./database.js');


function getSkus(skuname, skunumber, caseupcnumber, unitupcnumber, formulanumber, limit) {

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or: [
                { skuname: skuname },
                { skuNumber: skunumber },
                { caseUpcNumber: caseupcnumber },
                { unitUpcNumber: unitupcnumber },
                { formulaNumber: formulanumber },
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
                        skuname: name,
                        skunumber: newSkuNumber,
                        caseupcnumber: newCaseUpcNumber,
                        unitupcnumber: newUnitUpcNumber,
                        unitsize: unit_size,
                        countpercase: count,
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
                skuname: name,
                skunumber: number,
                caseupcnumber: case_upc,
                unitupcnumber: unit_upc,
                unitsize: unit_size,
                countpercase: count,
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
    return new Promise(function (resolve, reject) {
    var newSkuNumber;
    var numFound = false;
    while (!numFound) {
        newSkuNumber = Math.round(Math.random() * 100000000);
            database.skuModel.find({ 'skunumber': newSkuNumber }, 'skunumber').exec((err, result) => {
                if (result == null) {
                    numFound = true;
                    Console.log("result null for check database result for unitUPC number: " + result);
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    Console.log("result not null for check database result for unitUPC number: " + result);
                }
            });            
        }
        resolve(newSkuNumber);
    });
}


function createUniqueCaseUpcNumber() {
    return new Promise(function (resolve, reject) {
    var newCaseUpcNumber;
    var firstDigitOption1;
    var numFound = false;
    while (!numFound) {
        newCaseUpcNumber = Math.round(Math.random() * 10000000000);
        firstDigitOption1 = "1" + int.Parse(newCaseUpcNumber.ToString()); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
        newCaseUpcNumber = parseInt(firstDigitOption1);
        
            database.skuModel.find({ 'caseUpcNumber': newCaseUpcNumber }, 'caseUpcNumber').exec((err, result) => {
                if (result == null) {
                    numFound = true;
                    Console.log("result null for check database result for caseUPC number: " + result);
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    Console.log("result not null for check database result for caseUPC number: " + result);
                }


                });
            }
            resolve(newCaseUpcNumber);
        });
}

function createUnitUpcNumber() {
    var newUnitUpcNumber;
    var firstDigitOption1;
    newUnitUpcNumber = Math.round(Math.random() * 10000000000);
    firstDigitOption1 = "1" + int.Parse(newUnitUpcNumber.ToString()); // Case upc number must start with a 0,1,6,7,8, or 8. For random generated, just let it equal 1.
    newUnitUpcNumber = parseInt(firstDigitOption1);
    return(newUnitUpcNumber);
}


module.exports = {
    getSku: getSkus,
    createSku: createSku,
    modifySku: modifySku,
    deleteSku: deleteSku
};