const database = require('./database.js');

function getIngredients(ingredientname, ingredientnumber,limit){

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or:[
                {ingredientname:ingredientname},
                {ingredientnumber:ingredientnumber},
                {ingredientname: { $regex: /ingredientname/ }}
            ]
        }
        database.ingredientModel.find(filterSchema).limit(limit).exec((err, ingredients) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(ingredients);
        });
    });
    
}

function createIngredient(ingredientname, ingredientnumber, 
    vendorinformation, packagesize, costperpackage, comment) {
        
    ingredientnumber = ingredientnumber|| createUniqueIngredientNumber();

    return new Promise(function (resolve, reject) {
        let ingredient = new database.ingredientModel({
            ingridentname: ingredientname,
            ingredientnumber: ingredientnumber,
            vendorinformation: vendorinformation,
            packagesize: packagesize,
            costperpackage: costperpackage,
            comment: comment
        });
        ingredient.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyIngredient(oldingredientname, newingredientname, ingredientnumber, vendorinformation, packagesize,
    costperpackage, comment) {

    return new Promise(function (resolve, reject) {
        const filterschema = {
            oldingredientname,
    
        };
        database.ingredientModel.updateOne(filterschema, {
            $set: {
                ingredientname: newingredientname,
                ingredientnumber: ingredientnumber,
                vendorinformation: vendorinformation,
                packagesize: packagesize,
                costperpackage: costperpackage,
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

function deleteIngredient(ingredientname) {
    
    return new Promise(function (resolve, reject) {
        const filterschema = {
            name: ingredientname
        };
        database.ingredientModel.deleteOne(filterschema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });    
}

function createUniqueIngredientNumber() {
    database.collection('ingredients').find({ ingredientnumber }, {ingredientnumber:1}, function(err,results) {
        if (results != null) {
            var newingredientnumber;
            while (newingredientnumber == null || !results.contains(newingredientnumber)) {
                newingredientnumber = Math.random() * 100000000;
            }
            return newingredientnumber;
        }
    });
}

module.exports = {
    getIngredients: getIngredients,
    createIngredient: createIngredient,
    modifyIngredient: modifyIngredient,
    deleteIngredient: deleteIngredient
};