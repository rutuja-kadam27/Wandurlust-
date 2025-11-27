const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const Listing = require("../models/listing"); // ✅ FIX: Import your model here

const listingController = require("../controllers/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares");
const asyncWrap = require("../utils/asyncWrap");

// -------------------------------------------------------------
// Root route - List all or create new listing
// -------------------------------------------------------------
router
  .route("/")
  .get(asyncWrap(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    asyncWrap(listingController.createListing)
  );

// -------------------------------------------------------------
// New Listing Form
// -------------------------------------------------------------
router.get("/new", isLoggedIn, listingController.renderNewForm);

// -------------------------------------------------------------
// ✅ Search route (must be BEFORE /:id routes!)
// -------------------------------------------------------------
router.get("/search", asyncWrap(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.redirect("/listings");
  }

  const results = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
    ],
  });

  res.render("listings/searchResults.ejs", { results, q });
}));

// -------------------------------------------------------------
// Show, Edit, Update, Delete routes
// -------------------------------------------------------------
router
  .route("/:id")
  .get(asyncWrap(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));

// -------------------------------------------------------------
// Edit Form
// -------------------------------------------------------------
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.editListing));

module.exports = router;
