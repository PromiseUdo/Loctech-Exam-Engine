const queryString = window.location.pathname;
// const urlParams = new URLSearchParams(queryString);
const exam = queryString.slice(16, 40);
const examDuration = parseInt(document.querySelector("#duration").value);
const nextQuestion = document.querySelector(".next-btn");
// console.log(questionId);
const submitButton = document.querySelector(".submit-btn");
//questions coming from Axios request
const question = document.querySelector("#question");
const answerBtns = document.querySelectorAll(".answer");
const navBtns = document.querySelectorAll(".nav-quest");
const questionIdInput = document.querySelector('input[type="hidden"]');
const optionA = document.querySelector("#optALabel");
const optionB = document.querySelector("#optBLabel");
const optionC = document.querySelector("#optCLabel");
const optionD = document.querySelector("#optDLabel");
const labelA = document.querySelector("#labelA");
const labelB = document.querySelector("#labelB");
const labelC = document.querySelector("#labelC");
const labelD = document.querySelector("#labelD");
const questionNum = document.querySelector("#question-num");
const totalQuestionNum = document.querySelector("#total-question-num");
const examTitle = document.querySelector(".exam-title");
const questionBox = document.querySelector(".question-details");
const r = Math.round(Math.random() * 255 + 1);
const g = Math.round(Math.random() * 255 + 1);
const b = Math.round(Math.random() * 255 + 1);

//change the exam-title border-top color
examTitle.style.borderTopColor = `rgb(${r},${g},${b})`;
questionBox.style.borderColor = `rgb(${r},${g},${b})`;

for (navBtn of navBtns) {
  navBtn.style.backgroundColor = "red";
  navBtn.disabled = true;
}

navBtns[0].disabled = false;

let answers = [];
let questions = [];
let index = 0;
let index2 = 0;
let count = 0;

//Use axios to get the questions candidate is to answer
axios
  .get("/candidate/getquestion", {
    params: {
      id: exam,
    },
  })
  .then((response) => {
    if (response.status >= 400) {
      // console.log(response.status);
      throw new Error("Bad response from server");
    } else {
      return response.data;
    }
  })
  .then((data) => {
    for (d of data) {
      //push all the questions fetched for the candidate into the questions array
      questions.push(d._id);
    }

    //show the question when the route is changed
    if (window.location.pathname.slice(-7) === "running") {
      showQuestion(data, index);
    }

    navBtns.forEach((navBtn) => {
      navBtn.addEventListener("click", (e) => {
        showQuestion(data, e.target.id - 1);
        // console.log(e.target.id);
        index2 = e.target.id - 1;
      });
    });

    navBtns.forEach((navBtn) => {
      navBtn.addEventListener("focus", (e) => {
        navBtn.style.backgroundColor = "orange";
      });
    });

    navBtns.forEach((navBtn) => {
      navBtn.addEventListener("focusout", (e) => {
        navBtn.style.backgroundColor = "green";
      });
    });

    answerBtns.forEach((answerBtn) => {
      answerBtn.addEventListener("click", (e) => {
        //push candidate's answers into the answers array
        // answers.push(e.target.id);

        // console.log(index2);

        answers.splice(index2, 1, e.target.id);
        // console.log(index2, "index 2");
        turnGreen(index2);
        disableNextBtn(index2);
        // console.log(answers);
        // index++; //increment the index of the questions array

        //   // submit button submits
        // if (index >= data.length) {
        //   //when question is exhausted, send the answers to the backend
        //   sendAnswers(answers, questions, exam);
        // } else {
        //   //if we've still got more questions then show them

        //   // showQuestion(data, index);
        // }
      });
    });

    submitButton.addEventListener("click", function () {
      // console.log(answers, "Final anwsers here");
      sendAnswers(answers, questions, exam);
    });
  });

function turnGreen(index) {
  let rightIndex = index + 1;
  let navBtn = document.getElementById(rightIndex);
  // console.log(navBtn);
  navBtn.style.backgroundColor = "green";
}

function disableNextBtn(index) {
  // console.log(index + 1);
  // console.log(navBtns.length);
  if (index + 2 <= navBtns.length) {
    let rightIndex = index + 2;
    let navBtn = document.getElementById(rightIndex);
    navBtn.disabled = false;
  }
}

const showQuestion = (trivia, index) => {
  //show the question and options on thier respective placeholders
  const triviaStr = trivia[index];
  answerBtns.forEach((answerBtn) => {
    answerBtn.checked = false;
    answerBtn.setAttribute("name", triviaStr.name);
    // console.log(answerBtn);
  });

  // console.log(index, "index from show question");
  let triviaOpt = answers[index];

  if (triviaOpt != null) {
    document.getElementById(triviaOpt).checked = true;
  }

  questionNum.textContent = index + 1;
  totalQuestionNum.textContent = trivia.length;

  question.innerHTML = triviaStr.name;

  optionA.textContent = triviaStr.options.A;

  optionB.textContent = triviaStr.options.B;

  optionC.textContent = triviaStr.options.C;

  optionD.textContent = triviaStr.options.D;
};

//function to send the answers using the fetch API
 async function sendAnswers(answers, questions, exam) {
   alert("Processing your request...")
  await fetch("/candidate/exam/results", {
    method: "POST",
    body: JSON.stringify({ answers, questions, exam }),
    headers: { "Content-Type": "application/json" },
  });
  window.location.replace("/candidate/thankyou");
}

//this function starts the timer immediately we on the exams page
if (queryString.slice(-7) === "running") {
  // examDuration
  countdown("exam-timer", examDuration, 0);
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
      document.querySelector("body").style.backgroundColor = "red";
      sendAnswers(answers, questions, exam);
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
