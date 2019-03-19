const rp = require('request-promise');
const sales_utils = require('./sales_utils.js');
const database = require('../database.js');
const customer_utils = require('./customer_utils.js');
const $ = require('cheerio');
const url = 'http://hypomeals-sales.colab.duke.edu:8080'; // /?sku=1&year=2010

var customernames = [];
async function scrapeAll(){
  console.log("scraping");
  var result = await database.skuModel.find({}).exec().catch(err => {
    if (err) {
      throw err;
    }
  });
  for(sku of result) {
    var year = 0;
    for(year = 1999; year <= new Date().getFullYear(); year++){
        await scrape(sku.skunumber, year);
    }

  }
}

async function scrapeSku(sku) {
  var year = 0;
  for(year = 1999; year <= new Date().getFullYear(); year++){
    await scrape(sku.skunumber, year);
}
}

async function scrapeAllFromCurrentYear(){
  var result = await database.skuModel.find({}).exec().catch(err => {
    if (err) {
      throw err;
    }
  });
  for(sku of result) {
    await scrape(sku.skunumber, new Date().getFullYear());
  }
}


async function scrape(skunumber, year){
  let urlToParse = url + '/?sku=' + skunumber + '&year=' + year;
  var sku = await database.skuModel.findOne({
    skunumber: skunumber
  }).exec().catch(err => {
    if(err){
      throw err;
    }
  });
    rp(urlToParse)
    .then(function(html){  
      //success!
      const sales = [];
      var count = 0;
      $('tr', html).each(function(i, tr){
        if(count > 0){
          var children = $(this).children();
          var currentCustomerTuple = {
            customernumber: children.eq(3).text(),
            customername: children.eq(4).text()
          };
          var day = (1 + (Number(children.eq(2).text()) - 1) * 7)
          let date = new Date(year, 0, day);
          if(customernames.indexOf(currentCustomerTuple.customername) == -1){
            customernames.push(currentCustomerTuple.customername);
            customer_utils.createCustomer(currentCustomerTuple).then(function(result) {
              var sale = {
                "date": date,
                "sku": sku['_id'],
                "customer":  result['_id'],
                "numcases": children.eq(5).text(),
                "pricepercase": children.eq(6).text().trim()
            };
              sales_utils.createSale(sale);
          }).catch(function(err) {
            if(err){
              throw err;
            }
          })
        }
          else{
            var customer = database.customerModel.findOne(currentCustomerTuple).exec().then(function(results){
              console.log("INDEX: " + customernames.indexOf(currentCustomerTuple.customername))
                var sale = {
                  "date": date,
                  "sku": sku['_id'],
                  "customer":  results['_id'],
                  "numcases": children.eq(5).text(),
                  "pricepercase": children.eq(6).text().trim()
              };
                sales_utils.createSale(sale);
  
            }).catch(function(err){
              
              if(err){
                throw err;
              }
            });
          }

          

        }
        count++;
      });
    })
    .catch(function(err){
      if(err){
        throw err;
      }
    });
}

module.exports = {
    scrapeAll: scrapeAll,
    scrapeAllFromCurrentYear: scrapeAllFromCurrentYear,
    scrapeSku: scrapeSku
}

