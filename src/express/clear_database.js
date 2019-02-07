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