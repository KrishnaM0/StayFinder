if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
};
const mongoose = require("mongoose");
const initData = require("./init/data.js");
const Listings = require("./models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl);

const initDB = async () => {
  await Listings.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "6789542586ee720ff4be1f3e"}));
  await Listings.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();