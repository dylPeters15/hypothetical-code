let mongoose = require('mongoose');
let validator = require('validator');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'my-test-db';      // REPLACE WITH YOUR DB NAME

class Database {
    constructor(successCallback, errCallback) {
        this._connect();
    }
    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`)
            .then(() => {
                console.log('Database connection successful');
                successCallback();
            })
            .catch(err => {
                console.error('Database connection error');
                errCallback();
            });
    }
}


class UserClass {
    constructor() {
        this.schema = new mongoose.Schema({
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
        this.model = mongoose.model('user', this.schema);
    }
}




module.exports = {
    Database: Database,
    UserClass: UserClass
};