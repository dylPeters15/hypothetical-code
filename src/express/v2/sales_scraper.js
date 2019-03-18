const rp = require('request-promise');
const database = require('../database.js');
const url = 'http://hypomeals-sales.colab.duke.edu:8080'; // /?sku=1&year=2010


async function scrapeAll(){
  var result = await database.skuModel.find({}).exec().catch(err => {
    if (err) {
      throw err;
  }
  });
    for(sku of result) {
      var year = 0;
      for(year = 1999; year <= 2019; year++){
        
          await scrape(sku.skunumber, year);
      }

    }

}


async function scrape(skunumber, year){
  let urlToParse = url + '/?sku=' + skunumber + '&year=' + year;
  console.log("URL: " + urlToParse)
    rp(urlToParse)
    .then(function(html){
      //success!
      console.log(html);
    })
    .catch(function(err){
      //handle error
    });
}

module.exports = {
    scrapeAll: scrapeAll
}

