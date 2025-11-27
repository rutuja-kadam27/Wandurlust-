const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.creteReview   =async (req, res) => {
    const { id } = req.params; // ✅ make sure this exists
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`); // ✅ use id safely here
  };

  module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params; // ✅ destructured together

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};