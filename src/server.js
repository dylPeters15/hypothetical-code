const express = require('express');
const path = require('path');

const app = express();
const ROOT = path.join(path.resolve(__dirname, '../dist'));

app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(express.static(ROOT));

// Server
var server = app.listen(app.get('port'), function(){
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
