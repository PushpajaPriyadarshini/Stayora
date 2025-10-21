# 🏡 Stayora Web Application

**Stayora** is a **property rental platform** where users can browse property listings, authenticate, and review properties. Reviews are analyzed using **sentiment analysis** to classify them as **Good, Bad, or Neutral**. The app also features **interactive maps** for property locations, and future updates include **booking functionality**.

---

## ✨ Features

* 🖥️ User authentication and secure login
* 🏘️ Browse property listings
* 🌟 Review properties with **sentiment analysis** (Good / Bad / Neutral)
* 🗺️ Interactive map feature to view property locations
* 📷 Cloudinary integration for image storage
* ⚡ Full-stack MERN architecture with **EJS** frontend
* 🔜 Future feature: property booking

---

## 📂 Project Files

| Folder/File         | Description                          |
| ------------------- | ------------------------------------ |
| `controllers/`      | Backend logic and controllers        |
| `init/`             | Initialization scripts               |
| `models/`           | MongoDB models/schemas               |
| `public/`           | Static assets (CSS, JS, images)      |
| `routes/`           | Express route definitions            |
| `utils/`            | Utility/helper functions             |
| `views/`            | EJS templates for frontend           |
| `.gitignore`        | Files and folders to ignore in Git   |
| `app.js`            | Main Express server file             |
| `cloudConfig.js`    | Cloudinary config for image storage  |
| `middleware.js`     | Custom middleware functions          |
| `package-lock.json` | Auto-generated NPM package lock file |
| `package.json`      | Project dependencies and scripts     |
| `schema.js`         | Database schemas                     |
| `test.js`           | Test scripts                         |

---

## 🎯 How to Use

1. **Run the application**

```bash
node app.js
```

2. **Open in browser**

```
http://localhost:8080
```

3. **Explore features**

   * Sign up / log in 🔑
   * Browse property listings 🏘️
   * Add reviews with sentiment analysis 🌟
   * View property locations on map 🗺️

---

## 🔍 How It Works

1. Backend uses **Node.js + Express** for routing and API endpoints
2. **MongoDB** (via Mongoose) stores all user and property data
3. **EJS templates** render dynamic frontend content
4. **Sentiment analysis** is used for classifying property reviews
5. **Cloudinary** handles property image uploads and storage
6. Interactive **maps** show property locations on the frontend

---

## ⚠️ Notes

* Ensure MongoDB is running locally or connected via Atlas
* Node.js 16+ recommended
* Requires npm packages installed via `npm install`
* Booking feature is planned for future updates

---

## 👩‍💻 Author

**Pushpaja Priyadarshini**

* GitHub: [https://github.com/PushpajaPriyadarshini](https://github.com/PushpajaPriyadarshini)
