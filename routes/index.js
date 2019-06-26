var express      = require("express");
var router       = express.Router();
var passport     = require("passport");
const crypto     = require("crypto");
const util       = require('util');
var User         = require("../models/user.js");
const {sendPasswordResetMail, sendPasswordResetConfirmationMail} = require("../middleware/email.js");
//----------------------------------------------------------------------------//
//--------------------------Index Route Of Application------------------------//
//----------------------------------------------------------------------------//
router.get("/", function(req, res){
    res.render("landing", {page: "home"});
});

//----------------------------------------------------------------------------//
//--------------------------Registration Form Route---------------------------//
//----------------------------------------------------------------------------//

router.get("/register", function(req,res){
    res.render("register", {page:'register'});
})

//----------------------------------------------------------------------------//
//--------------------------Registration[POST] Route--------------------------//
//----------------------------------------------------------------------------//

router.post("/register", function(req,res){
 

    var newUser = new User({
        username : req.body.username,
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        mobile: req.body.user.mobile,
    });
        if(req.body.actype === "isStudent"){
        newUser.isStudent = true;
        } else if(req.body.actype === "isFaculty") {
        newUser.isFaculty = true;   
        } else if(req.body.actype === "isAdmin") {
        newUser.isAdmin = true;   
    }
    
    User.register(newUser, req.body.password, function(err, user){
        if(err){            
            console.log(err);
            req.flash("error", err.message);
            return res.render("register", {page:'register'});
            }
       passport.authenticate("local")(req, res, function(){
       res.redirect("/");       
      });     
  });
 });


//----------------------------------------------------------------------------//
//------------------------------------Login Route-----------------------------//
//----------------------------------------------------------------------------//

router.get("/login", function(req, res) {
    res.render("login", {page:'login'});
})


router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                  failureRedirect: '/login' }));
//----------------------------------------------------------------------------//
//-----------------------------------Logout Route-----------------------------//
//----------------------------------------------------------------------------//

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
})


//----------------------------------------------------------------------------//
//-------------------------------Forgor Password------------------------------//
//----------------------------------------------------------------------------//
router.get("/forgot-password", (req,res)=>{
    res.render("forgot");
});


router.put("/forgot-password", async (req,res)=>{
    try{
    const {email} = req.body;
    const host = req.headers.host;
    const user = await User.findOne({email: req.body.email});
    const token = await crypto.randomBytes(20).toString('hex');
    if(!user){
        req.flash("error","No account with that email.");
        return res.redirect("/forgot-password");
    } 
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1hr
    await user.save();
    await sendPasswordResetMail(email, user.username, host,  token);
    req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect("/forgot-password");
    } catch(err){
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/login");
    }
});


router.get("/reset/:token", async (req,res)=>{
try{    
    const {token} = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()}});
    if(!user){
        req.flash("error", "User does not exist/The link must have expired. Please try again");
        return res.redirect("/forgot-password");
    }
    res.render("reset",{token});
    } catch(err){
        req.flash("err",err.message);
        return res.redirect("/forgot-password");
    }
});


router.put("/reset/:token", async (req,res)=>{
    try{
        const {token} = req.params;
        const user = await User.findOne({
                   resetPasswordToken: token,
                   resetPasswordExpires: {$gt: Date.now()}});
        if(!user){
            req.flash("error", "User does not exist/The link must have expired. Please try again");
            return res.redirect("/forgot-password");
            }
        
        if(req.body.password === req.body.confirm){
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.flash("error", "Password do not match.");
            return res.redirect(`/reset/${token}`);
        }
        await sendPasswordResetConfirmationMail(user.email, user.username);
        req.flash("success", `Password successfully updated`);
        return  res.redirect("/");
    } catch(err){
        console.log(err);
        req.flash("error",err);
        return res.redirect("/login");
    }
});






module.exports = router;