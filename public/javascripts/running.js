const queryString = window.location.pathname
// const urlParams = new URLSearchParams(queryString);
const exam = queryString.slice(16,40);
const examDuration = parseInt(document.querySelector("#duration").value);

// console.log(questionId);

const submitButton = document.querySelector(".submit-btn")

// 
let answers = [];
let questions = [];
// console.log(num);


function sendAnswers(){
    const num = document.querySelectorAll('input[type="radio"]:checked');
    const questionIds = document.querySelectorAll('input[type="hidden"]');


    for(opt of num){
        // console.log(questionId, 'dfdfdfdfdfdfdfdfdfdf');

        let res = opt.value;
        answers.push(res);
        // answers.push(res);
        console.log(answers, 'user answers');
    }

    for(questionId of questionIds){
        let id = questionId.value;
        questions.push(id);
        console.log(questions, 'right ids');

    }


    fetch("/candidate/exam/results", {
        method: "POST",
        body: JSON.stringify({ answers, questions, exam }),
        headers: { "Content-Type": "application/json" },
      });

      window.location.pathname = '/candidate/thankyou'

}

submitButton.addEventListener("click", sendAnswers);



if(queryString.slice(-7)==="running"){

    countdown("exam-timer", examDuration, 0);

}


function countdown(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time;
  
    function twoDigits(n) {
      return n <= 9 ? "0" + n : n;
    }
  
    function updateTimer() {
      msLeft = endTime - +new Date();
      if (msLeft < 1000) {
        
        document.querySelector('body').style.backgroundColor="red";
        sendAnswers();
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
