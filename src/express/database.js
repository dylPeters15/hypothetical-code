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

var localUserRequired = function() {
  return this.localuser;
}
/**
 * Valid search criteria:
 * userName - match/regex
 */
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false
  },
  salt: {
    type: String,
    required: localUserRequired,
    unique: false
  },
  saltedhashedpassword: {
    type: String,
    required: localUserRequired,
    unique: false
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    required: true,
    unique: false
  },
  localuser: {
    type: Boolean,
    required: true,
    unique: false
  }
});
userSchema.index({ username: 1, localuser: 1 }, { unique: true }); //the combination of username and localuser should be unique
userSchema.plugin(uniqueValidator);

var userModel = mongoose.model('user', userSchema);

/**
 * Valid search criteria:
 * name - match/regex
 * number - match
 */
var ingredientSchema = new mongoose.Schema({
  ingredientname: {
    type: String,
    required: true,
    unique: true
  },
  ingredientnumber: {
    type: Number,
    required: true,
    unique: true
  },
  vendorinformation: {
    type: String,
    required: false,
    unique: false
  },
  unitofmeasure: {
    type: String,
    required: true,
    unique: false
  },
  amount: {
    type: Number,
    required: true,
    unique: false
  },
  costperpackage: {
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
  skuname: {
    type: String,
    required: true,
    unique: true
  },
  skunumber: {
    type: Number,
    required: true,
    unique: true
  },
  caseupcnumber: {
    type: Number,
    required: true,
    unique: true
  },
  unitupcnumber: {
    type: Number,
    required: true,
    unique: true
  },
  unitsize: {
    type: String,
    required: true,
    unique: false
  },
  countpercase: {
    type: Number,
    required: true,
    unique: false
  },
  formula: {
    type: ObjectId,
    ref: 'formula',
    required: true,
    unique: false
  },
  formulascalingfactor: {
    type: Number,
    required: true,
    unique: false
  },
  manufacturingrate: {
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
  productlinename: {
    type: String,
    required: true
  },
  skus: [{
    sku: {
      type: ObjectId,
      ref: 'sku'
    }
  }]
  
});
productLineSchema.index({ productlinename: 1, sku: 1 }, { unique: true }); //the combination of name and sku should be unique
productLineSchema.plugin(uniqueValidator);

var productLineModel = mongoose.model('productline', productLineSchema);

/**
 * Valid search criteria:
 * goalName - match/regex
 * sku - match,
 * date - match,
 * owner - match
 */
var manufacturingGoalsSchema = new mongoose.Schema({
  goalname: {
    type: String,
    required: true,
    unique: false
  },
  activities: [{
    type: ObjectId,
    ref: 'activity'
  }],
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
manufacturingGoalsSchema.index({ owner: 1, goalname: 1 }, { unique: true }); //the combination of owner and goal name should be unique
manufacturingGoalsSchema.plugin(uniqueValidator);

var goalsModel = mongoose.model('goal', manufacturingGoalsSchema);

/**
 * Valid search criteria:
 * sku - match,
 * ingredient - match
 */
var formulaSchema = new mongoose.Schema({
  formulaname: {
    type: String,
    required: true,
    unique: true
  },
  formulanumber: {
    type: String,
    required: true,
    unique: true
  },
  ingredientsandquantities: [{
    ingredient: {
      type: ObjectId,
      ref: 'ingredient',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  comment: {
    type: String,
    required: false,
    unique: false
  }
});
formulaSchema.index({ sku: 1, ingredient: 1 }, { unique: true }); //the combination of sku and ingredient should be unique
formulaSchema.plugin(uniqueValidator);

var formulaModel = mongoose.model('formula', formulaSchema);

/**
 * Valid search criteria:
 * linename - match, regex,
 * shortname - match, regex
 */
var manufacturingLineSchema = new mongoose.Schema({
  linename: {
    type: String,
    required: true,
    unique: true
  },
  shortname: {
    type: String,
    required: true,
    unique: true
  },
  skus: [{
    sku: {
      type: ObjectId,
      ref: 'sku'
    }
  }],
  comment: {
    type: String,
    required: false,
    unique: false
  }
});
manufacturingLineSchema.plugin(uniqueValidator);

var manufacturingLineModel = mongoose.model('line', manufacturingLineSchema);

/**
 * Valid search criteria:
 * linename - match, regex,
 * shortname - match, regex
 */
var manufacturingActivitySchema = new mongoose.Schema({
  sku: {
    type: ObjectId,
    ref: 'sku',
    required: true,
    unique: false
  },
  numcases: {
    type: Number,
    required: true,
    unique: false
  },
  calculatedhours: {
    type: Number,
    required: true,
    unique: false
  },
  sethours: {
    type: Number,
    required: false,
    unique: false
  },
  startdate: {
    type: Date,
    required: false,
    unique: false
  },
  line: {
    type: ObjectId,
    ref: 'line'
  }
});
manufacturingActivitySchema.plugin(uniqueValidator);

var manufacturingActivityModel = mongoose.model('activity', manufacturingActivitySchema);

module.exports = {
  defaultSearchLimit: defaultSearchLimit,
  userModel: userModel,
  goalsModel: goalsModel,
  ingredientModel: ingredientModel,
  skuModel: skuModel,
  productLineModel: productLineModel,
  formulaModel: formulaModel,
  manufacturingLineModel: manufacturingLineModel,
  manufacturingActivityModel: manufacturingActivityModel,
  dropDatabase: dropDatabase
};