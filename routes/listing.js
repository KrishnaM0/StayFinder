const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema }= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listings = require("../models/listing.js");

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

router.get("/", wrapAsync(async (req, res)=>{
    let allListings = await Listings.find();
    res.render("listings/index.ejs", {allListings});
}));

router.get("/new", wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

router.post("/", validateListing, wrapAsync(async(req, res)=>{
    let newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

router.get("/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


router.put("/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;