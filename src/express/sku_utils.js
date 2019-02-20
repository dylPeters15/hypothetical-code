const database = require('./database.js');
const formula_utils = require('./formula_utils.js');


function getSkus(skuname, skunameregex, skunumber, caseupcnumber, unitupcnumber, formulanumber, limit) {
    skuname = skuname || "";
    skunameregex = skunameregex || "$a";
    skunumber = skunumber || -1;
    console.log("skuname: " + skuname)
    caseupcnumber = caseupcnumber || -1;
    unitupcnumber = unitupcnumber || -1;
    formulanumber = formulanumber || "";
    limit = (limit != 0) ? limit : database.defaultSearchLimit;
    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or: [
                { skuname: skuname },
                { skuname: {$regex: skunameregex }},
                { skunumber: skunumber },
                { caseupcnumber: caseupcnumber },
                { unitupcnumber: unitupcnumber },
                { formulanumber: formulanumber },

            ]
        }
<<<<<<< HEAD
        console.log(filterSchema)
        database.skuModel.find(filterSchema).limit(limit).exec((err, skus) => {
=======
        database.skuModel.find(filterSchema).limit(limit).populate('formula').exec((err, skus) => {
>>>>>>> 7b816a158c647aff83acab1f42544ba9abf56a38
            if (err) {
                reject(Error(err));
                return;
            }
            console.log("SKUS: " + skus)
            resolve(skus);
        });
    });

}

function createSku(name, number, case_upc, unit_upc, unit_size, count, formulanum, formulascalingfactor, manufacturingrate, comment) {
    return new Promise(function (resolve, reject) {
        createUniqueSkuNumber().then(response => {
            console.log("SKU Num: ", response);
            var newSkuNumber;

            if (number == null) {
                newSkuNumber = Number(response)
            }
            else {
                newSkuNumber = number
            }
            // newingredientnumber = ingredientnumber || Number(response);

            createUniqueCaseUpcNumber().then(response => {
                console.log("UPC Num: ", response);
                var newCaseUpcNumber;

                if (case_upc == null) {
                    newCaseUpcNumber = Number(response)
                }
                else {
                    newCaseUpcNumber = case_upc
                }
                // newingredientnumber = ingredientnumber || Number(response);

                response = createUnitUpcNumber();
                    console.log("UPC Num: ", response);
                    var newUnitUpcNumber;

                    if (unit_upc == null) {
                        newUnitUpcNumber = Number(response)
                    }
                    else {
                        newUnitUpcNumber = unit_upc
                    }
                    // newingredientnumber = ingredientnumber || Number(response);

                    formula_utils.getFormulas("",formulanum,null,null,1).then(response => {
                        if (response.length == 0) {
                            reject(Error("Could not find formula " + formulanum + " for SKU " + name));
                        } else {
                            var formulaID = response[0]['_id'];
                            let sku = new database.skuModel({
                                skuname: name,
                                skunumber: newSkuNumber,
                                caseupcnumber: newCaseUpcNumber,
                                unitupcnumber: newUnitUpcNumber,
                                unitsize: unit_size,
                                countpercase: count,
                                formula: formulaID,
                                formulascalingfactor: formulascalingfactor,
                                manufacturingrate: manufacturingrate,
                                comment: comment
                            });
                            sku.save().then(response => {
                                resolve(response);
                            }).catch(err => {
                                reject(Error(err));
                            });
                        }
                    }).catch(err => {
                        reject(err);
                    });

            }).catch(err => {
                throw (Error(err));
            });

        }).catch(err => {
            throw (Error(err));
        });
    });
}

function modifySku(oldName, name, number, case_upc, unit_upc, unit_size, count, formulanum, formulascalingfactor, manufacturingrate, comment) {

    return new Promise(function (resolve, reject) {
        formula_utils.getFormulas("",formulanum,null,null,1).then(response => {
            if (response.length == 0) {
                reject(Error("Could not find formula " + formulanum + " for SKU " + name));
            } else {
                var formulaID = response[0]['_id'];
                const filterschema = {
                    skuname: oldName
        
                };
                database.skuModel.updateOne(filterschema, {
                    $set: {
                        skuname: name,
                        skunumber: number,
                        caseupcnumber: case_upc,
                        unitupcnumber: unit_upc,
                        unitsize: unit_size,
                        countpercase: count,
                        formula: formulaID,
                        formulascalingfactor: formulascalingfactor,
                        manufacturingrate: manufacturingrate,
                        comment: comment
                    }
                }, (err, response) => {
                    if (err) {
                        reject(Error(err));
                        return
                    }
                    resolve(response);
                });
            }
        }).catch(err => {
            reject(err);
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
    return(firstDigitOption1);
}


module.exports = {
    getSkus: getSkus,
    createSku: createSku,
    modifySku: modifySku,
    deleteSku: deleteSku
};