const database = require('../database.js');

function getCustomers(filterSchema, limit) {
    return new Promise(function (resolve, reject) {
        database.customerModel.find(filterSchema).limit(limit).populate('sku').populate('customer').exec((err, productLines) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(productLines);
        });
    });

}

function createCustomer(newObject) {
    return new Promise(function (resolve, reject) {
        let customer = new database.customerModel(newObject);
        customer.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyCustomer(filterSchema, newObject) {
    return new Promise(function (resolve, reject) {
        database.customerModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });

}

function deleteCustomer(filterSchema) {
    return new Promise(function (resolve, reject) {
        database.customerModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}


module.exports = {
    getCustomers: getCustomers,
    createCustomer: createCustomer,
    modifyCustomer: modifyCustomer,
    deleteCustomer: deleteCustomer
};