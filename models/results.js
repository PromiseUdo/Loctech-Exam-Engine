const mongoose = require("mongoose");
const {DateTime} = require("luxon");
const Candidate = require('./staff');
const Exam = require('./exams');
const Questions = require('./question');

const resultSchema = new mongoose.Schema({
    score: {
        type: String
    },
    candidate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phone:{
        type:String
    },
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },
    userChoices:{
        type:String
    },
    rightChoices:{
        type:String
    },
    questions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ]
    
},
{
  timestamps: true,
}
);

resultSchema.virtual("date_created").get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
  });

module.exports = mongoose.model("Result", resultSchema);