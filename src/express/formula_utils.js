const database = require('./database.js');
const mongoose = require('mongoose');

function getFormulas(formulaname, formulanameregex, formulanumber, ingredient, limit) {
    console.log("get formula.");
    return new Promise((resolve, reject) => {
        console.log(ingredient);
        var orClause = [];
        if (formulaname) {
            orClause.push({ formulaname: formulaname });
        }
        if (formulanumber) {
            orClause.push({ formulanumber: formulanumber });
        }
        if (ingredient != "" && ingredient != undefined) {
            orClause.push({ "ingredientsandquantities.ingredient" : ingredient});
        }
        if(formulanameregex) {
            orClause.push({ formulaname: { $regex: formulanameregex }});
        }
        var filterSchema = {
            $or: orClause
        }
        console.log(filterSchema);
        database.formulaModel.find(filterSchema).limit(limit).populate('ingredientsandquantities.ingredient').exec(function(err, formulas) {
            if(formulas != undefined && formulas != null){
                resolve(formulas);
              }
              else {
                  reject(Error(err));
              }  
        });
    });
}

function createFormula(newFormulaObject) {
    return new Promise((resolve, reject) => {
        // for (var i = i; i < newFormulaObject['ingredientsandquantities'].length; i++) {
        //     newFormulaObject['ingredientsandquantities'][i]['ingredient'] = mongoose.Types.ObjectId(newFormulaObject['ingredientsandquantities'][i]['ingredient']);
        // }
        let formula = new database.formulaModel(newFormulaObject);
        formula.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function createFormula(formulaname, formulanumber, 
    ingredientsandquantities, comment) {

    console.log("Now we in here");
    
    return new Promise(function (resolve, reject) {
        createUniqueFormulaNumber().then(response => {
            var newformulanumber;  

            if (formulanumber == null) {
                newformulanumber = Number(response)
            }
            else {
                newformulanumber = formulanumber
            }
            let formula = new database.formulaModel({
                formulaname: formulaname,
                formulanumber: newformulanumber,
                ingredientsandquantities: ingredientsandquantities,
                comment: comment
            });

            formula.save().then(result => {
                console.log("result: " + result);
                resolve(result);
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            throw(Error(err));
        });
        
    });
}


function modifyFormula(formulaname, newFormulaObject) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            formulaname: formulaname
        }
        database.formulaModel.updateOne(filterSchema, newFormulaObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteFormula(sku, ingredient) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            sku: sku,
            ingredient: ingredient
        }
        database.formulaModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function createUniqueFormulaNumber() {
    var newformulanumber;
    var numFound = false;
    while (!numFound) {
        newformulanumber = Math.round(Math.random() * 100000000);
        return new Promise(function (resolve, reject) {
            database.formulaModel.find({ 'formulanumber':newformulanumber }, 'formulanumber').exec((err,result)=> {
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
            resolve(newformulanumber);  
        });
    }
}

module.exports = {
    getFormulas: getFormulas,
    createFormula: createFormula,
    modifyFormula: modifyFormula,
    deleteFormula: deleteFormula
};