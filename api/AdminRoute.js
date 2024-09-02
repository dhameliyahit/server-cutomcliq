const express = require("express");
const UserModel = require("../model/userModel.js")
const router = express.Router();
const NodeCache = require('node-cache');
// get all data api

const nodeCache = new NodeCache();
router.get("/all/data",async(req,res)=>{
    try {
        user = await UserModel.find({}).select("-logo").select("-profilePic").select("-gImg");
        res.status(200).send({
            success:true,
            message:"SuccessFully Get user data",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error white get user All Data",
            error
        })
    }
})

// for logo get api
router.get("/get/logo/:lid",async(req,res)=>{
    try {
        const logo = await UserModel.findById(req.params.lid).select("logo");
        if(logo.logo.data){
            res.set('Content-type',logo.logo.contentType)
            return res.status(200).send(logo.logo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error white get user Logo",
            error
        })
    }
})

// for profile pic api
router.get("/get/profilePic/:pid",async(req,res)=>{
    try {
        const profilePic = await UserModel.findById(req.params.pid).select("profilePic")
        if(profilePic.profilePic.data){
            res.set('Content-type',profilePic.profilePic.contentType)
            return res.status(200).send(profilePic.profilePic.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error white get user Profile Pic",
            error
        })
    }
})

// multiple img fetch api
router.get("/user/:id/images", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId).exec();
  
      if (!user || !user.gImg || user.gImg.length === 0) {
        return res.status(404).send('No images found for this user.');
      }
  
      res.setHeader('Content-Type', 'application/json');
      res.send(user.gImg.map(img => ({
        data: img.data.toString('base64'),
        contentType: img.contentType,
      })));
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching images.');
    }
  });

// delete data api
router.delete("/data/delete/:uid",async(req,res)=>{
    try {
        await UserModel.findByIdAndDelete(req.params.uid);
        res.status(200).send({
            success:true,
            message:"Delete data successfull",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while delete data",
            error
        })
    }
})
module.exports = router