const express = require("express");
require("dotenv").config();
const cors = require("cors");
const formidable = require('express-formidable');
const fs = require('fs');
const AdminRoute = require("./api/AdminRoute.js");
const userModel = require("./model/userModel.js");
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL || "mongodb+srv://heetdhameliya59:j8CIa4UJdn1FuvuY@customcliq.dcyckl3.mongodb.net/customcliq";
const PORT = process.env.PORT || 9000;
const app = express();
// db connect
const connectDB = async (DB_URL) => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");
    console.log(DB_URL+"Success");
  } catch (error) {
    console.error("Error while connecting to the database:", error.message);
    process.exit(1);  // Exit the process with a failure code
    console.log(DB_URL+"error");
  }
};

connectDB(DB_URL);

// end of DB conect ....

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
  res.end("<h1>CustomCliQ Backend Api's</h1>");
  console.log(__dirname);
})

app.use(formidable({
  maxFileSize: 10 * 1024 * 1024, // 10 MB limit for file uploads
  multiples: true, // Allow multiple files
}));

app.post('/api/v1/data', async (req, res) => {
  try {
      const {
          name, profession, companyName, contactNumber, email, whatsApp, location, googlereview
      } = req.fields;

      const {
          logo, profilePic, gImg
      } = req.files;

      const user = new userModel({ ...req.fields });

      // Process logo file
      if (logo) {
          const logoStream = fs.createReadStream(logo.path);
          const logoChunks = [];
          for await (const chunk of logoStream) {
              logoChunks.push(chunk);
          }
          user.logo.data = Buffer.concat(logoChunks);
          user.logo.contentType = logo.type;
      }

      // Process profilePic file
      if (profilePic) {
          const profilePicStream = fs.createReadStream(profilePic.path);
          const profilePicChunks = [];
          for await (const chunk of profilePicStream) {
              profilePicChunks.push(chunk);
          }
          user.profilePic.data = Buffer.concat(profilePicChunks);
          user.profilePic.contentType = profilePic.type;
      }

      // Process gImg files
      let gImgArray = [];
      if (gImg) {
          gImgArray = Array.isArray(gImg) ? gImg : [gImg]; // Ensure it's an array
      }

      if (gImgArray.length > 0) {
          user.gImg = await Promise.all(gImgArray.map(async img => {
              const imgStream = fs.createReadStream(img.path);
              const imgChunks = [];
              for await (const chunk of imgStream) {
                  imgChunks.push(chunk);
              }
              return {
                  data: Buffer.concat(imgChunks),
                  contentType: img.type
              };
          }));
      }

      // Save user data to the database
      await user.save();

      res.json({
          success: true,
          message: "Data Get Successfully",
          user
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing your request.' });
  }
});

app.use("/api/v1",AdminRoute)

// img get route



app.listen(PORT,()=>{
    console.log(`Server is Running on Port No. http://localhost:${PORT}`);
})
