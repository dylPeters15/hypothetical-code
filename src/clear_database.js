var mongoose = require('mongoose');
/* Connect to the DB */
var asdf = mongoose.connect('mongodb://localhost/my-test-db',function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
    
    const database_library = require('./database.js');
    const crypto = require('crypto');
    
    let db = database_library.Database;
    let admin_salt = crypto.randomBytes(16).toString('hex');
    let admin = new database_library.userModel({
        username: 'admin',
        salt: admin_salt,
        saltedHashedPassword: crypto.pbkdf2Sync('password', admin_salt, 1000, 64, 'sha512').toString('hex'),
        token: crypto.randomBytes(16).toString('hex')
    });
    admin.save().then(
        doc => {
            console.log(doc);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
});


























// let mongoose = require('mongoose');
// let validator = require('validator');

// const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
// const database = 'my-test-db';      // REPLACE WITH YOUR DB NAME

// mongoose.connect(`mongodb://${server}/${database}`)
//             .then(function(db) {
//                 console.log('db connect ok');
        
//                 db.listCollections().toArray(function(err, collections){
//                     //collections = [{"name": "coll1"}, {"name": "coll2"}]
//                     console.log(err);
//                 });
        
//             }, function(err) {
//                 console.log(err);
//             });


































// // clearDB();

// // // const database_library = require('./database.js');
// // // let db = database_library.Database;
// // // const crypto = require('crypto');


// // // let admin_salt = crypto.randomBytes(16).toString('hex');
// // // let admin = new database_library.userModel({
// // //     username: 'admin',
// // //     salt: admin_salt,
// // //     saltedHashedPassword: crypto.pbkdf2Sync('password', admin_salt, 1000, 64, 'sha512').toString('hex'),
// // //     token: crypto.randomBytes(16).toString('hex')
// // // });
// // // admin.save().then(
// // //     doc => {
// // //         console.log(doc);
// // //     }
// // // ).catch(
// // //     err => {
// // //         console.log(err);
// // //     }
// // // );





// // function clearDB() {
// //     var MongoClient = require('mongodb').MongoClient
// //     , format = require('util').format;    

// //     MongoClient.connect('mongodb://127.0.0.1:27017/my-test-db', function(err, db) {
// //         if(err) throw err;
// //         db.listCollections().toArray(function(err, collections){
// //             if(!err){
// //                 service.dropCollections(db, collections);                
// //             } else {
// //                 console.log("!ERROR! "+ err.errmsg);
// //             }
// //         });
// //     });
// // }

// // function dropCollections(db, colls){
// //     for(var i = 0; i < colls.length; i++){
// //         var name = colls[i].name.substring('shiny_db.'.length);

// //         if (name.substring(0, 6) !== "system") {
// //             db.dropCollection(name, function(err) {
// //                 if(!err) {
// //                     console.log( name + " dropped");
// //                 } else {
// //                     console.log("!ERROR! " + err.errmsg);
// //                 }
// //             });
// //         } else {
// //             console.log(name + " cannot be dropped because it's a system file");
// //         }    
// //     } 
// // }