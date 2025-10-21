const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/list.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ Get all listings
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// ✅ Render new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ Search listings by title or location
router.get("/search", wrapAsync(async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.redirect("/listings");
    }

    // Search in title or location (case-insensitive)
    let listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ]
    });

    res.render("listings/index", { listings }); // Pass search results to listings page
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
}));

// ✅ Get a single listing
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// ✅ Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// ✅ Get listings by category
router.get("/category/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });
  res.render("listings/index", { listings });
}));

module.exports = router;
