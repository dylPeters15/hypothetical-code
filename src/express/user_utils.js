const database = require('./database.js');
const crypto = require('crypto');

function usernamePasswordCorrect(username, password) {
    return new Promise((resolve, reject) => {
        getUsers(username).then(users => {
            if (users.length != 1) {
                reject(Error("Could not find username"));
                return;
            }
            var user = users[0];
            resolve(generateHash(password, user.salt) == user.saltedhashedpassword);
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function generateHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSaltAndHash(password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = generateHash(password, salt);
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

function getUsers(username, usernameregex, admin, limit) {
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
        if (admin !== null && admin !== undefined && admin !== "") {
            filterSchema['admin'] = admin;
        }
        console.log(filterSchema);
        database.userModel.find(filterSchema).limit(limit).exec((err, users) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(users);
        });
    });
}

function createUser(username, password, admin) {
    return new Promise((resolve, reject) => {
        let saltAndHash = generateSaltAndHash(password);
        generateToken().then(token => {
            let user = new database.userModel({
                username: username,
                salt: saltAndHash.salt,
                saltedhashedpassword: saltAndHash.hash,
                token: token,
                admin: admin
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

function modifyUser(username, newPassword, newAdmin) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            username: username
        }
        var toSet = {};
        if (newPassword !== null && newPassword !== undefined && newPassword !== "") {
            var saltAndHash = generateSaltAndHash(newPassword);
            toSet['salt'] = saltAndHash.salt;
            toSet['saltedhashedpassword'] = saltAndHash.hash;
        }
        if (newAdmin !== null && newAdmin !== undefined && newAdmin !== "") {
            toSet['admin'] = newAdmin;
        }
        console.log(newAdmin !== "");
        console.log(toSet);
        var updateObject = {
            $set: toSet
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
    deleteUser: deleteUser,
    usernamePasswordCorrect: usernamePasswordCorrect
};