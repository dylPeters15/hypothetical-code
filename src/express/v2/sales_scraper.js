const rp = require('request-promise');
const url = 'http://hypomeals-sales.colab.duke.edu:8080'; // /?sku=1&year=2010
function scrape(){
    rp(url)
    .then(function(html){
      //success!
      console.log(html);
    })
    .catch(function(err){
      //handle error
    });
}

module.exports = {
    scrape: scrape
}

