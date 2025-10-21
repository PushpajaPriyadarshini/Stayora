
const mongoose = require("mongoose");
const initData = require("./data.js");
const axios = require("axios"); // Import axios for API requests
require("dotenv").config({ path: "../.env" });
// Use environment variables for API keys

const Listing = require("C:\\Users\\pushp\\Apnacollege1\\Majorproject\\models\\list.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const categories = ["Trending", "Rooms", "Mountains", "Castles", "Beaches","Pools","Camping","Villas","Farms","Lakes"];
const MAPBOX_API_KEY = process.env.MAP_TOKEN; // Get API key from .env
console.log("MAPBOX_API_KEY:", process.env.MAP_TOKEN);

// Check if the API key is loaded correctly
if (!MAPBOX_API_KEY) {
  console.error("Error: MAPBOX_API_KEY is missing in .env file!");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to database");
}

main().catch((err) => console.log("DB Connection Error:", err));

// Function to fetch coordinates from Mapbox API
const getCoordinates = async (location) => {
  try {
    console.log(`Fetching coordinates for: ${location}`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_API_KEY}`;
    
    const response = await axios.get(url);
    const data = response.data;

    if (data.features.length > 0) {
      console.log(`Coordinates for ${location}:`, data.features[0].geometry.coordinates);
      return data.features[0].geometry.coordinates; // [longitude, latitude]
    } else {
      console.warn(`No coordinates found for "${location}", using default [0,0]`);
      return [0, 0]; // Default coordinates if location is invalid
    }
  } catch (error) {
    console.error(`Error fetching coordinates for "${location}":`, error.message);
    return [0, 0]; // Default coordinates if API call fails
  }
};

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Deleted old listings");

  for (let obj of initData.data) {
    if (!obj.location || obj.location.trim() === "") {
      console.warn(`Skipping listing due to missing location:`, obj);
      continue;
    }

    const coordinates = await getCoordinates(obj.location); // Fetch coordinates from API

    const newListing = new Listing({
      ...obj,
      owner: "67d6e9f9504cb2b2a746a8ca",
      category: categories[Math.floor(Math.random() * categories.length)], // Random category
      geometry: {
        type: "Point",
        coordinates: coordinates, // Use fetched coordinates
      },
    });

    await newListing.save();
    console.log(`Saved listing: ${obj.title}`);
  }

  console.log("Database initialized successfully!");
  mongoose.connection.close();
};

initDB();
