const express = require("express");
const asyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isAuthor} = require("../middlewares.js");
const router = express.Router({ mergeParams: true }); 
// 🔑 mergeParams:true allows access to `:id` from parent router

const reviewController = require("../controllers/reviews.js");

// ------------------ Create Review ------------------
router.post(
  "/",
  validateReview,
  isLoggedIn,
  asyncWrap(reviewController.creteReview)
);

// ------------------ Delete Review ------------------
router.delete("/:reviewId",
  isLoggedIn, 
  isAuthor,
  asyncWrap(reviewController.destroyReview));

module.exports = router;
