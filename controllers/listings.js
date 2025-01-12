const Listings = require("../models/listing.js");

module.exports.index = async (req, res)=>{
    let allListings = await Listings.find();
    res.render("listings/index.ejs", {allListings});
};  

module.exports.renderNewForm = async(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id).populate({path : "reviews", populate : {path : "author",},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res)=>{
    let newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}