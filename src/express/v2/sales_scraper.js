const rp = require('request-promise');
const sales_utils = require('./sales_utils.js');
const database = require('../database.js');
const customer_utils = require('./customer_utils.js');
const $ = require('cheerio');
const url = 'http://hypomeals-sales.colab.duke.edu:8080'; // /?sku=1&year=2010

createdSkus = [];

async function scrapeAll(){
  console.log("scraping");
  var result = await database.skuModel.find({}).exec().catch(err => {
    if (err) {
      throw err;
    }
  });
  await scrapeCustomers();
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
  console.log("current year")
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
    var html = await rp(urlToParse);
      //success!
      const sales = [];
      count = 0;
      $('tr', html).each(function(i, tr){
        if(count>0){
          parseRow($(this), year, sku);
        }
        
        count++;
      });
}

async function parseRow(html, year, sku){
    var children = $(html).children();
    var currentCustomerTuple = {
      customernumber: children.eq(3).text(),
      customername: children.eq(4).text()
    };
    var day = (1 + (Number(children.eq(2).text()) - 1) * 7)
    let date = new Date(year, 0, day);
    var customer = await database.customerModel.findOne(currentCustomerTuple).exec().catch(err => {
      if(err){
        throw err;
      }
    })
        var sale = {
          "date": date,
          "sku": sku['_id'],
          "customer":  customer['_id'],
          "numcases": children.eq(5).text(),
          "pricepercase": children.eq(6).text().trim()
      };
      var saleExists = await database.saleModel.findOne(sale).exec().catch(err => {
        if(err){
          throw err;
        }
      })
      var foundCustomer = await database.customerModel.findOne(newCustomer).exec().catch(err => {
        if(err){
          throw err;
        }
      })
      if(saleExists == null){
        sales_utils.createSale(sale).catch(err => {
          if(err){
            throw err;
          }
        });
      }

}

async function startScrapeService(){
  
    while(createdSkus.length > 0){
      console.log("new sku!")
      let sku = createdSkus.pop();
      await scrapeSku(sku)
    }
}

async function scrapeCustomers(){
  var customers = await database.customerModel.find({}).exec().catch(err => {
    if (err) {
      throw err;
    }
  });
    let urlToParse = url + '/customers';
    var html = await rp(urlToParse);
    var count = 0;
    $('tr', html).each(async function(i, tr){
      if(count > 0 && count < 10){
         await addCustomer($(this))
      }
      count++;
    })
  }

  async function addCustomer(html){
      var children = $(html).children();
      var customernumber = children.eq(0).text();
      var customername = children.eq(1).text().trim();
      let newCustomer = {
        customernumber: customernumber,
        customername: customername
      }
      var foundCustomer = await database.customerModel.findOne(newCustomer).exec().catch(err => {
        if(err){
          throw err;
        }
      })
      if(foundCustomer == null){
        var createdCustomer = await customer_utils.createCustomer(newCustomer).catch(err => {
          if(err){
            throw err;
          }
        });
      }
  }


module.exports = {
    scrapeAll: scrapeAll,
    scrapeAllFromCurrentYear: scrapeAllFromCurrentYear,
    scrapeSku: scrapeSku,
    createdSkus: createdSkus,
    startScrapeService: startScrapeService
}

