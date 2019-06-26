<!--PAGINATION CODE Page numbers-->
<!--<div class="my-5">-->
<!--    <% if(videos.page-1){%>-->
<!--        <a href="/videos?page=<%=videos.page -1 %>">Prev</a>-->
<!--    <%}%>-->
    
<!--    <% for(let i=1; i<=videos.pages; i++){%>-->
<!--        <a href="/videos?page=<%=i%>" <%= (i===videos.page) ? "style = color:#000" : "" %>-->
<!--        ><%=i%></a>-->
<!--    <%}%>-->
    
<!--    <% if(videos.page+1 <= videos.pages){%>-->
<!--        <a href="/videos?page=<%=videos.page +1 %>">Next</a>-->
<!--    <%}%>-->
    
<!--</div>-->

<span class="glyphicon"><i class="fas fa-file-download"></i></span>
router.route('/')
 .get(helpers.getTodos)
 .post('/', function(req, res){
  db.Todo.create(req.body)
  .then(function(newTodo){
      res.status(201).json(newTodo);
  })
  .catch(function(err){
      res.send(err);
  })
})

exports.getTodos = function(req, res){
    db.Todo.find()
    .then(function(todos){
        res.json(todos);
    })
    .catch(function(err){
        res.send(err);
    })
}


<a href="#"><span class="pr-2"><i class="fas fa-thumbs-up"></i></span></a> 
<a href="#" title="Share"><span class="pr-2"><i class="fas fa-share-alt"></i></span></a>'					


else if(!currentUser){%>
               <form id="save-video-form" class="d-inline float-right" action="#">
                  <button type="submit" class="btn btn-warning btn-sm ml-1 student-alert">Bookmark</button>
              </form>
              <%}%>
              
              
              
               else if(currentUser && currentUser.isStudent && currentUser.videos.includes(video.id)){%>
              <form id="unsave-video-form" class="d-inline float-right" action="#">
                  <button type="submit"  class="btn btn-info btn-sm ml-1">Bookmarked</button>
              </form>
              <%} 
              
              
              
              $(document).ready( function(){

   });
   
   <a href="#"><span class="pr-2"><i class="fas fa-thumbs-up"></i></span></a>
   
   
   //----------------------------------------------------------------------------//
//-------------------------------Forgor Password------------------------------//
//----------------------------------------------------------------------------//
router.get("/forgot-password", (req,res)=>{
    res.render("forgot");
});


router.put("/forgot-password", async (req,res)=>{
    try{
    let {email} = req.body;
    let user = await User.findOne({email: req.body.email});
    // user.resetPasswordToken = null;
    // user.resetPasswordExpires = null;
    let token = await crypto.randomBytes(20).toString('hex');
    if(!user){
        req.flash("error","No account with that email.");
        return res.redirect("/forgot-password");
    } 
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1hr
    await user.save();
    const passForgotMail = {
              to: email,
              from: 'caexamclub@gmail.com',
              subject: 'Exam Club - Forgot Password/Reset',
              text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			  Please click on the following link, or copy and paste it into your browser to complete the process:
			  http://${req.headers.host}/reset/${token}
			  If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			  /g, ''),
            //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
    await sgMail.send(passForgotMail);
    req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect("/forgot-password");
    } catch(err){
        req.flash("error", err.message);
        return res.redirect("/forgot-password");
    }
});


 