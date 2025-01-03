const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

mongoose.connect("mongodb://127.0.0.1:27017/stayfinder");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res)=>{
    res.render("listings/home.ejs");
});

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listings({
//         title : "North Mountains",
//         Description : "The mountains are Awesome",
//         price : 8000,
//         location : "Himalayas",
//         country : "India"
//     });
//     await sampleListing.save();
//     console.log("The sample saved..!");
//     res.send("The sample was saved successfully..!");
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.listen(8080, ()=>{
    console.log("The app is listening..!");
});

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found..!"));
});

app.use((err, req, res, next)=>{
    let {status = 500, message = "Something went wrong..!"} = err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});
