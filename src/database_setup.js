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
for (i = 0; i < 10; i++) {
    let user1_salt = crypto.randomBytes(16).toString('hex');
    let user1 = new database_library.userModel({
        username: 'user'+i,
        salt: user1_salt,
        saltedHashedPassword: crypto.pbkdf2Sync('password', user1_salt, 1000, 64, 'sha512').toString('hex'),
        token: crypto.randomBytes(16).toString('hex')
    });
    user1.save().then(
        doc => {
            console.log(doc);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

<<<<<<< HEAD
let testGoal = new database_library.goalsModel({
  name: 'Goal-1',
  skus: [1,2,3,4,5],
  quantities: [2.1,3.2,1.1,5,6],
  date: Date.now()
});
testGoal.save().then(
    doc => {
        console.log(doc);
    }
).catch(
    err => {
        console.log(err);
    }
);

// let user1_salt = crypto.randomBytes(16).toString('hex');
// let user1 = new database_library.userModel({
//     username: 'user1',
//     salt: user1_salt,
//     saltedHashedPassword: crypto.pbkdf2Sync('password', user1_salt, 1000, 64, 'sha512').toString('hex'),
//     token: crypto.randomBytes(16).toString('hex')
// });
// user1.save().then(
//     doc => {
//         console.log(doc);
//     }
// ).catch(
//     err => {
//         console.log(err);
//     }
// );
=======
>>>>>>> f66f0a8dab5ca4a9e9bee89bd9a8548b49ad5271
