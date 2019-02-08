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

function getUsers(username, usernameregex, limit) {
    username = username || "";
    usernameregex = usernameregex || "$a";
    limit = limit || database.defaultSearchLimit;

    return new Promise((resolve, reject) => {
        var filterSchema = {
            $or: [
                { username: username },
                { username: { $regex: usernameregex } }
            ]
        }
        database.userModel.find(filterSchema).limit(limit).exec((err, users) => {
            console.log("Filter schema: ", filterSchema);
            console.log("Users: ",users);
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
                username: username,
                salt: saltAndHash.salt,
                saltedhashedpassword: saltAndHash.hash,
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

function modifyUser(username, newPassword) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            username: username
        }
        var saltAndHash = generateSaltAndHash(newPassword);
        var updateObject = {
            $set: {
                salt: saltAndHash.salt,
                saltedhashedpassword: saltAndHash.hash
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

function deleteUser(username) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            username: username
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