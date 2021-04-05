const Staff = require('../models/staff');
const Candidate = require('../models/staff');
const Exams = require('../models/exams');
const Questions= require('../models/question');
const options = ["Option A", "Option B", "Option C", "Option D"];
const status = ["Draft", "Published"];


module.exports.renderExamIndex = async(req, res)=>{
    const exams = await Exams.find({}).populate('author', 'username' );
    const published = await Exams.find({status:"Published"});
    const drafts = await Exams.find({status:"Draft"});

    res.render('exams/index', {exams, status, pub:published.length, drafts:drafts.length});
};

module.exports.createNewExam = async(req, res)=>{
    try{
        const {name, status} = req.body;
        const exam = new Exams({...req.body});
        exam.author= req.user._id;
        await exam.save();

        res.redirect("/staff/dashboard/exams");
    }catch(e){
        console.log("Error:", e);
    }
};

module.exports.updateExam = async(req, res)=>{
    try {
        const {id} = req.params;
        const exam = await Exams.findByIdAndUpdate(id, {...req.body});
        res.redirect('/staff/dashboard/exams');
    } catch (error) {
        console.log("Error:", e);
    }
};

module.exports.showExamDetails = async (req, res)=>{
    const {id} = req.params;
    const exam = await Exams.findById(id)
    .populate("questions")
    .populate("author");

    res.render("exams/details", {exam, options});
};

module.exports.deleteExam = async (req, res)=>{
    try {
        const {id} = req.params;
        const exam = await Exams.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted Exam');
        res.redirect('/staff/dashboard/exams');

    } catch (error) {
        console.log("Error:", e);
    }
};