const mongoose = require('mongoose');
const database = require('./database.js');
const scraper = require('./v2/sales_scraper.js')
clearCache().then(() => {    
    console.log("Done")
});

async function clearCache(){
    try{
        var salesCleared = await database.saleModel.deleteMany({}).exec();
        console.log("sales cleared");
        var customersCleared = await database.customerModel.deleteMany({}).exec();
        console.log("customers cleared.");
        await scraper.scrapeAll();
            
    }
    catch(e){
        console.log("ERROR: " + e)
    }
    
    
  }