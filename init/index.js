const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayfinder";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listings.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "67816e5eef12a2e98c9e94b8"}));
  await Listings.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();