const database = require('./database.js');

function getFormulas(formulaname, formulanumber, sku, ingredient, limit) {

    formulaname = formulaname||"";
    formulanumber = formulanumber||-1;
    sku = sku||-1;
    ingredient = ingredient||-1;
    limit = limit || database.defaultSearchLimit;


    console.log("Formula name: ", JSON.stringify(formulaname));
    console.log("Formula num: ", formulanumber);
    console.log("sku: ", sku);
    console.log("ingredient: ", ingredient);

    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                { formulaname: formulaname },
                { formulanumber: formulanumber }
            ]
        }
        database.formulaModel.find(filterSchema).limit(limit).populate('sku ingredient').exec((err, formulas) => {
            if (err) {
                reject(Error(err));
                return;
            }
            console.log(formulas);
            resolve(formulas);
        });
    });
}

function createFormula(newFormulaObject) {
    return new Promise((resolve, reject) => {
        console.log(newFormulaObject);
        // for (var i = i; i < newFormulaObject['ingredientsandquantities'].length; i++) {
        //     newFormulaObject['ingredientsandquantities'][i]['ingredient'] = mongoose.Types.ObjectId(newFormulaObject['ingredientsandquantities'][i]['ingredient']);
        // }
        let formula = new database.formulaModel(newFormulaObject);
        formula.save().then(response => {
            resolve(response);
        }).catch(err => {
            console.log(Error(err));
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