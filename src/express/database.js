const mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
const uniqueValidator = require('mongoose-unique-validator');

const serverName = '127.0.0.1:27017';
const dbName = 'hypothetical-code-db';
const connectionString = `mongodb://${serverName}/${dbName}`;
const defaultSearchLimit = 20;

mongoose.connect(connectionString);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function dropDatabase() {
  return db.dropDatabase();
}

/**
 * Valid search criteria:
 * userName - match/regex
 */
var userSchema = new mongoose.Schema({
  userName: {
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
userSchema.plugin(uniqueValidator);
var userModel = mongoose.model('user', userSchema);

/**
 * Valid search criteria:
 * name - match/regex
 * number - match
 */
var ingredientSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
    unique: true
  },
  ingredientNumber: {
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
ingredientSchema.plugin(uniqueValidator);
var ingredientModel = mongoose.model('ingredient', ingredientSchema);

/**
 * Valid search criteria:
 * name - match/regex
 * skuNumber - match
 * caseUpcNumber - match
 * unitUpcNumber - match
 */
var skuSchema = new mongoose.Schema({
  skuName: {
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
    unique: true
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
skuSchema.plugin(uniqueValidator);
var skuModel = mongoose.model('sku', skuSchema);

/**
 * Valid search criteria:
 * productLineName - match/regex
 * sku - match
 */
var productLineSchema = new mongoose.Schema({
  productLineName: {
    type: String,
    required: true
  },
  sku: {
    type: ObjectId,
    ref: 'sku'
  }
});
productLineSchema.plugin(uniqueValidator);
productLineSchema.index({ name: 1, sku: 1 }, { unique: true }); //the combination of name and sku should be unique

var productLineModel = mongoose.model('product_line', productLineSchema);

/**
 * Valid search criteria:
 * goalName - match/regex
 * sku - match,
 * date - match,
 * owner - match
 */
var manufacturingGoalsSchema = new mongoose.Schema({
  goalName: {
    type: String,
    required: true,
    unique: false
  },
  sku: {
    type: ObjectId,
    ref: 'sku',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    unique: false
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  }
});
manufacturingGoalsSchema.plugin(uniqueValidator);
manufacturingGoalsSchema.index({ owner: 1, name: 1 }, { unique: true }); //the combination of owner and goal name should be unique

var goalsModel = mongoose.model('goal', manufacturingGoalsSchema);

/**
 * Valid search criteria:
 * sku - match,
 * ingredient - match
 */
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
formulaSchema.plugin(uniqueValidator);
formulaSchema.index({ sku: 1, ingredient: 1 }, { unique: true }); //the combination of sku and ingredient should be unique

var formulaModel = mongoose.model('formula', formulaSchema);

module.exports = {
  defaultSearchLimit: defaultSearchLimit,
  userModel: userModel,
  goalsModel: goalsModel,
  ingredientModel: ingredientModel,
  skuModel: skuModel,
  productLineModel: productLineModel,
  formulaModel: formulaModel,
  dropDatabase: dropDatabase
};