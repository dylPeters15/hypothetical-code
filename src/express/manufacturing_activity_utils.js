const database = require('./database.js');

   
function getActivity(startdate, limit) {
    startdate = startdate || "";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            "startdate": {
                $gte: startdate
            }
        };
        database.manufacturingActivityModel.find(filterSchema).limit(limit).deepPopulate('sku.formula.ingredientsandquantities.ingredient').populate('line').exec(function(err,results) {
            if(err){
                reject(Error(err));
            }
            else {
                resolve(results);
            }  
        });
    })
     
    
}

function createActivity(activityObject) {
    return new Promise((resolve, reject) => {
        let newActivity = new database.manufacturingActivityModel(activityObject);
        newActivity.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyActivity(sku, numcases, calculatedhours, startdate, newActivityObject) {
    console.log("NEW OBJ: " + JSON.stringify(newActivityObject))
    return new Promise((resolve, reject) => {
        var filterSchema = {
            sku: sku,
            numcases: numcases,
            calculatedhours: calculatedhours,
            startdate: startdate
        }
        database.manufacturingActivityModel.updateOne(filterSchema, newActivityObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            console.log("RES: " + JSON.stringify(response))
            resolve(response);
        });
    });
}

function deleteActivity(sku, numcases, calculatedhours, sethours, startdate, line) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            sku: sku,
            numcases: numcases,
            calculatedhours: calculatedhours,
            sethours: sethours,
            startdate: startdate,
            line: line
        }
        database.manufacturingActivityModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getActivity: getActivity,
    createActivity: createActivity,
    modifyActivity: modifyActivity,
    deleteActivity: deleteActivity
};