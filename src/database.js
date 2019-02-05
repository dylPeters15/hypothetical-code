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

var manufacturingGoalsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  skus: {
    type: [Number],
    required: true,
    unique: false
  },
  quantities: {
    type: [Number],
    required: true,
    unique: false
  },
  date: {
    type: Date,
    required: true,
    unique: true
  }
})

var goalsModel = mongoose.model('goal', manufacturingGoalsSchema);

var ingredientSchema = new mongoose.Schema({
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
    vendorInformation: {
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
      },
    skus: {
        type: Array,
        required: false,
        unique: false
    },
    id: {
      type: Number,
      required: true,
      unique: true
    }
  })

  var ingredientModel = mongoose.model('ingredient', ingredientSchema);

  var skuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    skuNumber: {
      type: Number,
      required: true,
      unique: true
    },
    caseUpcNumber: {
      type: String,
      required: true,
      unique: true
    },
    unitUpcNumber: {
      type: String,
      required: true,
      unique: false
    },
    unitSize: {
        type: String,
        required: true,
        unique: false
      },
    countPerCase: {
        type: Number,
        required: true,
        unique: false
      },
    productLine: {
        type: String,
        required: true,
        unique: false
      },
    ingredientTuples: {
          type: Array,
          required: true,
          unique: false
        },
    comment: {
          type: String,
          required: false,
          unique: false
     },
     id: {
      type: Number,
      required: true,
      unique: true
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

var fileSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: false
  },
  file: {
      type: String,
      required: true,
      unique: false
  },
});
var fileModel = mongoose.model('file', fileSchema);


module.exports = {
    Database: new Database(),
    userModel: userModel,
    goalsModel: goalsModel,
    ingredientModel: ingredientModel,
    skuModel: skuModel,
    fileModel: fileModel
};
