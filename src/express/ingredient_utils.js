const database = require('./database.js');

function getIngredients(ingredientname, ingredientnameregex, ingredientnumber,limit){

    ingredientname = ingredientname || "";
    ingredientnameregex = ingredientnameregex || "$a";
    ingredientnumber = ingredientnumber || 1;
    limit = limit || database.defaultSearchLimit;

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or:[
                {ingredientname: ingredientname},
                {ingredientnumber: ingredientnumber},
                {ingredientname: { $regex: ingredientnameregex }}
            ]
        }
        database.ingredientModel.find(filterSchema).limit(limit).exec((err, ingredients) => {
            if (err) {
                reject(Error(err));
                return;
            }
            console.log(ingredients)
            resolve(ingredients);
        });
    });
    
}

function createIngredient(ingredientname, ingredientnumber, 
    vendorinformation, packagesize, costperpackage, comment) {
    
    return new Promise(function (resolve, reject) {
        createUniqueIngredientNumber().then(response => {
            var newingredientnumber;  

            if (ingredientnumber == null) {
                newingredientnumber = Number(response)
            }
            else {
                newingredientnumber = ingredientnumber
            }
            console.log(newingredientnumber)
            let ingredient = new database.ingredientModel({
                ingredientname: ingredientname,
                ingredientnumber: newingredientnumber,
                vendorinformation: vendorinformation,
                packagesize: packagesize,
                costperpackage: costperpackage,
                comment: comment
            });
            ingredient.save().then(result => {
                console.log(result)
                resolve(result);
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            throw(Error(err));
        });
        
    });

    
}

function modifyIngredient(oldingredientname, newingredientname, ingredientnumber, vendorinformation, packagesize,
    costperpackage, comment) {

    return new Promise(function (resolve, reject) {
        const filterschema = {
            ingredientname: oldingredientname,
    
        };
        var updateObject = {
            $set: {
                ingredientname: newingredientname,
                ingredientnumber: ingredientnumber,
                vendorinformation: vendorinformation,
                packagesize: packagesize,
                costperpackage: costperpackage,
                comment: comment
            }
        }
        database.ingredientModel.updateOne(filterschema, updateObject , (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            console.log("utils",response)
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
    var newingredientnumber;
    var numFound = false;
    while (!numFound) {
        newingredientnumber = Math.round(Math.random() * 100000000);
        return new Promise(function (resolve, reject) {
            database.ingredientModel.find({ 'ingredientnumber':newingredientnumber }, 'ingredientnumber').exec((err,result)=> {
                if (result == null) {
                }
                if (err) {
                    reject(Error(err));
                }
                if (result != null) {
                    numFound = true;
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