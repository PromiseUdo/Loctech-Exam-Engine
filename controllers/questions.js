const Staff = require('../models/staff');
const Candidate = require('../models/staff');
const Exams = require('../models/exams');
const Questions = require('../models/question');

module.exports.createQuestion = async(req, res)=>{
    const {id} = req.params;
    const exam = await Exams.findById(id);
    const {name, A, B, C, D, correctAnswer} = req.body;
    
    const newQuestion = new Questions({
        name,
        options:{
            A,
            B,
            C,
            D,
        },
        correctAnswer,
        exam:id,
    });
    
    exam.questions.push(newQuestion);
    await newQuestion.save();
    await exam.save();
    
    res.redirect(`/staff/dashboard/exams/${exam._id}`)
};

module.exports.updateQuestion = async(req, res)=>{
    // const {id} = req.params;
    // const exam = await Exams.findById(id);
    const {name, A, B, C, D, correctAnswer, examId, questionId} = req.body;
    const exam = await Exams.findById(examId);

    console.log(examId, questionId);
    const updatedQuestion = await Questions.findByIdAndUpdate(questionId, {
        name,
        options:{
            A,
            B,
            C,
            D,
        },
        correctAnswer
    });
    res.redirect(`/staff/dashboard/exams/${exam._id}`)
};

module.exports.deleteQuestion = async(req, res)=>{
    const {examId, questionId} = req.body;

    const exam = await Exams.findById(examId);

    
    await Exams.findByIdAndUpdate(examId, {$pull:{questions:questionId}});
    await Questions.findByIdAndDelete(questionId);

    res.redirect(`/staff/dashboard/exams/${exam._id}`)
}
