const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    Description : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        default : "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        set: (v) => v==="" ? "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2": v,
    },
    price : {
        type : Number,
        required : true,
    },
    location:{
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    }
});

const Listings = mongoose.model("Listings", listingSchema);

module.exports = Listings;