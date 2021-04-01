
const ExpressError = require('./utilities/ExpressError');
const Staff = require('./models/staff');
const Question = require('./models/question');

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log('LoggedInUser', req.user);
    if(!req.isAuthenticated()){
        //store a url to redirect to in the session
        req.session.redirecTo = req.originalUrl;
        req.flash('error', "You must be signed in!"); 
        return res.redirect('/staff/login');
    }
    next();
};

//check if Admin
module.exports.isAdmin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectTo = req.originalUrl;
        req.flash('error', "You must be signed in!"); //flash when there error signing in
        return res.redirect('/login');
    }else if(req.user.role != "admin"){
        req.flash('error', `Sorry ${req.user.username} only admin can have access to this route`);
        const redirectUrl = req.session.redirectTo || '/candidate/index';
        delete req.session.redirectTo;
        return res.redirect(redirectUrl);
    }else{
        next();
    }
}
