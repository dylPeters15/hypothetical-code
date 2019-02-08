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
    return new Promise((resolve, reject) => {
        database.userModel.find({}).select('token -_id').exec((err, tokens) => {
            if (err) {
                reject(Error(err));
                return
            }
            var token = crypto.randomBytes(16).toString('hex');
            var maxIterations = 10000;
            var iterations = 0;
            while (tokens.includes(token)) {
                token = crypto.randomBytes(16).toString('hex');
                iterations = iterations + 1;
                if (iterations >= maxIterations) {
                    reject(Error("Could not generate token."));
                }
            }
            resolve(token);
        });
    });
}

function getUsers(userName, userNameRegex, limit) {
    userName = userName || "";
    userNameRegex = userNameRegex || "$a";
    limit = limit || database.defaultSearchLimit;

    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                { userName: userName },
                { userName: { $regex: userNameRegex } }
            ]
        }
        database.userModel.find(filterSchema).limit(limit).exec((err, users) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(users);
        });
    });
}

function createUser(username, password) {
    return new Promise((resolve, reject) => {
        let saltAndHash = generateSaltAndHash(password);
        generateToken().then(token => {
            let user = new database.userModel({
                userName: username,
                salt: saltAndHash.salt,
                saltedHashedPassword: saltAndHash.hash,
                token: token
            });
            user.save().then(response => {
                resolve(response);
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function modifyUser(userName, newPassword) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            userName: userName
        }
        var saltAndHash = generateSaltAndHash(newPassword);
        var updateObject = {
            $set: {
                salt: saltAndHash.salt,
                saltedHashedPassword: saltAndHash.hash
            }
        }
        database.userModel.updateOne(filterSchema, updateObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteUser(userName) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            userName: userName
        }
        database.userModel.deleteOne(filterSchema, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    modifyUser: modifyUser,
    deleteUser: deleteUser
};