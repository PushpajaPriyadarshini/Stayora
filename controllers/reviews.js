const Review = require("../models/review.js");
const Listing = require("../models/list.js");
const analyzeReview = require("../utils/sentiment.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  // Analyze comment and assign sentiment label
  const result = analyzeReview(newReview.comment, {
    extras: {
      worst: -5,
      horrible: -4,
      disgusting: -4,
      amazing: 5,
      excellent: 4,
      bad: -3,
      terrible: -3,
      awesome: 4,
      good: 3
    }
  });

  if (result.score > 0) {
    newReview.sentiment = "positive";
  } else if (result.score < 0) {
    newReview.sentiment = "negative";
  } else {
    newReview.sentiment = "neutral";
  }

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

// === ADD THIS FUNCTION BELOW ===

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
