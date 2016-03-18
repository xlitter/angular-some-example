var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');


app.use(morgan('combined'));

app.use(express.static(path.resolve(__dirname, '../')));

app.get('/auth', function(req, rsp){
  rsp.sendStatus(401);
});

app.get('/redirect', function(req, rsp){
  rsp.redirect('http://www.baidu.com');
});

app.listen(9180, function(){
  console.log('server start port: 9180');
});
