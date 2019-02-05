const database_library = require('./database.js');
const crypto = require('crypto');

let db = database_library.Database;
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

let testSku = new database_library.skuModel({
    name: 'Tomato Soup',
    skuNumber: 2,
    caseUpcNumber: '018273821922',
    unitUpcNumber: '163728391922',
    unitSize: '28oz',
    countPerCase: 10,
    productLine: 'Example product line',
    ingredientTuples: [5942948208, 2, 5942948209, 0.5],
    comment: "Enjoy this lovely can of tomato soup!",
    id: 5942948208
  });
  testSku.save().then(
      doc => {
          console.log(doc);
      }
  ).catch(
      err => {
          console.log(err);
      }
  );

  let testIngredient1 = new database_library.ingredientModel({
    name: 'tomato',
    number: 1,
    vendorInformation: 'hypothetical farm',
    packageSize: '50 units',
    costPerPackage: 20,
    comment: 'This is a comment!',
    skus: ['Tomato Soup'],
    id: 5942948208
  });
  testIngredient1.save().then(
      doc => {
          console.log(doc);
      }
  ).catch(
      err => {
          console.log(err);
      }
  );

  let testIngredient2 = new database_library.ingredientModel({
    name: 'salt',
    number: 2,
    vendorInformation: 'salty',
    packageSize: '20lbs',
    costPerPackage: 70,
    comment: '',
    skus: ['Tomato Soup'],
    id: 5942948209
  });
  testIngredient2.save().then(
      doc => {
          console.log(doc);
      }
  ).catch(
      err => {
          console.log(err);
      }
  );

