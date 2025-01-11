const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema }= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listings = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

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

router.get("/new", isLoggedIn, wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing});
}));

router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res)=>{
    let newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    res.render("listings/edit.ejs", {listing});
}));


router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}));

router.delete("/:id", isLoggedIn, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;