var mongoose = require('mongoose');
var Schema = mongoose.Schema;
RestSchema = new Schema({
    address: [{
        building: String,
        coord: Array,
        street: String,
        zipcode: String
    }],
    borough: String,
    cuisine: String,
    grades: Array,
    name: String,
    restaurant_id: String
});
module.exports = mongoose.model('restaurants', RestSchema);