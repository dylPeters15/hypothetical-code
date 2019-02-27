const database = require('./database.js');
const mongoose = require('mongoose');

function getFormulas(filterSchema) {
    console.log("get formula.");
    return new Promise((resolve, reject) => {
        database.formulaModel.find(filterSchema).limit(limit).populate('ingredientsandquantities.ingredient').exec(function(err, formulas) {
            if(err){
                reject(Error(err));
              } else {
                resolve(formulas);
              }  
        });
    });
}

function createFormula(newFormulaObject) {
    return new Promise((resolve, reject) => {
        let formula = new database.formulaModel(newFormulaObject);
        formula.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyFormula(filterSchema, newFormulaObject) {
    return new Promise((resolve, reject) => {
        database.formulaModel.updateOne(filterSchema, newFormulaObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteFormula(filterSchema) {
    return new Promise(function (resolve, reject) {
        database.formulaModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });    
}

// function createUniqueFormulaNumber() {
//     var newformulanumber;
//     var numFound = false;
//     while (!numFound) {
//         newformulanumber = Math.round(Math.random() * 100000000);
//         return new Promise(function (resolve, reject) {
//             database.formulaModel.find({ 'formulanumber':newformulanumber }, 'formulanumber').exec((err,result)=> {
//                 if (result == null) {
//                     numFound = true;
//                 }
//                 if (err) {
//                     reject(Error(err));
//                 }
//                 if (result != null) {
//                     numFound = false;
//                 }
             
                 
//             });
//             resolve(newformulanumber);  
//         });
//     }
// }

module.exports = {
    getFormulas: getFormulas,
    createFormula: createFormula,
    modifyFormula: modifyFormula,
    deleteFormula: deleteFormula
};