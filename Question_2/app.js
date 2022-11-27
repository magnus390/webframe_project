var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const fs = require('fs')
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

/** Decode Form URL Encoded data */
app.use(express.urlencoded({ extended: true }));
//Loads the public directory using express.static
app.use(express.static(path.join(__dirname, 'public')));

//defines the extension '.hbs'
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
//app.engine('.hbs', HBS.engine);
app.set('view engine', 'hbs');

mongoose.connect(database.url);

//var Employee = require('./models/employee');
var Rest = require('./models/restaurant');


// create book and send back all books after creation
app.post('/api/restaurant', function (req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

    Rest.create({
        address: req.body.address,
        building: req.body.address.building,
        coord: req.body.address.coord,
        street: req.body.address.street,
        zipcode: req.body.address.zipcode,
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: req.body.grades,
        name: req.body.name,
        restaurant_id: req.body.restaurant_id
    }, function (err, rest) {
        if (err)
            res.send(err);

        // get and return all the books after newly created employe record
        Rest.find(function (err, restaurant) {
            if (err)
                res.send(err)
            res.json(restaurant);
        });
    });
});

app.listen(port);
console.log("App listening on port : " + port);
