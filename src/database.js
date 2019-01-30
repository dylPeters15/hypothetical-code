let mongoose = require('mongoose');
let validator = require('validator');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'my-test-db';      // REPLACE WITH YOUR DB NAME

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error');
            });
    }
}

var skuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    number: {
      type: Number,
      required: true,
      unique: true
    },
    venderInformation: {
      type: String,
      required: false,
      unique: false
    },
    packageSize: {
      type: String,
      required: true,
      unique: false
    },
    costPerPackage: {
        type: Number,
        required: true,
        unique: false
      },
    comment: {
        type: String,
        required: false,
        unique: false
      }
  })

  var skuModel = mongoose.model('sku', skuSchema);

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    saltedHashedPassword: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});
var userModel = mongoose.model('user', userSchema);



module.exports = {
    Database: new Database(),
    userModel: userModel,
    skuModel: skuModel
};