const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ DB connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("⚡ Old listings deleted");

  const dataWithOwner = initData.data.map((obj) => {
    let imageObj;

    if (typeof obj.image === "string") {
      // convert string → object
      imageObj = {
        url: obj.image,
        filename: "listingimage"
      };
    } else {
      // already object → keep as is
      imageObj = obj.image;
    }

    return {
      ...obj,
      image: imageObj,
      owner: "68c54f7e642c52219c9acc45" // replace with valid ObjectId
    };
  });

  await Listing.insertMany(dataWithOwner);
  console.log("✅ Data was initialized");
};

initDB();
