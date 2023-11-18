
'use strict';
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var fabcar = require('../car.js');

var server = http.createServer(app).listen(3030, function() {});
console.log('Started')
server.timeout = 240000;

app.get('/getOneCar', function(req, res) {

        console.log("Am in get one car")
        var carid = req.query.id;

        fabcar.getCar(carid.toString().toUpperCase()).then(function(response) {
    
        console.log(response.toString())
        var result = response.toString().slice(4,-4).replace(/\\\":\\\"/g, ' - ').split('\\\",\\\"')
        result.splice(1, 1, "car id - " + carid)
        console.log(result)

        var data = "<ul class=\"list-group\" border=1>";
        for(var i=0; i<result.length; i++) {
            data += "<li class=\"list-group-item\">"+result[i]+"</li>";
        }
        data += "</ul>";

        res.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Car Shop</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
              </head>
              <body style="margin:20px;">

            <h2>Resale Car Shop</h2>
            <p>Welcome to a shop where you can easily purchase and sell your car</p>
            ` + data +`
            </body>
            </html>
            `)
        });
});

app.get('/addCar', function(req, res) {

        console.log("Am in add one car")

        var carid = req.query.id;
        var make = req.query.make;
        var model = req.query.model;
        var color = req.query.color;
        var owner = req.query.owner; 
        console.log(carid, make, model, color, owner)

        fabcar.addCar(carid.toString().toUpperCase(), make, model, color, owner)
});

app.get('/hello', function(req, res) {
        res.json({message: "hello"});
});

app.get('/', function(req, res) {

        res.write(`
<!DOCTYPE html>
<html>
  <head>
    <title>Car Shop</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
  </head>

  <body style="margin:20px;">

    <h2>Resale Car Shop</h2>
    <p>Welcome to a shop where you can easily purchase and sell your car</p>

    <form  action="/getOneCar" method="get">
      Get Car Details:<br>
      <label>Car Id</label>
      <input type="text" name="id"><br>
      <input class="btn btn-primary" type="submit" value="Submit">
    </form> 

    <br><br>
    <form  action="/addCar" method="get">

      Add Your Car:<br>
      <label>Car Id</label>
      <input type="text" name="id"><br>

      <label>Maker</label>
      <input type="text" name="make"><br>

      <label>Model</label>
      <input type="text" name="model"><br>

      <label>Color</label>
      <input type="text" name="color"><br>

      <label>Owner</label>
      <input type="text" name="owner"><br>

      <input class="btn btn-primary" type="submit" value="Submit">
    </form> 

  </body>
</html>`);
});

