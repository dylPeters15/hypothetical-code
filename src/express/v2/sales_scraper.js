const rp = require('request-promise');
const sales_utils = require('./sales_utils.js')
const database = require('../database.js');
const $ = require('cheerio');
const url = 'http://hypomeals-sales.colab.duke.edu:8080'; // /?sku=1&year=2010


async function scrapeAll(){
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
          var customer = database.customerModel.findOneAndUpdate(currentCustomerTuple, currentCustomerTuple, function(err, result){
            if(err){
              throw err;
            }
            
            var sale = {
              "date": date,
              "sku": sku['_id'],
              "customer":  result['id'],
              "numcases": children.eq(5).text(),
              "pricepercase": children.eq(6).text().trim()
          };
          sales_utils.createSale(sale);
          });

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
    scrapeAll: scrapeAll
}

