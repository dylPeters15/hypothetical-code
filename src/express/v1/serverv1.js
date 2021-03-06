const user_utils = require('./user_utils.js');
const formula_utils = require('./formula_utils.js');
const ingredient_utils = require('./ingredient_utils.js');
const line_utils = require('./manufacturing_line_utils');
const activity_utils = require('./manufacturing_activity_utils');
const product_line_utils = require('./product_line_utils.js');
const sku_utils = require('./sku_utils.js');
const goals_utils = require('./manufacturing_goals_utils.js');

function startServerV1(app) {
    function resolveError(err, res) {
        console.log(err);
        res.send({
            err: "" + err
        });
    }

    app.route('/login').get((req, res) => {
        if (req.headers['netidtoken']) {
            user_utils.getLoginInfoForFederatedUser(req.headers['netidtoken'], req.headers['clientid']).then(user => {
                res.send({
                    username: user.username,
                    token: user.token,
                    admin: user.admin,
                    localuser: false,
                    analyst: user.analyst,
                    productmanager: user.productmanager,
                    businessmanager: user.businessmanager,
                    manufacturinglinestomanage: user.manufacturinglinestomanage
                });
            }).catch(err => {
                resolveError(err, res);
            });
        } else {
            user_utils.usernamePasswordCorrect(req.headers['username'], req.headers['password']).then(correct => {
                if (correct) {
                    user_utils.getUsers(req.headers['username'], "", null, true, 1).then(response => {
                        res.send({
                            username: response[0].username,
                            token: response[0].token,
                            admin: response[0].admin,
                            localuser: true,
                            analyst: response[0].analyst,
                            productmanager: response[0].productmanager,
                            businessmanager: response[0].businessmanager,
                            manufacturinglinestomanage: response[0].manufacturinglinestomanage
                        });
                    }).catch(err => {
                        resolveError(err, res);
                    });
                } else {
                    resolveError("Incorrect username or password", res);
                }
            }).catch(err => {
                resolveError(err, res);
            });
        }
    });

    ///////////////////// users /////////////////////

    app.route('/users').get((req, res) => {
        var admin = req.headers['admin'] === undefined || req.headers['admin'] === "" || req.headers['admin'] === "null" ? null : req.headers['admin'] === "true";
        var localuser = req.headers['localuser'] === undefined || req.headers['localuser'] === "" || req.headers['localuser'] === "null" ? null : req.headers['localuser'] === "true";
        user_utils.getUsers(req.headers['username'], req.headers['usernameregex'], admin, localuser, Number(req.headers['limit'])).then(users => {
            var usersToSend = [];
            for (var i = 0; i < users.length; i = i + 1) {
                usersToSend.push({
                    _id: users[i]._id,
                    username: users[i].username,
                    admin: users[i].admin,
                    localuser: users[i].localuser
                });
            }
            res.send(usersToSend);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        user_utils.createUser(req.body['username'], req.body['password'], req.body['admin'], req.body['localuser']).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        user_utils.modifyUser(req.headers['username'], req.headers['localuser'], req.body['password'], req.body['admin']).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        user_utils.deleteUser(req.headers['username'], req.headers['localuser']).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// formulas /////////////////////

    app.route('/formulas').get((req, res) => {
        console.log("rest api invoked.", req.headers);
        formula_utils.getFormulas(decodeURIComponent(req.headers['formulaname']), decodeURIComponent(req.headers['formulanameregex']), JSON.parse(req.headers['formulanumber']), req.headers['ingredient'], JSON.parse(req.headers['limit'])).then(formulas => {
            res.send(formulas);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        formula_utils.createFormula(req.body['formulaname'], req.body['formulanumber'],
            req.body['ingredientsandquantities'], req.body['comment']).then(response => {
                res.send(response);
            }).catch(err => {
                resolveError(err, res);
            });
    }).post((req, res) => {
        formula_utils.modifyFormula(decodeURIComponent(req.headers['formulaname']), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        formula_utils.deleteFormula((req.headers['formulanumber'])).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// ingredients /////////////////////
    app.route('/ingredients').get((req, res) => {
        ingredient_utils.getIngredients(decodeURIComponent(req.headers['ingredientname']), decodeURIComponent(req.headers['ingredientnameregex']), JSON.parse(req.headers['ingredientnumber']), req.headers['limit']).then(ingredients => {
            res.send(ingredients);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        ingredient_utils.createIngredient(req.body['ingredientname'], req.body['ingredientnumber'],
            req.body['vendorinformation'], req.body['unitofmeasure'], req.body['amount'],
            req.body['costperpackage'], req.body['comment']).then(response => {
                res.send(response);
            }).catch(err => {
                resolveError(err, res);
            });
    }).post((req, res) => {
        ingredient_utils.modifyIngredient(decodeURIComponent(req.headers['ingredientname']), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        ingredient_utils.deleteIngredient(decodeURIComponent(req.headers['ingredientname'])).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// skus /////////////////////
    app.route('/skus').get((req, res) => {
        console.log(req.headers);
        sku_utils.getSkus(decodeURIComponent(req.headers['skuname']), decodeURIComponent(req.headers['skunameregex']), Number(req.headers['skunumber']), Number(req.headers['caseupcnumber']), Number(req.headers['unitupcnumber']), req.headers['formula'], Number(req.headers['limit'])).then(skus => {
            res.send(skus);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        sku_utils.createSku(req.body['skuname'], req.body['skunumber'],
            req.body['caseupcnumber'], req.body['unitupcnumber'],
            req.body['unitsize'], req.body['countpercase'], req.body['formulanum'], req.body['formulascalingfactor'], req.body['manufacturingrate'], req.body['comment']).then(response => {
                res.send(response);
            }).catch(err => {
                resolveError(err, res);
            });
    }).post((req, res) => {
        sku_utils.modifySku(decodeURIComponent(req.headers['skuname']), req.body['skuname'], req.body['skunumber'],
            req.body['caseupcnumber'], req.body['unitupcnumber'],
            req.body['unitsize'], req.body['countpercase'], req.body['formulanum'], req.body['formulascalingfactor'], req.body['manufacturingrate'], req.body['comment']).then(response => {
                res.send(response);
            }).catch(err => {
                resolveError(err, res);
            });
    }).delete((req, res) => {
        sku_utils.deleteSku(decodeURIComponent(req.headers['skuname'])).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// Manufacturing Goals /////////////////////
    app.route('/manufacturing-goals').get((req, res) => {
        goals_utils.getGoals(decodeURIComponent(req.headers['owner']), Boolean(req.headers['enabled']), decodeURIComponent(req.headers['goalname']), decodeURIComponent(req.headers['goalnameregex']), req.headers['limit']).then(formulas => {
            res.send(formulas);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        goals_utils.createGoal(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        goals_utils.modifyGoal(decodeURIComponent(req.headers['goalname']), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        goals_utils.deleteGoal(decodeURIComponent(req.headers['goalname'])).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });


    ///////////////////// Manufacturing Lines /////////////////////
    app.route('/manufacturing-lines').get((req, res) => {
        line_utils.getLine(decodeURIComponent(req.headers['linename']), decodeURIComponent(req.headers['linenameregex']), decodeURIComponent(req.headers['shortname']), decodeURIComponent(req.headers['shortnameregex']), req.headers['limit']).then(formulas => {
            res.send(formulas);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        line_utils.createLine(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        line_utils.modifyLine(decodeURIComponent(req.headers['linename']), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        line_utils.deleteLine(decodeURIComponent(req.headers['linename']), req.headers['shortname']?decodeURIComponent(req.headers['shortname']):req.headers['shortname'], req.headers['skus'], req.headers['comment']).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// Manufacturing Activity /////////////////////
    app.route('/manufacturing-activities').get((req, res) => {
        activity_utils.getActivity(new Date(JSON.parse(req.headers['startdate'])), req.headers['limit'], req.headers['line']).then(activities => {
            res.send(activities);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        activity_utils.createActivity(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        activity_utils.modifyActivity(req.headers['_id'], Number(req.headers['numcases']), Number(req.headers['calculatedhours']), new Date(req.headers['startdate']), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        activity_utils.deleteActivity(req.headers['_id']).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });
    ///////////////////// product lines /////////////////////
    app.route('/product_lines').get((req, res) => {
        product_line_utils.getProductLines(decodeURIComponent(req.headers['productlinename']), decodeURIComponent(req.headers['productlinenameregex']), JSON.parse(req.headers['limit'])).then(productLines => {
            res.send(productLines);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        product_line_utils.createProductLine(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        product_line_utils.modifyProductLine(decodeURIComponent(req.headers['productlinename']), req.body).then(response => {
            res.send(response);
            console.log('sent')
        }).catch(err => {
            console.log('error');
            resolveError(err, res);
        });
    }).delete((req, res) => {
        product_line_utils.deleteProductLine(decodeURIComponent(req.headers['productlinename'])).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });
}
module.exports = {
    startServerV1: startServerV1
};