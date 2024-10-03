const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
// @ts-ignore
const ejsMate = require("ejs-mate");
mongoose.connect("mongodb://127.0.0.1:27017/stayfinder");
 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res)=>{
    res.render("listings/home.ejs");
});
 
app.get("/testListing", async (req, res)=>{
    let sampleListing = new Listings({
        title : "North Mountains",
        Description : "The mountains are Awesome",
        price : 8000,
        location : "Himalayas",
        country : "India"
    });
    await sampleListing.save();
    console.log("The sample saved..!");
    res.send("The sample was saved successfully..!");
});
 
app.get("/listings", async (req, res)=>{
    let allListings = await Listings.find();
    res.render("listings/index.ejs", {allListings});
});

app.get("/listings/new", async(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.post("/listings", async(req, res)=>{
    let newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
});


app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080, ()=>{
    console.log("The app is listening..!");
});
app.use((req, res)=>{
    res.render("listings/pageNotFound.ejs");
});