var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var websiteapi = require("./API/websiteapi.js");
var path =require('path');

app.use('/assets',express.static('assets'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var swaggerUi = require('swagger-ui-express'); 
swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", websiteapi);

var routes = require('./API/apis');
app.use('/v1',routes);


app.listen(3000);
