const express = require('express');const cors = require('cors')

const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

app.listen(8000, () => {
    console.log('Server started!');
  });

  app.route('/api/v1/login/user1').get((req, res) => {
    res.send({
        cats: [{ name: 'lilly' }, { name: 'lucy' }]
      });
});