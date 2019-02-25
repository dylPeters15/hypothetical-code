const database = require('./database.js');

function getFormulas(formulaname, formulanumber, sku, ingredient, limit) {

    formulaname = formulaname||"";
    formulanumber = formulanumber||-1;
    sku = sku||-1;
    ingredient = ingredient||-1;
    limit = limit || database.defaultSearchLimit;

    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                { formulaname: formulaname },
                { formulanumber: formulanumber }
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
            console.log("formulaname: " + formulaname);
            console.log("formulanumber: " + formulanumber);
            console.log("ingredientsandquantities: " + ingredientsandquantities);
            console.log("m_quantity: " + ingredientsandquantities[0].quantity);
            console.log("m_ingredient: " + ingredientsandquantities[0].ingredient);

            console.log("comment: " + comment);
            console.log("get ready");


            formula.save().then(result => {
                console.log("result: " + result);
                console.log("retuls data: " + result.data);
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