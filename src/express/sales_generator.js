const mongoose = require('mongoose');
const database = require('./database.js');
const customer_utils = require('./v2/customer_utils');
const sales_utils = require('./v2/sales_utils');
const sku_utils = require('./v2/sku_utils');

var customerNames = ['Walmart', 'HyVee', 'CVS', 'Kroger'];
var customerNumbers = [1, 2, 3, 4];

initializeCustomers().then(() => {
    initializeSales().then(() => {
        mongoose.connection.close();
    });
});

async function initializeCustomers() {
    for (var i = 0; i < customerNames.length; i++) {
        try { //doing a try catch here so that it does not throw an error if it already exists
            await customer_utils.createCustomer({
                customername: customerNames[i],
                customernumber: customerNumbers[i]
            });
        } catch (e) {
            // console.log(e);
        }
    }
}

async function initializeSalesForCustomer(customerName) {
    var skus = await sku_utils.getSkus({},10000);
    for (var i = 0; i < 100; i++) {
        var date = new Date();
        date.setFullYear(date.getFullYear()-Math.random()*20+1, Math.random()*12, Math.random()*28);
        var skuid = skus[parseInt(Math.random()*skus.length)]['_id'];
        var customerid = (await customer_utils.getCustomers({
            customername: customerName
        }, 1))[0]['_id'];
        await sales_utils.createSale({
            sku: skuid,
            customer: customerid,
            date: date,
            numcases: Math.random() * 1000,
            pricepercase: Math.random() + 100
        });
    }
}

async function initializeSales() {
    for (let customerName of customerNames) {
        await initializeSalesForCustomer(customerName);
    }
}