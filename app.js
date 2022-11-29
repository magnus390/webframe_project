const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/database');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(path.join(__dirname, 'public')));

const HBS = exphbs.create({
    helpers: {
        arraySize: (arrayObject) => {
            return Object.keys(arrayObject).length + 1;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    extname: ".hbs"
});

app.set('view engine', '.hbs');
app.engine('.hbs', HBS.engine);
const dbConString = process.env.CONN_STRING;

// Initializing Connection
db.initializing(dbConString).then((res) => {
    console.log("Database Is Successfully Connected");
}).catch((error) => {
    console.log(error)
})

// get restaurant data based on the page and perpage
app.get('/api/restaurants', async function (req, res) {
    console.log("Hello");
    try {
        let ans = req.query;
        console.log("App file page variable" + ans.page);

        let result = await db.getAllRestaurants(ans.page, ans.perPage, ans.borough);
        console.log(result)
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(401).send("Result Not Found!!");

        }
    }
    catch (error) {
        res.status(401).send(error.message);
    }

});


//Question 3
//add new restaurant
app.get('/api/search', (req, res, next) => {
    res.render('search');
});

//search based on page, perpage and borough
app.post('/api/search', async (req, res, next) => {
    const page = req.body.page;
    const perPage = req.body.perpage;
    const borough = req.body.borough;
    //    console.log(Restaurant);

    let result = await db.getAllRestaurants(page, perPage, borough);
    console.log(result)
    if (result) {
        //res.status(200).send(result);
        console.log("Question 3")
        res.render('display', { data: result }); // return all restaurant in JSON format
    } else {
        res.status(401).send("Result Not Found!!");
    }

    // Restaurant.find({ borough: borough }, function (err, restaurants) {
    //     // if there is an error retrieving, send the error otherwise send data
    //     if (err)
    //         res.send(err)
    //     const starting = (page - 1) * perpage;
    //     const ending = page * perpage;
    //     const result = restaurants.slice(starting, ending);
    //     res.render('display', { data: result, layout: false }); // return all restaurant in JSON format
    // });

});


// Fetch Data Using Get
app.get('/api/restaurants/:_id', async (req, res) => {
    try {
        let id = req.params._id;
        let result = await db.getRestaurantById(id);
        if (!result) {
            throw "Sorry, the id is not found";
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(401).send(err);
    }
});

// Add Data Using Post
app.post('/api/restaurants', async (req, res) => {
    var data = {
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
    }
    let result = await db.addNewRestaurant(data);

    if (result) {
        res.status(200).send("Restaurant Is Added Successfully")
    } else {
        res.status(401).send("Error, Restaurant Is Not Added")
    }
});

// Update Data Using Put
app.put('/api/restaurants/:_id', async (req, res) => {
    let id = req.params._id;
    try {
        var data = {
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
        }

        let result = await db.updateRestaurantById(data, id);
        if (result) {
            res.status(200).send("Restaurant Is Updated Successfully\n\n\n" + result);
            //res.status(200).send(result);
        } else {
            throw "Error Occured";
        }
    }
    catch (err) {
        res.status(401).send("Error, Restaurant Is Not Found");
    }
});

// Delete Data Using Delete
app.delete('/api/restaurants/:_id', async (req, res) => {
    try {
        let id = req.params._id;
        let result = await db.deleteRestaurantById(id);

        if (result.deletedCount) {
            res.status(200).send("Restaurant Is Successfully Deleted")
        } else {
            throw "Error, Restaurant Is Not Found";
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

// App Litening
app.listen(port, () => {
    console.log("App Listening On Port : " + port);
});