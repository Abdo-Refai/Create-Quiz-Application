let countSpan = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets");
let bullets = document.querySelector(".bullets .spans");
let quezArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");

let currentIndex = 0;
let rightAnswers = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      createBullets(questionsCount);
      addQuestionData(questionsObject[currentIndex], questionsCount);
      submitButton.onclick = () => {
        let rightAnswer = questionsObject[currentIndex]["right-answer"];
        currentIndex++;
        checkAnswer(rightAnswer, questionsCount);
        quezArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);
        handleBullets();
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "html-questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullets = document.createElement("span");
    bullets.appendChild(theBullets);
    if (i === 0) {
      theBullets.className = "on";
    }
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quezArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let theInput = document.createElement("input");
      theInput.type = "radio";
      theInput.name = "questions";
      theInput.id = `answer-${i}`;
      theInput.dataset.answer = obj[`answer-${i}`];
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer-${i}`;
      theLabelText = document.createTextNode(obj[`answer-${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(theInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
      if (i === 1) {
        theInput.checked = true;
      }
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (choosenAnswer === rAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let spansOfArray = Array.from(bulletsSpans);
  spansOfArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quezArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsContainer.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class='good'>Good</span>, The Final Result IS ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class='perfect'>Perfect</span>, The Final Result IS ${rightAnswers} From ${count}`;
    } else {
      theResults = `<span class='bad'>Bad</span>, The Final Result IS ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.margin = "10px auto";
    resultsContainer.style.padding = "10px";
  }
}
