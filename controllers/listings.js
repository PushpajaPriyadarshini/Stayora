const Listing = require("../models/list.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
  try {
    const { category } = req.query;
    const selectedCategory = category && category !== "All" ? category : "All";

    const filter = selectedCategory !== "All" ? { category: selectedCategory } : {};
    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", { allListings, selectedCategory });
  } catch (error) {
    console.error("Error fetching listings:", error);
    req.flash("error", "Something went wrong while fetching listings.");
    res.redirect("/");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    req.flash("error", "Unable to load listing details.");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    const location = req.body.listing.location?.trim() || "Default Location";
    let response = await geocodingClient.forwardGeocode({
      query: location,
      limit: 1,
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url: req.file?.path || "/default-image.jpg",
      filename: req.file?.filename || "default",
    };
    newListing.geometry = response.body.features[0]?.geometry || {};
    newListing.category = req.body.listing.category?.trim() || "Trending";

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    next(new ExpressError("Error creating listing", 500));
  }
};

module.exports.editListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const originalImageUrl = listing.image?.url || "/default-image.jpg";
    const thumbnailImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl: thumbnailImageUrl });
  } catch (error) {
    console.error("Error loading edit page:", error);
    req.flash("error", "Unable to load listing for editing.");
    res.redirect("/listings");
  }
};

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    listing.set(req.body.listing);

    if (req.body.listing.location && req.body.listing.location !== listing.location) {
      try {
        let response = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        }).send();
        listing.geometry = response.body.features[0]?.geometry || listing.geometry;
        listing.location = req.body.listing.location;
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    listing.category = req.body.listing.category?.trim() || listing.category;
    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Error updating listing.");
    res.redirect("/listings");
  }
};

module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found.");
    } else {
      req.flash("success", "Listing deleted successfully.");
    }
    
    res.redirect("/listings");
  } catch (error) {
    console.error("Error deleting listing:", error);
    req.flash("error", "Unable to delete listing.");
    res.redirect("/listings");
  }
};
