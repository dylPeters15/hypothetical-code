const database_library = require('./database.js');
const mongoose = require('mongoose');
const crypto = require('crypto');
const ingredientUtils = require('./v1/ingredient_utils.js')
const formulaUtils = require('./v1/formula_utils.js')
const skuUtils = require('./v1/sku_utils.js')
const productLineUtils = require('./v1/product_line_utils.js')
const serverName = '127.0.0.1:27017';
const dbName = 'hypothetical-code-db';
const connectionString = `mongodb://${serverName}/${dbName}`;
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connection successful');
        initializeUsers();
    })
    .catch(err => {
        console.error('Database connection error');
    });

function initializeUsers() {

}

// let db = database_library.Database;
// for (i = 0; i < 10; i++) {
//     let user1_salt = crypto.randomBytes(16).toString('hex');
//     let user1 = new database_library.userModel({
//         username: 'user'+i,
//         salt: user1_salt,
//         saltedHashedPassword: crypto.pbkdf2Sync('password', user1_salt, 1000, 64, 'sha512').toString('hex'),
//         token: crypto.randomBytes(16).toString('hex')
//     });
//     user1.save().then(
//         doc => {
//             console.log(doc);
//         }
//     ).catch(
//         err => {
//             console.log(err);
//         }
//     );
// }

// let testGoal = new database_library.goalsModel({
//     user: 'admin',
//   name: 'Goal1',
//   skus: [2],
//   quantities: [3],
//   date: Date.parse("02/05/2019")
// });
// testGoal.save().then(
//     doc => {
//         console.log(doc);
//     }
// ).catch(
//     err => {
//         console.log(err);
//     }
// );
let testIngredient = ingredientUtils.createIngredient('salt', 1, 'salty', 'g', 50, 70, '');
// let saltPromise = ingredientUtils.getIngredients('salt');
// saltPromise.then((successMessage) => {
//     saltIng = successMessage;
//     console.log("Success: " + successMessage)
// }).catch((err) => {
//     console.log(err)
// });
// console.log(saltIng._id)
let testFormula = {
    formulaname: 'formula1',
    formulanumber: '1',
    ingredientsandquantities: [{
        ingredient: testIngredient._id,
        quantity: 5
    }],
    comment: 'work'
}
formulaUtils.createFormula(testFormula)
let testSku = new database_library.skuModel({
    skuname: 'Tomato Soup',
    skunumber: 2,
    caseupcnumber: 012312312312,
    unitupcnumber: 163728391922,
    unitsize: '28oz',
    countpercase: 10,
    formula: testFormula,
    formulascalingfactor: 1.5,
    manufacturingrate: 2,
    comment: 'Enjoy this lovely can of tomato soup!'
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




let testProductLine = new database_library.productLineModel({
    productlinename: 'Soups',
    skus: [testSku]
})
productLineUtils.createProductLine(testProductLine)
//   testSku.save().then(
//       doc => {
//           console.log(doc);
//       }
//   ).catch(
//       err => {
//           console.log(err);
//       }
//   );

//   let testIngredient1 = new database_library.ingredientModel({
//     name: 'tomato',
//     number: 1,
//     vendorInformation: 'hypothetical farm',
//     packageSize: '50 units',
//     costPerPackage: 20,
//     comment: 'This is a comment!',
//     skus: ['Tomato Soup'],
//     id: 5942948208
//   });
//   testIngredient1.save().then(
//       doc => {
//           console.log(doc);
//       }
//   ).catch(
//       err => {
//           console.log(err);
//       }
//   );



