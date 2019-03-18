const user_utils = require('./user_utils.js');
const formula_utils = require('./formula_utils.js');
const ingredient_utils = require('./ingredient_utils.js');
const line_utils = require('./manufacturing_line_utils');
const activity_utils = require('./manufacturing_activity_utils');
const product_line_utils = require('./product_line_utils.js');
const sku_utils = require('./sku_utils.js');
const goals_utils = require('./manufacturing_goals_utils.js')
<<<<<<< HEAD
const scraper = require('./sales_scraper.js')
=======
const customer_utils = require('./customer_utils.js')
const sales_utils = require('./sales_utils.js')

>>>>>>> a997796303fadccd5b8f2fb27fe30bee36981fd1
function startServerV2(app) {
    ///////////////////// Utilities /////////////////////
    function getFilterSchemaFromHeaders(headers) {
        if (!headers) {
            throw Error("Headers are undefined.");
        }
        if (!headers['andvsor'] || !headers['andorclause']) {
            return {};
        }
        var filterschema = {};
        filterschema[headers['andvsor']] = JSON.parse(headers['andorclause']);
        if (filterschema[headers['andvsor']].length == 0) {
            return {};
        }
        return filterschema;
    }

    function getLimitFromHeaders(headers) {
        if (!headers) {
            throw Error("Headers are undefined.");
        }
        if (!headers['limit']) {
            return 20; //default value
        }
        return JSON.parse(headers['limit']);
    }

    function resolveError(err, res) {
        console.log(err);
        res.send({
            err: "" + err
        });
    }

    ///////////////////// users /////////////////////
    app.route('/api/v2/users').get((req, res) => {
        user_utils.getUsers(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(users => {
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
        user_utils.createUser(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        user_utils.modifyUser(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        user_utils.deleteUser(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// formulas /////////////////////
    app.route('/api/v2/formulas').get((req, res) => {
        formula_utils.getFormulas(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(formulas => {
            res.send(formulas);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        formula_utils.createFormula(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        formula_utils.modifyFormula(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        formula_utils.deleteFormula(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// ingredients /////////////////////
    app.route('/api/v2/ingredients').get((req, res) => {
        ingredient_utils.getIngredients(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(ingredients => {
            res.send(ingredients);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        ingredient_utils.createIngredient(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        ingredient_utils.modifyIngredient(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        ingredient_utils.deleteIngredient(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// skus /////////////////////
    app.route('/api/v2/skus').get((req, res) => {
        sku_utils.getSkus(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(skus => {
            res.send(skus);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        sku_utils.createSku(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        sku_utils.modifySku(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        sku_utils.deleteSku(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// Manufacturing Goals /////////////////////
    app.route('/api/v2/manufacturing-goals').get((req, res) => {
        goals_utils.getGoals(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(goals => {
            res.send(goals);
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
        goals_utils.modifyGoal(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        goals_utils.deleteGoal(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// Manufacturing Lines /////////////////////
    app.route('/api/v2/manufacturing-lines').get((req, res) => {
        line_utils.getLine(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(lines => {
            res.send(lines);
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
        line_utils.modifyLine(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        line_utils.deleteLine(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// Manufacturing Activity /////////////////////
    app.route('/api/v2/manufacturing-activities').get((req, res) => {
        activity_utils.getActivity(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(activities => {
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
        activity_utils.modifyActivity(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        activity_utils.deleteActivity(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// product lines /////////////////////
    app.route('/api/v2/product_lines').get((req, res) => {
        product_line_utils.getProductLines(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(productLines => {
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
        product_line_utils.modifyProductLine(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        product_line_utils.deleteProductLine(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// customers /////////////////////
    app.route('/api/v2/customers').get((req, res) => {
        customer_utils.getCustomers(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(customers => {
            res.send(customers);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        customer_utils.createCustomer(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        customer_utils.modifyCustomer(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        customer_utils.deleteCustomer(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// sales /////////////////////
    app.route('/api/v2/sales').get((req, res) => {
        sales_utils.getSales(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers)).then(sales => {
            res.send(sales);
        }).catch(err => {
            resolveError(err, res);
        });
    }).put((req, res) => {
        sales_utils.createSale(req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).post((req, res) => {
        sales_utils.modifySale(getFilterSchemaFromHeaders(req.headers), req.body).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    }).delete((req, res) => {
        sales_utils.deleteSale(getFilterSchemaFromHeaders(req.headers)).then(response => {
            res.send(response);
        }).catch(err => {
            resolveError(err, res);
        });
    });

    ///////////////////// login /////////////////////
    app.route('/api/v2/login').get((req, res) => {
        if (req.headers['netidtoken']) {
            user_utils.getLoginInfoForFederatedUser(req.headers['netidtoken'], req.headers['clientid']).then(user => {
                res.send({
                    username: user.username,
                    token: user.token,
                    admin: user.admin,
                    localuser: false
                });
            }).catch(err => {
                resolveError(err, res);
            });
        } else {
            user_utils.usernamePasswordCorrect(req.headers['username'], req.headers['password']).then(correct => {
                if (correct) {
                    user_utils.getUsers(getFilterSchemaFromHeaders(req.headers), 1).then(response => {
                        res.send({
                            token: response[0].token,
                            admin: response[0].admin,
                            localuser: true
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
}
module.exports = {
    startServerV2: startServerV2
};