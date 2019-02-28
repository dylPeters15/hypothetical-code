const express = require('express');
const cors = require('cors');
const headerParser = require('header-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const user_utils = require('./user_utils.js');
const formula_utils = require('./formula_utils.js');
const ingredient_utils = require('./ingredient_utils.js');
const line_utils = require('./manufacturing_line_utils');
const activity_utils = require('./manufacturing_activity_utils');
const product_line_utils = require('./product_line_utils.js');
const sku_utils = require('./sku_utils.js');
const goals_utils = require('./manufacturing_goals_utils.js')

const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

app.use(cors(corsOptions));
app.use(headerParser);
app.use(bodyParser.json());

const server = https.createServer({
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/fullchain.pem')
}, app).listen(8443, () => {
    console.log('Server started!');
});
module.exports = server;

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

function getOptionsDictionaryFromHeaders(headers) {
    var filterschema = getFilterSchemaFromHeaders(headers);
    if (filterschema['$or']) {
        return filterschema['$or'];
    } else if (filterschema['$and']) {
        return filterschema['$and'];
    } else {
        return [];
    }
}

function resolveError(err, res) {
    console.log(err);
    res.send({
        err: "" + err
    });
}

///////////////////// users /////////////////////
app.route('/users').get((req, res) => {
    console.log(req.headers);
    user_utils.getUsers(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(users => {
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
    console.log(req.headers);
    user_utils.modifyUser(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    user_utils.deleteUser(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// formulas /////////////////////
app.route('/formulas').get((req, res) => {
    formula_utils.getFormulas(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(formulas => {
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
    formula_utils.modifyFormula(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    formula_utils.deleteFormula(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// ingredients /////////////////////
app.route('/ingredients').get((req, res) => {
    ingredient_utils.getIngredients(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(ingredients => {
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
    ingredient_utils.modifyIngredient(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    ingredient_utils.deleteIngredient(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// skus /////////////////////
app.route('/skus').get((req, res) => {
    sku_utils.getSkus(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(skus => {
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
    sku_utils.modifySku(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    sku_utils.deleteSku(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// Manufacturing Goals /////////////////////
app.route('/manufacturing-goals').get((req, res) => {
    goals_utils.getGoals(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(goals => {
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
    goals_utils.modifyGoal(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    goals_utils.deleteGoal(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// Manufacturing Lines /////////////////////
app.route('/manufacturing-lines').get((req, res) => {
    line_utils.getLine(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(lines => {
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
    line_utils.modifyLine(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    line_utils.deleteLine(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// Manufacturing Activity /////////////////////
app.route('/manufacturing-activities').get((req, res) => {
    activity_utils.getActivity(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(activities => {
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
    activity_utils.modifyActivity(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    activity_utils.deleteActivity(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// product lines /////////////////////
app.route('/product_lines').get((req, res) => {
    product_line_utils.getProductLines(getFilterSchemaFromHeaders(req.headers), getLimitFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(productLines => {
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
    product_line_utils.modifyProductLine(getFilterSchemaFromHeaders(req.headers), req.body, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
        console.log('sent')
    }).catch(err => {
        console.log('error');
        resolveError(err, res);
    });
}).delete((req, res) => {
    product_line_utils.deleteProductLine(getFilterSchemaFromHeaders(req.headers), getOptionsDictionaryFromHeaders(req.headers)).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// login /////////////////////
app.route('/login').get((req, res) => {
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
                user_utils.getUsers(getFilterSchemaFromHeaders(req.headers), 1, getOptionsDictionaryFromHeaders(req.headers)).then(response => {
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