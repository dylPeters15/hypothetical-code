const database = require('./database.js');

function getIngredients(ingredientName, ingredientNumber){

    return new Promise(function (resolve, reject) {
        const filterSchema = {
            $or:[
                {ingredientName:ingredientName},
                {ingredientNumber:ingredientNumber},
                {ingredientName: { $regex: /ingredientName/ }}
            ]
        }
        db.collection('ingredients').findOne(filterschema, function(err,results) {
            if(err) {
                console.log(err);
            }
            console.log(results)
            if(results != null){
                res.send(results);
            }
            else{
                res.send({
                    errormessage: 'No ingredient with name  ' + ingredientName +  
                    ' and no ingredient with number ' + ingredientNumber
                });
            }
            
        });
    });
    
}

function createIngredient(ingredientName, ingredientNumber = createUniqueIngredientNumber(), 
    vendorInformation, packageSize, costPerPackage, comment) {

    return new Promise(function (resolve, reject) {
        let ingredient = new database.ingredientModel({
            ingridentName: ingredientName,
            ingredientNumber: ingredientNumber,
            vendorInformation: vendorInformation,
            packageSize: packageSize,
            costPerPackage: costPerPackage,
            comment: comment
        });
        ingredient.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyIngredient(oldIngredientName, newIngredientName, ingredientNumber, vendorInformation, packageSize,
    costPerPackage, comment) {

    return new Promise(function (resolve, reject) {
        const filterschema = {
            oldIngredientName,
    
        };
        db.collection('ingredients').updateOne(filterschema, {
            $set: {
                ingredientName: newIngredientName,
                ingredientNumber: ingredientNumber,
                vendorInformation: vendorInformation,
                packageSize: packageSize,
                costPerPackage: costPerPackage,
                comment: comment
            }
        }, function (innerdberr, innerdbres) {
            res.send({
                success: true
            });
        });
    });
    
}

function deleteIngredient(ingredientName) {
    
    return new Promise(function (resolve, reject) {
        const filterschema = {
            name: ingredientName
        };
        db.collection('ingredients').deleteOne(filterschema, (dberr, dbres) => {
            if (dberr) {
                res.send({
                    errormessage: 'Unable to delete ingredient with name ' + ingredientName
                });
                return
            }
            res.send({
                success: true
            });
        });
    });    
}

function createUniqueIngredientNumber() {
    db.collection('ingredients').find({ ingredientNumber }, {ingredientNumber:1}, function(err,results) {
        if (results != null) {
            var newIngredientNumber;
            while (newIngredientNumber == null || !results.contains(newIngredientNumber)) {
                newIngredientNumber = Math.random() * 100000000;
            }
            return newIngredientNumber;
        }
    });
}