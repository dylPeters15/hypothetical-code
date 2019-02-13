const database = require('./database.js');
const crypto = require('crypto');
const axios = require('axios');

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

function getUsers(username, usernameregex, admin, localuser, limit) {
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
        if (localuser !== null && localuser !== undefined && localuser !== "") {
            filterSchema['localuser'] = localuser;
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

function createUser(username, password, admin, localuser) {
    return new Promise((resolve, reject) => {
        generateToken().then(token => {
            var userObject = {
                username: username,
                token: token,
                admin: admin,
                localuser: localuser
            };
            if (localuser) {
                console.log("Creating hash.");
                let saltAndHash = generateSaltAndHash(password);
                userObject['salt'] = saltAndHash.salt;
                userObject['saltedhashedpassword'] = saltAndHash.hash;
            }
            let user = new database.userModel(userObject);
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

function modifyUser(username, localuser, newPassword, newAdmin) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            username: username,
            localuser: localuser
        }
        var toSet = {};
        if (localuser && newPassword !== null && newPassword !== undefined && newPassword !== "") {
            var saltAndHash = generateSaltAndHash(newPassword);
            toSet['salt'] = saltAndHash.salt;
            toSet['saltedhashedpassword'] = saltAndHash.hash;
        }
        if (newAdmin !== null && newAdmin !== undefined && newAdmin !== "") {
            toSet['admin'] = newAdmin;
        }
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

function deleteUser(username, localuser) {
    return new Promise((resolve, reject) => {
        var filterSchema = {
            username: username,
            localuser: localuser
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

function createFederatedUser(netidtoken) {
    console.log("Create federated user.");
    return new Promise((resolve, reject) => {
        axios.get('https://api.colab.duke.edu/identity/v1/', {
            headers: {
                'x-api-key': 'localhost',
                'Authorization': 'Bearer ' + netidtoken
            }
        }).then(response => {
            var netid = response.data.netid;
            createUser(netid, null, false, false).then(response => {
                resolve(response);
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function getLoginInfoForFederatedUser(netidtoken) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.colab.duke.edu/identity/v1/', {
            headers: {
                'x-api-key': 'localhost',
                'Authorization': 'Bearer ' + netidtoken
            }
        }).then(response => {
            var netid = response.data.netid;
            getUsers(netid, null, null, false, 1).then(users => {
                console.log(users);
                if (users.length == 1) {
                    resolve(users[0]);
                } else if (users.length == 0) {
                    //user does not exist. create it
                    createFederatedUser(netidtoken).then(createResponse => {
                        console.log("Create response: ", createResponse);
                        getUsers(netid, null, null, false, 1).then(users => {
                            console.log(users);
                            if (users.length == 1) {
                                resolve(users[0]);
                            } else {
                                reject(Error("Error finding user."));
                            }
                        }).catch(err => {
                            reject(Error(err));
                        })
                    }).catch(err => {
                        reject(Error(err));
                    });
                } else {
                    reject(Error("Error finding user."));
                }
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            reject(Error(err));
        });
    });
}

module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    modifyUser: modifyUser,
    deleteUser: deleteUser,
    usernamePasswordCorrect: usernamePasswordCorrect,
    getLoginInfoForFederatedUser: getLoginInfoForFederatedUser
};