const database = require('./database.js');

   
function getLine(linename, linenameregex, shortname, shortnameregex, limit) {
    linename = linename || "";
    shortname = shortname || "";
    shortnameregex = shortnameregex || "$a";
    linenameregex = linenameregex || "$a";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                {linename: linename},
                {linename: {$regex: linenameregex}},
                {shortname: shortname},
                {shortname: {$regex: shortnameregex}}
            ]
        }
        database.manufacturingLineModel.find(filterSchema).limit(limit).populate('skus.sku').exec(function(err,results) {
            if(err){
                reject(Error(err));
            }
            else {
                resolve(results);
            }  
        });
    })
     
    
}

function createLine(lineObject) {
    console.log("OBJ: " + JSON.stringify(lineObject))
    return new Promise((resolve, reject) => {
        let newLine = new database.manufacturingLineModel(lineObject);
        newLine.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyLine(linename, newLineObject) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            linename: linename
        }
        database.manufacturingLineModel.updateOne(filterSchema, newLineObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteLine(linename) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            linename: linename
        }
        database.manufacturingLineModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getLine: getLine,
    createLine: createLine,
    modifyLine: modifyLine,
    deleteLine: deleteLine
};