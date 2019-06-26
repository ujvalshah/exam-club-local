const express      = require("express");
const router       = express.Router();

   

const Download     = require("../models/download.js");
const Video     = require("../models/video.js");
const User     = require("../models/user.js");
const middleware = require("../middleware");
const { isLoggedIn, isAdmin, isFaculty, isStudent } = middleware;
// const multer  = require('multer');
// const storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// const upload = multer({ storage: storage});

// const cloudinary = require('cloudinary').v2;
//     cloudinary.config({ 
//       cloud_name: 'clubstorage', 
//       api_key: process.env.CLOUDINARY_API_KEY, 
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     });


//----------------------------------------------------------------------------//
//--------------------------Teacher's Index Route-----------------------------//
//----------------------------------------------------------------------------//
router.get("/teachers", (req, res)=>{
    User.find({isFaculty: true}, function(err, foundTeacher){
        if(err){
          return console.log(err);
        }
        res.render("teacher/list", {teachers: foundTeacher, page:'teachersindex'});
        
    });
})

//----------------------------------------------------------------------------//
//----------------------Teacher's Profile CREATE Form(GET)--------------------//
//----------------------------------------------------------------------------//
router.get("/teachers/new", function(req, res){
        res.render("teacher/new");
    });

//----------------------------------------------------------------------------//
//--------------------------Teacher's Profile Route(POST)----------------------//
//----------------------------------------------------------------------------//
router.post("/teachers", (req, res)=>{
    var newTeacher = req.body.teacher;
    User.create(newTeacher, function(err, newlyCreated){
        if(err){
            console.log(err)
            return res.redirect("back");
        }
        res.redirect("/teachers/" + newlyCreated.id)
    })
})


//----------------------------------------------------------------------------//
//-----------------------Teacher's Profile SHOW Route(GET)--------------------//
//----------------------------------------------------------------------------//
router.get("/teachers/:id", (req, res) => {
    User.findById(req.params.id, function(err, foundTeacher){
        if(err){
         console.log(err);
         res.redirect("back");
        } else 
        res.render("teacher/profile", {teacher: foundTeacher});
    });
})


//----------------------------------------------------------------------------//
//--------------------------------USERS GET Dashboard-------------------------//
//----------------------------------------------------------------------------//

// ------------------------>Different Method[Populate]!!!<----------------------
router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
    User.findById(req.params.id, async (err,foundUser)=>{
        if(err){
            console.log(err);
        } else { 
            if(foundUser.isAdmin===true){
              let downloads = await Download.find({}).exec();
              let videos = await Video.find({}).exec();
              if(req.xhr){
                  res.json({user:foundUser, downloads:downloads, videos:videos});
              } else {
              res.render("dashboard_admin",{user:foundUser, downloads: downloads, videos: videos});
                  }
              }
            
            if(foundUser.isFaculty===true){
               await  User.findById(req.params.id).populate("downloads").populate("videos").exec((err,foundUser)=>{
                if(err){
                console.log(err);
                } else {
                 if(req.xhr){
                  res.json({user:foundUser});
                }else {
                res.render("dashboard_faculty",{user:foundUser});
              }    
                }
            });
        } 
        if(foundUser.isStudent===true){
               await  User.findById(req.params.id).populate("downloadBookmarks").populate("videoBookmarks").exec((err,foundUser)=>{
                if(err){
                console.log(err);
                } else {
                 if(req.xhr){
                  res.json({user:foundUser});
                }else {
                res.render("dashboard_student",{user:foundUser});
              }    
                }
            });
        } 
    }
});
});

// router.get("/user/:id/dashboard", isLoggedIn, (req, res) => {
//     const currentUser = req.user;
//             if(currentUser && currentUser.isAdmin){
//             res.json("dashboard_admin");               
//             } else if(currentUser && currentUser.isFaculty){
//              res.render("dashboard_faculty");  
//             }else if(currentUser && currentUser.isStudent){
//              res.render("dashboard_student", {page: "dashboard"});  
// }
// });

// -------------------------->Different Method[ID = ID]!!!<---------------------------------
// router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
//     User.findById(req.params.id, (err,foundUser)=>{
//         if(err){
//             console.log(err);
//         } else { 
//         Video.find().where("author.id").equals(foundUser.id).exec((err, videos)=>{
//                         if(err){
//                             req.flash("error",err.message);
//                         } else{
//                             res.render("dashboard_faculty",{videos, user:foundUser});
//                         }
//                     });
//         }
//     });
// });

// // -------------------------->Different Method[Populate]!!!<---------------------------------
// router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
//     User.findById(req.params.id).populate("downloads").populate("videos").exec((err,foundUser)=>{
//         if(err){
//             console.log(err);
//         } else { 
//             if(foundUser.isAdmin===true){}
//         res.render("dashboard_faculty",{user:foundUser});
//         }
//     });
// });



// router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
//     User.findById(req.params.id, (err,foundUser)=>{
//         if(err){
//             console.log(err);
//         } else if (foundUser.isAdmin === true){
//             Video.find({}, (err,videos)=>{
//                 if(err){
//                     console.log(err);
//                 } else {
//                     res.render("dashboard_admin", {videos});
//                 }
//             });
//         } else if (foundUser.isFaculty === true){
//                     Video.find().where("author.id").equals(foundUser.Id).exec((err, videos)=>{
//                         if(err){
//                             req.flash("error",err.message);
//                         } else{
//                             res.render("dashboard_faculty",{videos});
//                         }
//                     });
//         } else if(foundUser.isStudent === true){
//             res.render("dashboard_faculty")
//         } 
//     });
// });



//----------------------------------------------------------------------------//
//-----------------------------------User Save Video--------------------------//
//---------------------{is the writing format fine??}-------------------------//

router.put("/user/:id/videos/:video_id", isStudent, async (req,res)=>{
try{
    let foundUser= await User.findById(req.params.id);
    let foundVideo= await Video.findById(req.params.video_id);
        if(foundUser.isStudent){
            if(foundUser.videoBookmarks.includes(foundVideo.id)){
                console.log("includes");
                await User.findByIdAndUpdate(req.user._id, {$pull:{videoBookmarks: foundVideo.id}}); 
                foundUser.save();
                req.flash("success", "Successfully removed the video from your bookmarks");
                return res.redirect("back");
            } else {
            console.log("does not include");
            foundUser.videoBookmarks.push(foundVideo);
            foundUser.save();
            req.flash("success", "Successfully added the video to your bookmarks");
            return res.redirect("back");
        }} else {
            req.flash("error", "You need to be signed to bookmark videos");
        }
}catch(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
});



//----------------------------------------------------------------------------//
//------------------------------User Save Document----------------------------//
//----------------------------------------------------------------------------//
router.put("/user/:id/downloads/:video_id", isStudent, async (req,res)=>{
    try{
        let foundUser= await User.findById(req.params.id);
        let foundVideo= await Video.findById(req.params.video_id);
            if(foundUser.isStudent){
                if(foundUser.videoBookmarks.includes(foundVideo.id)){
                    console.log("includes");
                    await User.findByIdAndUpdate(req.user._id, {$pull:{videoBookmarks: foundVideo.id}}); 
                    foundUser.save();
                    req.flash("success", "Successfully removed the video from your bookmarks");
                    return res.redirect("back");
                } else {
                console.log("does not include");
                foundUser.videoBookmarks.push(foundVideo);
                foundUser.save();
                req.flash("success", "Successfully added the video to your bookmarks");
                return res.redirect("back");
            }} else {
                req.flash("error", "You need to be signed to bookmark videos");
            }
        }catch(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
    });





module.exports = router;