var express      = require("express");
var router       = express.Router();
var User         = require("../models/user.js");
var Download = require("../models/download.js");
var Video = require("../models/video.js");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilter} = middleware;
//----------------------------------------------------------------------------//
//    GET =>  /api/users             //
//    POST =>  /api/users            //
//    GET =>  /api/users/:todoId     //
//    PUT =>  /api/users/:todoId     //
//    DELETE =>  /api/users/:todoId  //
//----------------------------------------------------------------------------//

router.get("/api/users", function(req, res){
    User.find().then(function(users){
        res.json(users);
    })
    .catch(function(err){
        res.send(err);
    });
});

router.get("/api/downloads", function(req, res){
    Download.find().then(function(download){
        res.json(download);
    })
    .catch(function(err){
        res.send(err);
    });
});

// Dashboard Show API
router.get("/api/downloads/:id", function(req, res) {
    Download.find().populate()
})

router.get("/api/videos", function(req, res){
    Video.find().then(function(video){
        res.json(video);
    })
    .catch(function(err){
        res.send(err);
    });
});

//----------------------------------------------------------------------------//
//--------------------------------Ajax Video----------------------------------//
//----------------------------------------------------------------------------//

//----------------------------CA Videos Route----------------------------------//
router.get("/test/videos", function(req, res){
    Video.find({}, function(err, foundVideo){
        if(err){
            res.redirect("back");
        } else {
            if(req.xhr){
                res.json(foundVideo);
            } else {
        res.render("api", {videos: foundVideo});
        }
    } 
  });
});


//----------------------------------------------------------------------------//
//----------------------------Create(New) Route-------------------------------//
//----------------------------------------------------------------------------//
router.get("/videos/new", isLoggedIn, function(req, res){
    if(req.user){
        res.render("videos/uploadform");
} else {
    res.redirect("/login");
}
        
});


//----------------------------------------------------------------------------//
//--------------------------------POST Route----------------------------------//
//----------------------------------------------------------------------------//
router.post("/test/videos", function(req, res){
    req.body.video.title = req.body.title;
    req.body.video.description = req.body.description;
    var oldUrl = req.body.url;
    req.body.video.url = oldUrl.replace("watch?v=","embed/");
    
        Video.create(req.body.video, function(err, newlyCreated){
            if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect("/videos");
        } else {
            res.json(newlyCreated);
        }
  });
});

//----------------------------------------------------------------------------//
//------------------------------Edit Route Form-------------------------------//
//----------------------------------------------------------------------------//
router.get("/videos/:id/edit", function(req, res) {
    Video.findById(req.params.id, function(err, foundVideo){
        if(err){
            req.flash("error", err.message);
            res.redirect("/videos");
        } else {
            res.render("videos/updateform", {video: foundVideo});
        }
    })
})

//----------------------------------------------------------------------------//
//--------------------------------Update Route -------------------------------//
//----------------------------------------------------------------------------//

router.put("/videos/:id", function(req, res){
    var oldUrl = req.body.url;
    req.body.video.url = oldUrl.replace("watch?v=","embed/");
    
    Video.findByIdAndUpdate(req.params.id, req.body.video, function(err, updatedVideo){
        if(err){
            req.flash("error");
            res.redirect("back");
        } else {
            res.redirect("/videos");
        }
    })
})

//----------------------------------------------------------------------------//
//--------------------------------Delete Route -------------------------------//
//----------------------------------------------------------------------------//

router.delete("/videos/:id", async function(req, res){
    await User.findByIdAndUpdate(req.user._id, {$pull:{videos: req.params.id}});
    
    await Video.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            req.flash("success", "Video has been successfully deleted!");
            return res.redirect("back");
        } else {
            return res.redirect("back")            
        }
    })
})

module.exports = router;

module.exports = router;