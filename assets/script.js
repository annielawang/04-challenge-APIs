////////////////////////// variables /////////////////////////////
const questions = [
    {
      questionText: "Commonly used data types DO NOT include:",
      options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
      answer: 2,
    }
    ,
    {
      questionText: "Arrays in JavaScript can be used to store ______.",
      options: [
        "1. numbers and strings",
        "2. other arrays",
        "3. booleans",
        "4. all of the above",
      ],
      answer: 3,
    },
    {
      questionText:
        "String values must be enclosed within _____ when being assigned to variables.",
      options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
      answer: 2,
    },
    {
      questionText:
        "A very useful tool used during development and debugging for printing content to the debugger is:",
      options: [
        "1. JavaScript",
        "2. terminal/bash",
        "3. for loops",
        "4. console.log",
      ],
      answer: 3,
    },
    {
      questionText:
        "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
      options: ["1. break", "2. stop", "3. halt", "4. exit"],
      answer: 0,
    },
  ];

var currQuestionIndex;
var totalTimeAndScore;

const localStorageKey = "ang_quiz_key";

// find needed html elements
var startQuizBtn = document.getElementById("start_quiz_btn");
var firstPageDiv = document.getElementById("first_page");
var questionPageDiv = document.getElementById("question_page");
var questionTitle = document.getElementById("q_title");
var resultPageDiv = document.getElementById("result_page");
var highScoreDiv = document.getElementById("high_score_page");
var timeLeft = document.getElementById("time_left");
var finalScore = document.getElementById("final_score");
var nameL = document.getElementById("name_txt");
var submitBtn = document.getElementById("name_sbm_btn");
var allRecordsDiv = document.getElementById("all_records");

var timerInterval;

////////////////////////// functions /////////////////////////////
// start quiz
var startQuiz = function() {
    quizTimer();
    currQuestionIndex ++;
    renderAndAddEventsForCurrQuestion();
}

var renderAndAddEventsForCurrQuestion = function() {
    // render questions
    var currQueObj = questions[currQuestionIndex];
    firstPageDiv.setAttribute("hidden", true);
    questionPageDiv.removeAttribute("hidden");
    questionTitle.innerHTML = currQueObj.questionText;

    // render answers and register answers' event clickRight or clickWrong
    for (let i = 0; i < currQueObj.options.length; i++) {
        const tempAnswer = currQueObj.options[i];
        const ansTagId = "q_an_" + i;
        var ansBtnTag = document.getElementById(ansTagId);
        ansBtnTag.innerHTML = tempAnswer;
        if(i == currQueObj.answer) {
            // register clickRight
            ansBtnTag.addEventListener('click', clickRight);
        } else {
            // register clickWrong
            ansBtnTag.addEventListener('click', clickWrong);
        }
    }
}

var clickRight = function() {
  clickCommon();
}

var clickWrong = function() {
  totalTimeAndScore -= 15;
  // Reduce time use quizTimer()
  if(totalTimeAndScore <= 0) {
    totalTimeAndScore = 0;
    timeLeft.textContent = 0;
    redirectResultPage();
  } else {
    timeLeft.textContent = totalTimeAndScore;
    // clickCommon
    clickCommon();
  }
}

// The same thing that happens no matter the answer is right or wrong: next question or show results.
var clickCommon = function() {
  // If this is the last question, render result page and stop render question
  if(currQuestionIndex == questions.length - 1) {
      // redirect to result page
      redirectResultPage();
  } else {
      // next page; current question ++; renderAddQuestion
      currQuestionIndex++;
      renderAndAddEventsForCurrQuestion();
  }
}

// Set a timer using timerInterval method
var quizTimer = function() {
    timerInterval = setInterval(function() {
        totalTimeAndScore--;
        if(totalTimeAndScore <= 0) {
            // cancel timer
            cancelTimer();
            totalTimeAndScore = 0;
            timeLeft.textContent = 0;
            // redirect to result page
            redirectResultPage();
        } else {
          timeLeft.textContent = totalTimeAndScore;
        }
    }, 1000);
}

var cancelTimer = function() {
  if(timerInterval != undefined){
    clearInterval(timerInterval);
  }
}

var redirectResultPage = function() {
    // cancel timer
    cancelTimer();
    resultPageDiv.removeAttribute("hidden");
    questionPageDiv.setAttribute("hidden", true);
    finalScore.innerHTML = totalTimeAndScore;
}

// save record
var saveRecord = function() {
  var currentRecords = localStorage.getItem(localStorageKey);
  if(currentRecords == undefined) {
    localStorage.setItem(localStorageKey, "[]");
    currentRecords = [];
  } else {
    currentRecords = JSON.parse(localStorage.getItem(localStorageKey));
  }

  // record the name and quiz score to LocalStorage
  var myName = nameL.value;
  var resultObj = {
      "name": myName,
      "score": totalTimeAndScore,
  }
  currentRecords.push(resultObj);
  localStorage.setItem(localStorageKey, JSON.stringify(currentRecords));
  viewHighScore();
}

var viewHighScore = function() {
  firstPageDiv.setAttribute("hidden", true);
  questionPageDiv.setAttribute("hidden", true);
  resultPageDiv.setAttribute("hidden", true);
  highScoreDiv.removeAttribute("hidden");
  allRecordsDiv.innerHTML = "";
  // pull all records out of LocalStorage
  var allRecords = JSON.parse(localStorage.getItem(localStorageKey));
  for (let i = 0; i < allRecords.length; i++) {
    var recordLi = document.createElement("li");
    const recordLiContent = allRecords[i].name + ":" + allRecords[i].score;
    recordLi.appendChild(document.createTextNode(recordLiContent));
    allRecordsDiv.appendChild(recordLi);
  }
  // TODO: sort the record and pick the top N result
}

var homePage = function() {
  questionPageDiv.setAttribute("hidden", true);
  highScoreDiv.setAttribute("hidden", true);
  firstPageDiv.removeAttribute("hidden");
  init();
}

var clearHighScore = function() {
  localStorage.clear();
  localStorage.setItem(localStorageKey, "[]");
  viewHighScore();
}

var init = function() {
  currQuestionIndex = -1;
  totalTimeAndScore = 75;
}

// order score by desc

////////////////////////// Main entries: /////////////////////////////
// init
init();
// register startQuiz to start_quiz_btn
startQuizBtn.addEventListener('click', startQuiz);

submitBtn.addEventListener("click", saveRecord);

// TODO:setInterval -> timer