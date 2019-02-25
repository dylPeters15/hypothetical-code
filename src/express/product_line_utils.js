const database = require('./database.js');

function getProductLines(productlinename, productlinenameregex, limit){

    productlinename = productlinename || "";
    productlinenameregex = productlinenameregex || "$a";
    limit = limit || database.defaultSearchLimit;

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or:[
                {productlinename: productlinename},
                {productlinename: { $regex: productlinenameregex }}
            ]
        };
        database.productLineModel.find(filterSchema).limit(limit).populate('skus.sku').exec((err, productLines) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(productLines);
        });
    });
    
}

function createProductLine(newProductLineObject) {
    
    return new Promise(function (resolve, reject) {

        let productLine = new database.productLineModel(newProductLineObject);
        productLine.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(Error(err));
        });
        
    });

    
}

function modifyProductLine(productlinename, newProductLineObject) {

    return new Promise(function (resolve, reject) {
        const filterschema = {
            productlinename: productlinename
        };
        database.productLineModel.updateOne(filterschema, newProductLineObject , (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
    
}

function deleteProductLine(productlinename) {
    
    return new Promise(function (resolve, reject) {
        var filterschema = {
            productlinename: productlinename
        };
        database.productLineModel.deleteOne(filterschema, (err, response) => {
            if (err) {
                console.log("failed to delete ", productlinename)
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