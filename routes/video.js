var express     = require("express");
var router      = express.Router();
var Video       = require("../models/video.js");
var User       = require("../models/user.js");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilter} = middleware;

//----------------------------------------------------------------------------//
//------------------------------Video Routes----------------------------------//
//----------------------------------------------------------------------------//

//----------------------------CA Videos Route----------------------------------//

router.get("/videos", searchAndFilter, function(req, res){
    const{dbQuery} = res.locals;
    delete res.locals.dbQuery;
    // res.locals.query=req.query;  
    function sortFunction(){
        if(req.query.sort==="Earliest"){
            return {createdAt:1};
        } else if(req.query.sort==="Latest"){
            return {createdAt:-1};
        } else if(req.query.sort==="Description-Ascending"){
            return {description:1};
        } else if(req.query.sort==="Description-Descending"){
            return {description:-1};
        } else {
            return {createdAt:-1};
        }
    }
    Video.find(dbQuery, null, {sort: sortFunction()} , function(err, foundVideo){
        if(err){
            res.redirect("back");
        } else {
        if (!foundVideo.length && res.locals.query) {
		res.locals.error = 'No results match that query.';
    	}
        res.render("videos/videos", {videos: foundVideo});
        } 
  });
});

// router.get("/videos", function(req, res) {
// //     console.log(req.query);
// //     res.send(req.query);
// // })
   
//----------------------------------------------------------------------------//
//--------------------Create(New) Route - PAGINATION CODE---------------------//
//----------------------------------------------------------------------------//

//   router.get("/videos", function(req, res){
//       Video.paginate({}, {
//           page: req.query.page || 1,
//           limit: 3,
//       }, function (err, foundVideos){
//           if(err){
//               console.log(err)
//           } else {
//               foundVideos.page=Number(foundVideos.page);
//               res.render("videos/videos", {videos:foundVideos});
//           }
//       });
//   });       



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
router.post("/videos",isLoggedIn, function(req, res){
    console.log(req.user);
    req.body.video.title = req.body.title;
    req.body.video.description = req.body.description;
    var oldUrl = req.body.url;
    req.body.video.url = oldUrl.replace("watch?v=","embed/");
    req.body.video.author = {username: req.user.username,
                                id: req.user._id};            
    
        Video.create(req.body.video, function(err, newlyCreated){
            if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect("/videos");
        } else {
            //redirect back to Video Index page
            User.findById(req.user._id, function(err, foundUser) {
                if (err){
                    console.log(err);
                } else {
                    foundUser.videos.push(newlyCreated);
                    foundUser.save();
                }
            });
            res.redirect("/videos");
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