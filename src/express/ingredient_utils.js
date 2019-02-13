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
    
    return new Promise(function (resolve, reject) {
        createUniqueIngredientNumber().then(response => {
            var newingredientnumber;  

            if (ingredientnumber == null) {
                newingredientnumber = Number(response)
            }
            else {
                newingredientnumber = ingredientnumber
            }
            // newingredientnumber = ingredientnumber || Number(response);
            


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