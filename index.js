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
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,  // These options ensure compatibility with the latest MongoDB server versions
      useUnifiedTopology: true,
    });
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
app.use(formidable({
  multiples: true 
}));

app.get("/",(req,res)=>{
  res.end("<h1>CustomCliQ Backend</h1>");
  console.log(__dirname);
})

app.post('/api/v1/data', formidable(),async(req, res) => {
    try {
      // Extracting fields from the form
      const {
        name, profession, companyName, contactNumber, email, whatsApp, location, googlereview
      } =await req.fields;
  
      // Extracting files
      const {
        logo, profilePic,gImg
      } =await req.files;
     
      const user =await new userModel({...req.fields})
      
      // console.log(gImgFiles);
      if(logo){
        user.logo.data = fs.readFileSync(logo.path)
        user.logo.contentType = logo.type
      }if(profilePic){
        user.profilePic.data = fs.readFileSync(profilePic.path);
        user.profilePic.contentType = profilePic.type
      } 

      let gImgArray = [];
      if (gImg) {
        if (Array.isArray(gImg)) {
          gImgArray = gImg; // It's already an array
        } else {
          gImgArray = [gImg]; // It's a single file, so convert it to an array
        }
      }
      if (gImgArray.length > 0) {
        user.gImg = gImgArray.map(img => ({
          data: fs.readFileSync(img.path),
          contentType: img.type
        }));
      }

      await user.save();
      res.json({
        success: true,
        message:"Data Get Successfully",
        user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing your request. formdata!' });
    }
});

app.use("/api/v1",AdminRoute)

// img get route



app.listen(PORT,()=>{
    console.log(`Server is Running on Port No. http://localhost:${PORT}`);
})
