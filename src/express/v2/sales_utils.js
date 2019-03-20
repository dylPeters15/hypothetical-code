const database = require('../database.js');

function getSales(filterSchema, limit) {
    return new Promise(function (resolve, reject) {
        database.saleModel.find(filterSchema).limit(limit).populate('sku').populate('customer').exec((err, productLines) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(productLines);
        });
    });

}

function createSale(newObject) {
    return new Promise(function (resolve, reject) {
        let sale = new database.saleModel(newObject);
        sale.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifySale(filterSchema, newObject) {
    return new Promise(function (resolve, reject) {
        database.saleModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });

}

function deleteSale(filterSchema) {
    return new Promise(function (resolve, reject) {
        database.saleModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}


module.exports = {
    getSales: getSales,
    createSale: createSale,
    modifySale: modifySale,
    deleteSale: deleteSale
};