require('dotenv').config();

const express = require("express");
const app = express();
const bodyParser   = require("body-parser");
const mongoose     = require("mongoose");
const passport     = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy= require("passport-local");
const methodOverride = require("method-override");
const flash = require('connect-flash');


//----------------------------------------------------------------------------//
//----------------------------------Require Models----------------------------//
//----------------------------------------------------------------------------//
const Download = require("./models/download.js");
const Video = require("./models/video.js");
const seedDB = require("./seed.js");
const User = require("./models/user.js");
const Teacher = require("./models/teacher.js");

//----------------------------------------------------------------------------//
//-------------------------------Route Of Application-------------------------//
//----------------------------------------------------------------------------//
const indexRoutes = require("./routes/index.js");
const userRoutes = require("./routes/user.js");
const downloadRoutes = require("./routes/downloads.js");
const videoRoutes = require("./routes/video.js");
const apiRoute = require("./routes/api.js");


mongoose.set('debug', true);
mongoose.connect("mongodb://localhost:27017/examclub", {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(flash());

// seedDB();

//----------------------------------------------------------------------------//
//------------------------------Passport Configuration------------------------//
//----------------------------------------------------------------------------//

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----------------------------------------------------------------------------//
//----------------------------------Local Variables---------------------------//
//----------------------------------------------------------------------------//

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.warning = req.flash("warning");
    next();
});


//----------------------------------------------------------------------------//
//---------------------------------Requiring Routes---------------------------//
//----------------------------------------------------------------------------//
app.use(indexRoutes);
app.use(userRoutes);
app.use(downloadRoutes);
app.use(videoRoutes);
app.use(apiRoute);




//----------------------------------------------------------------------------//
//---------------------------------Server Message-----------------------------//
//----------------------------------------------------------------------------//
app.listen(process.env.PORT, process.env.IP, function (){
   console.log("Exam server is live!");
});