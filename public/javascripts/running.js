const queryString = window.location.pathname
// const urlParams = new URLSearchParams(queryString);
const exam = queryString.slice(16,40);
const examDuration = parseInt(document.querySelector("#duration").value);
const nextQuestion = document.querySelector('.next-btn');
// console.log(questionId);
const submitButton = document.querySelector(".submit-btn")
//questions coming from Axios request
const question = document.querySelector("#question");
const answerBtns = document.querySelectorAll(".answer");
const questionIdInput = document.querySelector('input[type="hidden"]');
const optionA = document.querySelector("#A");
const optionB = document.querySelector("#B");
const optionC = document.querySelector("#C");
const optionD = document.querySelector("#D");
const labelA = document.querySelector('#labelA');
const labelB = document.querySelector('#labelB');
const labelC = document.querySelector('#labelC');
const labelD = document.querySelector('#labelD');
const questionNum = document.querySelector("#question-num");
const totalQuestionNum = document.querySelector("#total-question-num");


let answers = [];
let questions = [];
let index = 0;
let count = 0;

//Use axios to get the questions candidate is to answer
axios.get("/candidate/getquestion", {
  params: {
    id: exam
  }
}).then((response)=>{
if (response.status >= 400) {
    console.log(response.status);
    throw new Error("Bad response from server");
} else{
    return response.data
}
}).then((data)=>{
  console.log(data)
  for(d of data){
    //push all the questions fetched for the candidate into the questions array
      questions.push(d._id);
  }
  
  //show the question when the route is changed
  if(window.location.pathname.slice(-7)==="running"){
    showQuestion(data, index);

  }

  answerBtns.forEach((answerBtn) => {
    answerBtn.addEventListener("click", (e) => {
      //push candidate's answers into the answers array
        answers.push(e.target.id);
        index++; //increment the index of the questions array
      if (index >= data.length) {
        //when question is exhausted, send the answers to the backend
        sendAnswers(answers, questions, exam);
      } else {
        //if we've still got more questions then show them
        showQuestion(data, index);
      }
    });
  });


})


const showQuestion = (trivia, index) => {
  //show the question and options on thier respective placeholders
  const triviaStr = trivia[index];
  questionNum.textContent = index + 1;
  totalQuestionNum.textContent = trivia.length;

  question.textContent = triviaStr.name;

  optionA.textContent = triviaStr.options.A;

  optionB.textContent = triviaStr.options.B;

  optionC.textContent = triviaStr.options.C;

  optionD.textContent = triviaStr.options.D;
};



//function to send the answers using the fetch API
function sendAnswers(answers, questions, exam){

    fetch("/candidate/exam/results", {
        method: "POST",
        body: JSON.stringify({ answers, questions, exam }),
        headers: { "Content-Type": "application/json" },
      });
      window.location.pathname = '/candidate/thankyou'
}


//this function starts the timer immediately we on the exams page
if(queryString.slice(-7)==="running"){
  // examDuration
    countdown("exam-timer", examDuration , 0);
}



//this function takes care of timing the candidate
function countdown(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time;
  
    function twoDigits(n) {
      return n <= 9 ? "0" + n : n;
    }
  
    function updateTimer() {
      msLeft = endTime - +new Date();
      if (msLeft < 1000) {
        
        document.querySelector('body').style.backgroundColor="red";
        sendAnswers(answers, questions, exam);
        window.location.pathname = '/candidate/thankyou'

      } else {
        time = new Date(msLeft);
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        element.innerHTML =
          (hours ? hours + ":" + twoDigits(mins) : mins) +
          ":" +
          twoDigits(time.getUTCSeconds());
        setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
      }
    }
  
    element = document.getElementById(elementName);
    endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
  }
