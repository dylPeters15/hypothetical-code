const database = require('./database.js');

   
function getActivity(startdate, limit) {
    startdate = startdate || "";
    limit = limit || database.defaultSearchLimit;
    return new Promise((resolve, reject) => {
        var filterSchema = {
            "created_on": {
                "$gte": startdate
            }
        }
        database.manufacturingLineModel.find(filterSchema).limit(limit).toArray(function(err,results) {
            if(results.length > 0){
              resolve(results);
            }
            else {
                reject(Error(err));
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

function modifyActivity(sku, numcases, calculatedhours, sethours, startdate, line, newActivityObject) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            sku: sku,
            numcases: numcases,
            calculatedhours: calculatedhours,
            sethours: sethours,
            startdate: startdate,
            line: line
        }
        database.manufacturingActivityModel.updateOne(filterSchema, newActivityObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
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