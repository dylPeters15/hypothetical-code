const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const validator = require('validator');

const server = '127.0.0.1:27017';
const database = 'my-test-db';
const connectionString = `mongodb://${server}/${database}`;

// class Database {
//   constructor() {
//     this._connect();
//   }
//   _connect() {
//     mongoose.connect(connectionString)
//       .then(() => {
//         console.log('Database connection successful');
//       })
//       .catch(err => {
//         console.error('Database connection error');
//       });
//   }
// }

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  salt: {
    type: String,
    required: true,
    unique: false
  },
  saltedHashedPassword: {
    type: String,
    required: true,
    unique: false
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
});
var userModel = mongoose.model('user', userSchema);

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
  }
});

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
    type: Number,
    required: true,
    unique: true
  },
  unitUpcNumber: {
    type: Number,
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
  comment: {
    type: String,
    required: false,
    unique: false
  }
});

var skuModel = mongoose.model('sku', skuSchema);

var productLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  skus: [
    {
      type: ObjectId,
      ref: 'sku'
    }
  ]
});

var productLineModel = mongoose.model('product_line', productLineSchema);

var manufacturingGoalsSchema = new mongoose.Schema({
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  skusAndQuantities: [
    {
      sku: {
        type: ObjectId,
        ref: 'sku',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    required: true,
    unique: false
  }
});

manufacturingGoalsSchema.index({ owner: 1, name: 1}, { unique: true }); //the combination of owner and goal name should be unique

var goalsModel = mongoose.model('goal', manufacturingGoalsSchema);

var formulaSchema = new mongoose.Schema({
  sku: {
    type: ObjectId,
    ref: 'sku',
    required: true
  },
  ingredient: {
    type: ObjectId,
    ref: 'ingredient',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

var formulaModel = mongoose.model('formula', formulaSchema);

module.exports = {
  server: server,
  database: database,
  connectionString: connectionString,
  userModel: userModel,
  goalsModel: goalsModel,
  ingredientModel: ingredientModel,
  skuModel: skuModel,
  productLineModel: productLineModel,
  formulaModel: formulaModel
};
