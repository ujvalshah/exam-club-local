var express      = require("express");
var router       = express.Router();
var Download     = require("../models/download.js");
var User     = require("../models/user.js");
var multer  = require('multer');
var path = require("path");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin } = middleware;
var storage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null, 'uploads/docs')
        },
    filename: function(req, file, callback) {
    callback(null, Date.now()+'_'+file.originalname);
    console.log(Date.now());
  }
});
var upload = multer({ storage: storage});

var cloudinary = require('cloudinary').v2;
    cloudinary.config({ 
      cloud_name: 'clubstorage', 
      api_key: 416484648518755, 
      api_secret: "IesDyaDBBctXu9yM9OZv3_yNhm4"
    });
    
//----------------------------------------------------------------------------//
//--------------------------Downloads Routes----------------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads", function(req, res){
    Download.find({},(err,foundDownload)=>{
        if(err){
            req.flash("error");
            res.redirect("back");
        } else {
        res.render("downloads/downloads", {downloads: foundDownload});
        } 
    });
    });
    // {downloads: "edit data"}
    
    router.get("/downloads/caintermediate", function(req, res){
        res.render("downloads/bootstraptable");
    });
    
    router.get("/downloads/cafoundation", function(req, res){
        Download.find({}, (err,foundDownload)=>{
            if(err){console.log(err);
            } else {
                var userid = JSON.stringify(req.user.id);
            res.render("downloads/downloads_cafinal1Copy",{userid: userid});
            }
        });
    });
    
    
        router.get("/downloads/ajax", function(req, res){
        res.render("downloads/datatables_ajax", {downloads: "edit data"});
    });
//----------------------------------------------------------------------------//
//----------------------Downloads - Upload - Form-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/upload",isLoggedIn, isTeacherOrAdmin, function(req, res){
        res.render("downloads/upload");
    });


//----------------------------------------------------------------------------//
//------------------------Downloads - POST - Form-----------------------------//
//----------------------------------------------------------------------------//
router.post("/downloads", upload.single('document'), async function(req, res, next){
    req.body.download.file=[];
            let doc = await cloudinary.uploader.upload(req.file.path, 
                {resource_type: "raw",
                 use_filename : "true",
                 unique_filename : "false",
                }, function(error, result){
                    console.log(result,error);
                });
            req.body.download.file.push({
                url: doc.secure_url,
                public_id: doc.public_id
            });
        req.body.download.author.id = req.user._id;
        let download = await Download.create(req.body.download);
        User.findById(req.user._id, function(err, foundUser) {
            if(err){
                req.flash("error");
                res.redirect("/downloads/new");
            } else {
                foundUser.downloads.push(download);
                foundUser.save();
            }
        })
        res.redirect("/downloads");
    });


//----------------------------------------------------------------------------//
//-------------------Downloads - Update Put Route-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/:id/edit", isLoggedIn, isTeacherOrAdmin, function(req, res) {
    Download.findById(req.params.id, function(err, foundDownload){
        if(err){
            req.flash("error", err.message);
            res.redirect("/downloads");
        } else {
            res.render("downloads/updateform", {download:foundDownload});
        }
    });
});

router.put("/downloads/:id", upload.single('document'), function(req, res) {
    Download.findById(req.params.id, async function(err, foundDownload){
        if(err){
            req.flash("error", err.message);
            res.redirect("/downloads");
        } else {
            if(req.file){
                for(let oldFile of foundDownload.file){
                    console.log(oldFile.public_id);
                    await cloudinary.uploader.destroy(oldFile.public_id, function(error, result){
                            console.log(result, error);
                    });
                    let index = foundDownload.file.indexOf(oldFile);
					 foundDownload.file.splice(index, 1);
		      }
                     
				let docUpdated = await cloudinary.uploader.upload(req.file.path,
				{resource_type: "raw",
                 use_filename : "true",
                 unique_filename: "false",
                }, function(error, result){
                    console.log(result,error);
                });
				foundDownload.file.push({
					url: docUpdated.secure_url,
					public_id: docUpdated.public_id
				});
                }
                
            
            foundDownload.author.username = req.user.username;
            foundDownload.title = req.body.download.title;
            foundDownload.description=req.body.download.description;
            foundDownload.topic=req.body.download.topic;
            foundDownload.exam=req.body.download.exam;
            foundDownload.attempt=req.body.download.attempt;
            foundDownload.subject=req.body.download.subject;
            await foundDownload.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/downloads");
        }
    });
});



//----------------------------------------------------------------------------//
//------------------------Downloads - Delete - Form---------------------------//
//----------------------------------------------------------------------------//

router.delete("/downloads/:id", async function(req, res){
await User.findByIdAndUpdate(req.user._id, {$pull:{downloads: req.params.id}});
   let docs = await Download.findById(req.params.id);
    for(let doc of docs.file){
         await cloudinary.uploader.destroy(doc.public_id, function(error, result){
             if (error) {
                 console.log("This Error " + error);
             } else {
                 console.log("This result " + result);
             }
         });
    }
    await docs.remove();
    res.redirect("back");
});




module.exports = router;