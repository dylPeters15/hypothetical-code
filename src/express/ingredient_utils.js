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
                console.log(err)
                reject(Error(err));
                return;
            }
            // console.log("Found: " + ingredients)
            resolve(ingredients);
        });
    });
    
}

function createIngredient(ingredientname, ingredientnumber, 
    vendorinformation, unitofmeasure, amount, costperpackage, comment) {
    
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
                unitofmeasure: unitofmeasure,
                amount: amount,
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

function modifyIngredient(ingredientname, newIngredientObject) {

        return new Promise(function (resolve, reject) {
            const filterschema = {
                ingredientname: ingredientname
        
            };
            database.ingredientModel.updateOne(filterschema, newIngredientObject , (err, response) => {
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
            ingredientname: ingredientname
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