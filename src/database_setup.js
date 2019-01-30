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

let testIngredient = new database_library.ingredientModel({
    name: 'Tomato',
    number: 10,
    venderInformation: 'hey jude, dont make it bad',
    packageSize: '60lb drum',
    costPerPackage: '100',
    comment: 'Take a sad song and make it better'
  });
  testIngredient.save().then(
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
