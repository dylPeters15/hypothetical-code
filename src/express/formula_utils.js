const database = require('./database.js');

function getFormulas(formulaname, formulanumber, ingredient, limit) {

    formulaname = formulaname||"";
    formulanumber = formulanumber||-1;
    ingredient = ingredient||-1;
    limit = limit || database.defaultSearchLimit;
    console.log(ingredient)
    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                { formulaname: formulaname },
                { formulanumber: formulanumber },
                { ingredient: ingredient }
            ]
        }
        database.formulaModel.find(filterSchema).limit(limit).populate('ingredientsandquantities.ingredient').exec((err, formulas) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(formulas);
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