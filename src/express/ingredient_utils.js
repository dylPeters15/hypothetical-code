const database = require('./database.js');

function getIngredients(filterSchema, limit, optionsDict) {
    return new Promise(function (resolve, reject) {
        database.ingredientModel.find(filterSchema).limit(limit).exec((err, ingredients) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(ingredients);
        });
    });

}

function createIngredient(newObject) {
    return new Promise(function (resolve, reject) {
        let ingredient = new database.ingredientModel(newObject);
        ingredient.save().then(result => {
            resolve(result);
        }).catch(err => {
            reject(Error(err));
        });
    }).catch(err => {
        throw (Error(err));
    });
}

function modifyIngredient(filterSchema, newObject, optionsDict) {
    return new Promise(function (resolve, reject) {
        database.ingredientModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteIngredient(filterSchema, optionsDict) {
    return new Promise(function (resolve, reject) {
        database.ingredientModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function createUniqueIngredientNumber() {
    var newingredientnumber;
    var numFound = false;
    while (!numFound) {
        newingredientnumber = Math.round(Math.random() * 100000000);
        return new Promise(function (resolve, reject) {
            database.ingredientModel.find({ 'ingredientnumber': newingredientnumber }, 'ingredientnumber').exec((err, result) => {
                if (result == null) {
                    numFound = true;
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    numFound = false;
                }


            });
            resolve(newingredientnumber);
        });
    }


}

module.exports = {
    getIngredients: getIngredients,
    createIngredient: createIngredient,
    modifyIngredient: modifyIngredient,
    deleteIngredient: deleteIngredient
};