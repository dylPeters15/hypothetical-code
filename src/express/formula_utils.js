const database = require('./database.js');
const mongoose = require('mongoose');

function getFormulas(formulaname, formulanumber, ingredient, limit) {
    return new Promise((resolve, reject) => {
        console.log(ingredient)
        var orClause = [];
        if (formulaname) {
            orClause.push({ formulaname: formulaname });
        }
        if (formulanumber) {
            orClause.push({ formulanumber: formulanumber });
        }
        if (ingredient > 0) {
            orClause.push({ "ingredientsandquantities.ingredient" : ingredient});
        }
        var filterSchema = {
            $or: orClause
        }
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

module.exports = {
    getFormulas: getFormulas,
    createFormula: createFormula,
    modifyFormula: modifyFormula,
    deleteFormula: deleteFormula
};