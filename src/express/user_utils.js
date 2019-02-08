const database = require('./database.js');
const crypto = require('crypto');

function generateSaltAndHash(password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: hash
    };
}

//need to ensure that token is unique
function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

function getUsers(userName, userNameRegex, limit) {
    return new Promise(function (resolve, reject) {
        database.userModel.findOne({userName:userName}, (err, user) => {
            if (err) {
                reject(Error(err));
            } else {
                resolve(user);
            }
        });
    });
}

function createUser(username, password) {
    return new Promise(function (resolve, reject) {
        let saltAndHash = generateSaltAndHash(password);
        let user = new database.userModel({
            userName: username,
            salt: saltAndHash.salt,
            saltedHashedPassword: saltAndHash.hash,
            token: generateToken()
        });
        user.save().then(response => {
            resolve(response);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyUser(searchCriteria, username, password) {

}

function deleteUser(searchCriteria) {

}

module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    modifyUser: modifyUser,
    deleteUser: deleteUser
};