const Candidate = require("../models/staff");
const Exams = require("../models/exams");
const Questions = require("../models/question");
const Result = require("../models/results");

module.exports.getResponses = async (req, res) => {
  const candidate = req.user._id;
  const { answers, questions, exam } = req.body;
  const countOfQuestions = questions.length;
  let score = 0;
  let rightOptions = [];
  try {
    const candidatePhone = await Candidate.findById(candidate).select("phone");
    const currCandidate = await Candidate.findById(candidate);


    const examNameQuery = await Exams.findById({ _id: exam });
    // .populate("questions");

    for (question of questions) {
      const rightOption = await Questions.findById(question).select(
        "correctAnswer"
      );
      const letter = rightOption.correctAnswer;
      rightOptions.push(letter);
    }

    //function to count the number of matching options
    // function compare(arr1, arr2) {
    //   let count = 0;
    //   const max = arr1.length > arr2.length ? arr2.length : arr1.length;
    //   for (var i = 0; i < max; i++) {
    //     if (arr1[i] == arr2[i]) {
    //       count++;
    //     }
    //   }
    //   return count;
    // }

    const countOfMatchedAnswers = compare(answers, rightOptions);

    //compare the users answers with the right options to get the count of correct answers
    // const countOfMatchedAnswers = compare(answers, rightOptions);

    //calculate the students score
    score = Math.round((countOfMatchedAnswers / countOfQuestions) * 100) + "%";

    //convert users answers from array to a string to be saved to database
    // const userChoices = answers.toString();
    // const rightChoices = rightOptions.toString();


    //create the result
    // await createResult(score, currCandidate, candidate, candidatePhone.phone, exam, userChoices, rightChoices, questions);

    await createResult(score, currCandidate, candidate, candidatePhone.phone, exam);

    
    // //save the result
    //  const newScore = await Result.create({
    //   score,
    //   candidate,
    //   phone: candidatePhone.phone,
    //   exam,
    //   userChoices,
    //   rightChoices,
    //   questions,
    // });

    //send email to admin when students perform poorly on their exams
    //exclude scholarship exams to avoid spamming
  } catch (e) {
    // console.log(e);
  }
};

//count the number of matching options
const compare = (arr1, arr2) => {
  let count = 0;
      const max = arr1.length > arr2.length ? arr2.length : arr1.length;
      for (var i = 0; i < max; i++) {
        if (arr1[i] == arr2[i]) {
          count++;
        }
      }
      return count;
};


async function createResult(score, currCandidate, candidate, phone, exam) {
  const newScore = new Result({
    score,
    candidate,
    phone,
    exam
  });


  currCandidate.results.push(newScore);

  await newScore.save();
  await currCandidate.save();

}

//function to create new exam result

// const createResult = async (score, candidate, phone, exam, userChoices, rightChoices, questions) =>{

//   try {
//     const newScore = await Result.create({
//       score,
//       candidate,
//       phone,
//       exam,
//       userChoices,
//       rightChoices,
//       questions,
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   // const newScore = await Result.create({
//   //   score,
//   //   candidate,
//   //   phone: candidatePhone.phone,
//   //   exam,
//   //   userChoices,
//   //   rightChoices,
//   //   questions,
//   // });

// }

//ends here.

module.exports.renderResultIndex = async (req, res) => {
  const results = await Result.find().populate("candidate").populate("exam");



  res.render("results/index", { results });
};

module.exports.renderResultDetail = async (req, res) => {
  const { resultId } = req.params;

  const theResult = await Result.findById(resultId)
    .populate("candidate")
    .populate("exam")
    .populate("questions");

  let userChoicearr = theResult.userChoices.split(",");
  let rightChoicearr = theResult.rightChoices.split(",");

  res.render("results/detail", {
    result: theResult,
    userChoicearr,
    rightChoicearr,
  });
};
