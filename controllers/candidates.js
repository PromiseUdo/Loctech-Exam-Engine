const Candidate = require('../models/staff');
const Exams = require('../models/exams');
const Questions = require('../models/question');
const Results = require('../models/results');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const random = require('mongoose-simple-random');


let newCandidate = "";



//create the file storage engine using multer
const fileStorageEngine = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, __basedir +'/csv' )
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage:fileStorageEngine
});

const path2 = __basedir +'/csv/data.csv';


module.exports.index = async (req, res)=>{
    const candidates = await Candidate.find({});

};

module.exports.renderNewForm = async(req, res)=>{
    res.render('candidates/new');
};

module.exports.renderDashboard = (req, res)=>{
    res.render('staff/index');
};

module.exports.renderLogin = (req, res)=>{
    res.render('candidates/login');
};

module.exports.login = (req, res)=>{
    req.flash('success', `Hi ${req.user.username}!`);
    const redirectUrl = req.session.redirectTo || '/candidate/index';
    delete req.session.redirectTo;
    res.redirect(redirectUrl);
};

module.exports.renderIndex =  async(req, res)=>{
    const exams = await Exams.find({status:"Published"}).populate("author");
    res.render('candidates/index', {exams});
};

module.exports.renderInstructions = async(req, res)=>{
    const {id} = req.params;

    const exam = await Exams.findById(id).populate("questions");


    res.render('candidates/instructions', {exam});
};


module.exports.getQuestion = async(req, res)=>{
    const id = req.query.id;

    Questions.findRandom({exam:id}, {}, {limit: 3}, function(err, data) {
        if (!err) {
            res.send(data);
        }
      });
}

module.exports.renderExam = async(req, res)=>{

    let matched = false;
    const {id} = req.params;
    const userID = req.user._id;

    const results = await Results.find({exam:id}).populate("candidate");
    const exam = await Exams.findById(id).populate("questions");


    if(results){
        for(let result of results){
            if(result.candidate._id.toString() !== userID.toString()){
                matched = false;
            }else{
                matched = true;
                break;
            }
        }
    }else{
                matched = false;
    }
    
    if(!matched){
        res.render('candidates/running', {exam});
    }else{
        req.flash('error', "Sorry, You cannot take this exam again");
        res.redirect('/candidate/index');
    }
};

module.exports.renderThankYou = async(req, res)=>{
    req.logout();
    req.flash('success', "Goodbye!");
    res.render('candidates/thankyou');

    // res.render('candidates/thankyou');

    // await req.logout();
    // setTimeout(function(){ res.redirect("/staff/logout") }, 1000);

    // res.render('candidates/thankyou');
}

module.exports.axiosData = async(req, res)=>{
    const {answers} = req.body;
    
    // console.log(answers);
};

module.exports.uploadCandidates = upload.single('candidates'), async(req, res)=>{
    // console.log(req.file);
    res.send("CSV file successfull");
try {
    //check if the file exists before saving to DB
    if (fs.existsSync(path2)){
      //file exists
      console.log('File exists');
      fs.createReadStream(__basedir +'/csv/data.csv')
      .pipe(csv({}))
      .on('data', (data)=>results.push(data))
      .on('end',async()=>{
          console.log(results);
        for(let person of results){
            //generate a random password for each candidate
            const password = passwordId => Math.floor(Math.random() * 999999) + 10000;
            //pass along side the data form Excel the password for each candidate
            const newCandidate = new Candidate({...person, password:`LOC${password()}`});
            //save the candidate to the database
            await newCandidate.save();

      }});
    }else{
        console.log("File does not exist");
    }
  } catch(err) {
    console.error(err)
  }
};

module.exports.registerACandidate = async(req, res)=>{
    try{
        const {username, email, course, phone, passcode} = req.body;
        // console.log(username, email, course, phone, passcode);

    }catch(e){
        console.log("Error:", e);
    }
}
