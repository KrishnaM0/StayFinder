const mongoose = require("mongoose");
const Review = require("./review.js");

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
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews }});
    }
});

const Listings = mongoose.model("Listings", listingSchema);

module.exports = Listings;