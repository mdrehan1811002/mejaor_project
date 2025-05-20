const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ Needed to access :id
// const { reviewSchema } = require("../schema.js");
// const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Listing = require("../models/listing.js");
const {
  validatereview,
  isLoggedIn,
  isAuthor,
} = require("../utils/middleware.js");
const reviewController = require("../controllers/reviews.js");

// Reviews route
router.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(reviewController.createReview)
);

// delete review rout
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
