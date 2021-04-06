const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const User = require('./staff');
const Questions = require('./question');

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Please enter the exam name",
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    questions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    duration:{
      type:Number,
      required: "Please enter the exam duration"
    },
    noOfQuestions:{
      type:Number,
      required: "Please provide number of questions to be answered by candidate"
    }
  },
  {
    timestamps: true,
  }
);

examSchema.virtual("date_created").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

examSchema.post('findOneAndDelete', async function(doc){
  if(doc){
    await Questions.deleteMany({
      _id:{$in:doc.questions}
    })
  }else{

  }
});

// examSchema.set("toObject", { virtuals: true });
// examSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Exam", examSchema);
