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

                    let sku = new database.skuModel({
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