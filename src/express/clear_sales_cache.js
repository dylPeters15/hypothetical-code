const mongoose = require('mongoose');
const database = require('./database.js');
const scraper = require('./v2/sales_scraper.js')
clearCache().then(() => {    
        mongoose.connection.close();
});

async function clearCache(){
    try{
        var salesCleared = await database.saleModel.deleteMany({}, (err, response) => {
            if(err) {
              throw err;
            }
            if(response){
                console.log("sales cleared!")
            };
          });
          var customersCleared = await database.customerModel.deleteMany({}, (err, response) => {
              if(err) {
                throw err;
              }
              if(response){
                  console.log("customers cleared!")
              };
            });
            if(customersCleared && salesCleared){
                await scraper.scrapeAll();
            }
            
    }
    catch(e){
        console.log("ERROR: " + e)
    }
    
    
  }