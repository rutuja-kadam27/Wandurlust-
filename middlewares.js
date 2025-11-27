const Listing = require("./models/listing");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next) =>
{
    
     if(!req.isAuthenticated())
  {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req,res,next) =>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req,res,next) =>
{
  let { id } = req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id))
  {
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    // Optional: make a readable message
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};
module.exports.isAuthor = async(req,res,next) =>
{
  let { id,reviewId } = req.params;
  let review =await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id))
  {
    req.flash("error","You are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};  