const express = require('express');
const cors = require('cors');
const headerParser = require('header-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const user_utils = require('./user_utils.js');
const formula_utils = require('./formula_utils.js');
const ingredient_utils = require('./ingredient_utils.js');
const product_line_utils = require('./product_line_utils.js');

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

function resolveError(err, res) {
    console.log(err);
    res.send({
        err:""+err
    });
}

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
                user_utils.getUsers(req.headers['username'],"",null,true,1).then(response => {
                    res.send({
                        token: response[0].token,
                        admin: response[0].admin,
                        localuser: true
                    });
                }).catch(err => {
                    resolveError(err, res);
                });
            } else {
                res.send({
                    err: "Incorrect username or password"
                });
            }
        }).catch(err => {
            resolveError(err, res);
        });
    }
});

///////////////////// users /////////////////////

app.route('/users').get((req, res) => {
    var admin = req.headers['admin']===undefined||req.headers['admin']===""||req.headers['admin']==="null"?null:req.headers['admin']==="true";
    var localuser = req.headers['localuser']===undefined||req.headers['localuser']===""||req.headers['localuser']==="null"?null:req.headers['localuser']==="true";
    user_utils.getUsers(req.headers['username'], req.headers['usernameregex'], admin, localuser, Number(req.headers['limit'])).then(users => {
        var usersToSend = [];
        for (var i = 0; i < users.length; i=i+1) {
            usersToSend.push({
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
    console.log(req.headers);
    user_utils.deleteUser(req.headers['username'], req.headers['localuser']).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});

///////////////////// formulas /////////////////////

app.route('/formulas').get((req, res) => {
    formula_utils.getFormulas(req.headers['sku'], req.headers['ingredient'], req.headers['limit']).then(formulas => {
        res.send(formulas);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).put((req, res) => {
    formula_utils.createFormula(req.body).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).post((req, res) => {
    formula_utils.modifyFormula(req.headers['sku'], req.headers['ingredient'], req.body).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).delete((req, res) => {
    formula_utils.deleteFormula(req.headers['sku'], req.headers['ingredient']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
});

///////////////////// ingredients /////////////////////
app.route('/ingredients').get((req, res) => {
    ingredient_utils.getIngredients(req.headers['ingredientname'], req.headers['ingredientnumber'], req.headers['limit']).then(ingredients => {
        res.send(ingredients);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).put((req, res) => {
    ingredient_utils.createIngredient(req.body['ingredientname'], req.body['ingredientnumber'],
    req.body['vendorinformation'], req.body['unitofmeasure'], req.body['amount'],
    req.body['costperpackage'], req.body['comment']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).post((req, res) => {
    ingredient_utils.modifyIngredient(req.headers['ingredientname'], req.body).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).delete((req, res) => {
    ingredient_utils.deleteIngredient(req.headers['ingredientname']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
});

///////////////////// skus /////////////////////
app.route('/skus').get((req, res) => {
    sku_utils.getSkus(req.headers['skuName'], req.headers['skuNumber'], Number(req.headers['limit'])).then(skus => {
        res.send(skus);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).put((req, res) => {
    sku_utils.createSku(req.body['skuName'], req.body['skuNumber'],
    req.body['caseUpcNumber'], req.body['unitUpcNumber'],
    req.body['unitSize'], req.body['countPerCase'], req.body['comment']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).post((req, res) => {
    sku_utils.modifySku(req.headers['skuName'], req.body['skuName'],
    req.body['skuNumber'], req.body['caseUpcNumber'], req.body['unitUpcNumber'],
    req.body['unitSize'], req.body['countPerCase'], req.body['comment']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
}).delete((req, res) => {
    sku_utils.deleteSku(req.headers['skuName']).then(response => {
        res.send(response);
    }).catch(err => {
        res.send({
            err:""+err
        });
    });
});

///////////////////// product lines /////////////////////
app.route('/product_lines').get((req, res) => {
    product_line_utils.getProductLines(req.headers['productlinename'], req.headers['productlinenameregex'], JSON.parse(req.headers['limit'])).then(productLines => {
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
    product_line_utils.modifyProductLine(req.headers['productlinename'], req.body).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
}).delete((req, res) => {
    product_line_utils.deleteProductLine(req.headers['productlinename']).then(response => {
        res.send(response);
    }).catch(err => {
        resolveError(err, res);
    });
});