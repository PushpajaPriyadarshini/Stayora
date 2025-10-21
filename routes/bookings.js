// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/list');
const { isLoggedIn } = require('../middleware');

// Create a booking for a given listing
// POST /bookings/:listingId
router.post('/:listingId', isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }

  const { checkIn, checkOut, guests } = req.body;
  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24);
  const totalPrice = nights * listing.price;

  const booking = new Booking({
    user: req.user._id,
    listing: listing._id,
    checkIn,
    checkOut,
    guests,
    totalPrice
  });

  await booking.save();
  req.flash('success', 'Booking confirmed!');
  res.redirect(`/listings/${listingId}`);
});

// Booking history for current user
// GET /bookings/history
router.get('/history', isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('listing');
  res.render('bookings/history', { bookings, title: 'My Bookings' });
});

module.exports = router;
