const database = require('./database.js');
const crypto = require('crypto');
const axios = require('axios');

function usernamePasswordCorrect(username, password) {
    return new Promise((resolve, reject) => {
        getUsers({
            username: username
        }).then(users => {
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



function createFederatedUser(netidtoken, clientid) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.colab.duke.edu/identity/v1/', {
            headers: {
                'x-api-key': clientid,
                'Authorization': 'Bearer ' + netidtoken
            }
        }).then(response => {
            var netid = response.data.netid;
            createUser({
                username: netid,
                admin: false,
                localuser: false
            }).then(response => {
                resolve(response);
            }).catch(err => {
                reject(Error(err));
            });
        }).catch(err => {
            reject(Error(err));
        });
    });
}

function getLoginInfoForFederatedUser(netidtoken, clientid) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.colab.duke.edu/identity/v1/', {
            headers: {
                'x-api-key': clientid,
                'Authorization': 'Bearer ' + netidtoken
            }
        }).then(response => {
            var netid = response.data.netid;
            getUsers({
                username: netid
            }).then(users => {
                if (users.length == 1) {
                    resolve(users[0]);
                } else if (users.length == 0) {
                    //user does not exist. create it
                    createFederatedUser(netidtoken, clientid).then(createResponse => {
                        getUsers({
                            username: netid,
                            localuser: false
                        }).then(users => {
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

function getUsers(filterSchema, limit) {
    return new Promise((resolve, reject) => {
        database.userModel.find(filterSchema).limit(limit).exec((err, users) => {
            if (err) {
                reject(Error(err));
                return;
            }
            resolve(users);
        });
    });
}

function createUser(newObject) {
    return new Promise((resolve, reject) => {
        generateToken().then(token => {
            newObject['token'] = token;
            if (newObject['localuser']) {
                let saltAndHash = generateSaltAndHash(newObject['password']);
                newObject['salt'] = saltAndHash.salt;
                newObject['saltedhashedpassword'] = saltAndHash.hash;
            }
            let user = new database.userModel(newObject);
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

function modifyUser(filterSchema, newObject) {
    console.log(filterSchema);
    console.log(newObject);
    return new Promise((resolve, reject) => {
        if (newObject['$set']['password']) {
            var saltAndHash = generateSaltAndHash(newObject['$set']['password']);
            newObject['$set']['salt'] = saltAndHash.salt;
            newObject['$set']['saltedhashedpassword'] = saltAndHash.hash;
            delete newObject['$set']['password'];
        }
        database.userModel.updateOne(filterSchema, newObject, (err, response) => {
            if (err) {
                reject(Error(err));
                return
            }
            resolve(response);
        });
    });
}

function deleteUser(filterSchema) {
    return new Promise((resolve, reject) => {
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
    usernamePasswordCorrect: usernamePasswordCorrect,
    getLoginInfoForFederatedUser: getLoginInfoForFederatedUser
};