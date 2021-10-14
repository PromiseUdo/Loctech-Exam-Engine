const Staff = require('../models/staff');
const Candidate = require('../models/staff');
const Exams = require('../models/exams');
const Questions= require('../models/question');
const Results = require('../models/results');
const validUsername = ["promise.udo", "hubert.nyinah", "dan.martins", "jerry.anubi", "abassyornor.edem", "ebube.ike", "joy.okwu", "hope.israel", "lawson.chibueze", "godbless.alali"];
const validDomainName = ["loctech.ng", "loctechng.com"];


module.exports.renderRegister = (req, res)=>{
    res.render('staff/register');
};

module.exports.renderNewCandidate = (req, res)=>{
    res.render('candidates/new');
};

module.exports.renderNewStaff = async(req, res)=>{

    const admins = await Staff.find({role:"admin"});
    // console.log(candidates);
    res.render('staff/new', {admins});
};

module.exports.register = async (req, res)=>{
    try{
        let {username, email, password, role} = req.body;
        username = username.trim();
        //to check if its a loctech staff before creating a new staff;
        let domainPart = email.slice(email.indexOf('@')+1,);
        let usernamePart = email.slice(0, email.indexOf('@'));

        // if(domainPart !== "loctech.ng"){

        if(validDomainName.includes(domainPart) === false || validUsername.includes(usernamePart) === false){
            req.flash('error', 'Sorry, Please Sign Up with a Valid Loctech Domain Email Address');
            res.redirect('/staff/register');
        }else{
                const staff = new Staff({email, username, role});
                const registeredStaff = await Staff.register(staff, password);
                //login user immediately after registering
                req.login(registeredStaff, err=>{
                    if(err) return next(err);
                    return res.redirect('/staff/dashboard');
                });
        }
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/staff/register')
    }
};


module.exports.registerACandidate = async(req, res)=>{
    try{
        let {username, email, course, phone, password} = req.body;

        username= username.trim();
        // console.log(username, email, course, phone, password);
        const candidate = new Candidate({username, email, course, phone});
        candidate.passcode = password;

        const registeredCandidate = await Candidate.register(candidate, password);
        req.flash('success', `${username} is registered successfully`);

        res.redirect("/staff/dashboard/candidate/new");
    }catch(e){
        // console.log("Error:", e);
    }
};

module.exports.createNewStaff = async(req, res)=>{
    try{
        let {username, email, password, role} = req.body;
        username = username.trim();
        let domainPart = email.slice(email.indexOf('@')+1,);
        let usernamePart = email.slice(0, email.indexOf('@'));

        // if(domainPart !== "loctech.ng"){

        if(validDomainName.includes(domainPart) === false || validUsername.includes(usernamePart) === false){
            req.flash('error', 'Sorry, Please Sign Up with a Valid Loctech Domain Email Address');
            res.redirect('/staff/dashboard/new-staff');
        }else{
                const staff = new Staff({email, username, role});
                const registeredStaff = await Staff.register(staff, password);
                res.redirect("/staff/dashboard/new-staff");
        }
    }catch(e){
        // console.log("Error:", e);
    }
};

module.exports.renderDashboard = async (req, res)=>{
    const candidates = await Candidate.find({role:null});
    const results = await Results.find({});
    const questions = await Questions.find({});
    // console.log(candidates);
    res.render('staff/index', {candidates, results, questions});
};

module.exports.updateCandidate = async(req, res)=>{
    const {username, email, course, phone} = req.body;
    const {id} = req.params;
    const filter = {_id: id};

    const candidate = await Candidate.findByIdAndUpdate(id, {...req.body});
    res.redirect('/staff/dashboard');
};

module.exports.deleteCandidate = async (req, res)=>{
    const{id} = req.params;
    await Candidate.findByIdAndDelete({_id:id});
    // await MealTicket.findByIdAndDelete()

    res.redirect('/staff/dashboard');
};

module.exports.updateStaff = async(req, res)=>{
    const {username, email} = req.body;
    const {id} = req.params;
    const filter = {_id: id};

    // Updating user data with passport
    // Staff.updateOne({_id: req.session.passport.user.id}, {

    Staff.updateOne({_id: id}, {
        email: req.body.email,
        username: req.body.username,
    }, function (err){
        if (err) console.log(err);
        res.redirect("/staff/dashboard/new-staff");
        // res.render("/staff/dashboard/new-staff", {
        // User: req.user
    // });
});


    // const staff = await Staff.findOneAndUpdate({filter, ...req.body});
    req.flash('success', 'Successfully updated Admin');
    // res.redirect('/staff/dashboard/new-staff');
};

module.exports.deleteStaff = async (req, res)=>{
    const{id} = req.params;
    // await MealTicket.findOneAndDelete(id);
    await Staff.findByIdAndDelete(id);
    // await MealTicket.findByIdAndDelete()

    res.redirect('/staff/dashboard/new-staff');
};



module.exports.renderLogin = (req,res)=>{
    res.render('staff/login')
}

module.exports.login = (req,res)=>{
    if(req.user.role !== "admin"){
        req.flash('error', "Sorry you are not authorized to login as staff");
        res.redirect('/candidate/login');
    }else{
        // req.flash('success', `Welcome back ${req.user.username}!`);
        const redirectUrl = req.session.redirectTo || '/staff/dashboard';
        delete req.session.redirectTo;
        res.redirect(redirectUrl);
    }
    
};

module.exports.logout = (req, res)=>{
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/staff/login');
};