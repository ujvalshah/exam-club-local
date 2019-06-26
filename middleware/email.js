const sgMail       = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);   
      
      
  const sendPasswordResetMail = (email, name, host,token) => {
      sgMail.send({
      to: email,
      from: 'Admin <caexamclub@gmail.com>',
      subject: 'Exam Club - Forgot Password/Reset',
      text: `Hi ${name}! You are receiving this because you (or someone else) has requested for the reset of your account password.
	    Please click on the following link, or copy and paste it into your browser to complete the process:
	    http://${host}/reset/${token}. If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/	    /g, ''),
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })};
      
    const sendPasswordResetConfirmationMail = (email, name) => {
    sgMail.send({
    to: email,
    from: 'Admin <caexamclub@gmail.com>',
    subject: 'Exam Club - Succesful Password Reset',
    text: `Hi ${name}! Your password has been succesfully reset.`
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })};
    
    
  
    module.exports = {
      sendPasswordResetMail,
      sendPasswordResetConfirmationMail,
    }