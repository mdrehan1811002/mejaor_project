const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
//check user is login or not
module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  // console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    //redirectUrl save
    // ✅ Sirf GET request ke liye redirect URL save karo
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    // req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

//redirect to current path
module.exports.savaRedirect = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//validate owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not the owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validate listing
module.exports.validateListing = async (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//validate review
module.exports.validatereview = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//validate review Author
module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not the owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAlreadyLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/listings"); // ya '/' ya jo bhi home route hai
  }
  next();
};
