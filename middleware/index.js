//Nax Section 5-25//

var Download = require("../models/download.js");
var Video = require("../models/video.js");
var User = require("../models/user.js");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  },
    isFaculty: function(req, res, next) {
    if(req.user.isFaculty) {
      next();
    } else {
      req.flash('error', 'You need to be signed in as a teacher!');
      res.redirect('back');
    }
  },
    isStudent: function(req, res, next) {
    if(req.user.isStudent) {
      next();
    } else {
      req.flash('error', 'You need to be signed in as a student!');
      res.redirect('back');
    }
  },
  
    isTeacherOrAdmin: function(req, res, next) {
    if(req.user.isFaculty === true || req.user.isAdmin === true) {
      next();
    } else {
      req.flash('error', 'You should be a teacher or an admin to access this feature!');
      res.redirect('back');
    }
  },
  
  async searchAndFilter(req,res,next) {
      
  // pull keys from req.query (if there are any) and assign them 
	// to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      
      
  // check if queryKeys array has any values in it
	// if true then we know that req.query has properties
	// which means the user => submitted the search/filter form
      if(queryKeys.length){
	  	  const dbQueries = [];
	  	  
	  	  let { search, exam, attempt, subject } = req.query;
        
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {exam: search},
            {attempt: search},
            {subject: search},
            {title: search},
            {description: search},
            {topic: search},
            {author: search},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        console.log(!exam.includes("All"));
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(subject && !subject.includes("All") && !subject.includes("rf")){
        dbQueries.push({subject: {$in: subject}});
      }  else if (subject && subject.includes("All") && !subject.includes("rf")){
         subject = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({subject:{$in:subject}});
      } else if (subject && subject.includes("rf") && dbQueries.indexOf({subject:{$in:subject}}) !== -1){
        console.log(subject);
        console.log(dbQueries.indexOf({subject:{$in:subject}}));
         dbQueries.splice(dbQueries.indexOf({subject:{$in:subject}}),1);
      }
      
      if(attempt && !attempt.includes("All") && !attempt.includes("rf")){
        dbQueries.push({attempt:{$in: attempt}});
      } else if (attempt && attempt.includes("All") && !attempt.includes("rf")){
        attempt = ["Nov 2019", "May 2020", "Nov 2020", "May 2021", "Nov 2021"];
         dbQueries.push({attempt:{$in:attempt}});
      } else if (attempt && attempt.includes("rf") && dbQueries.indexOf({attempt:{$in:attempt}}) !== -1){
        dbQueries.splice(dbQueries.indexOf({attempt:{$in:attempt}}),1);
      }
        
      res.locals.dbQuery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.query = req.query;
      res.locals.filterUrl = req.originalUrl;
      next();
    }
};




  // checkUserCampground: function(req, res, next){
  //   User.findById(req.params.id, function(err, foundCampground){
  //     if(err || !foundCampground){
  //         console.log(err);
  //         req.flash('error', 'Sorry, that campground does not exist!');
  //         res.redirect('/campgrounds');
  //     } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
  //         req.campground = foundCampground;
  //         next();
  //     } else {
  //         req.flash('error', 'You don\'t have permission to do that!');
  //         res.redirect('/campgrounds/' + req.params.id);
  //     }
  //   });
  // },
  
  