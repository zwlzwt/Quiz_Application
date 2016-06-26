var scoreRange = require('./configData').scoreRange;
var quizData = require('./configData').quizData;
var currentQuestion = 0;
var score = 0;
var submitBtn = document.getElementsByClassName('submit')[0];
var askQuestion = true;
var answerArea = document.getElementsByClassName('answerArea')[0];
// var quizData;
// fetch('/hunter/exam.json',{
//     credentials: 'include',
//     headers:{ "Content-Type": "application/json"}
// }).
// then(function(response) {
//   return response.json();
// }).then(function(data) {
//   return quizData = data;
//   console.log(quizData);
// });
// 开始页面
function startPage() {
    answerArea.insertAdjacentHTML('afterend','<button type="button" class="start">现在开始</button>');
    submitBtn.style.display = 'none';
    changeHTML('.quizName', quizData.info.name);
    changeHTML('.quizTitle', quizData.info.main);
    changeHTML('.answerArea',quizData.info.results);
    document.getElementsByClassName('start')[0].addEventListener('click', loadAskAnswers,false);
}
// 改变元素状态和位置
function changElement(node , classname){
    var elements = document.querySelectorAll(node);
    Array.prototype.forEach.call(elements, function(el, i){
        el.classList ? el.classList.add(classname) : el.className += ' ' + classname;
    });
};
function changeHTML(selecter, data){
    var node = document.querySelectorAll(selecter)[0];
    node.innerHTML = data;
};
function loadAskAnswers(){
    var choices = quizData.questions[currentQuestion].a;
    var choicesLength = choices.length;
    var choicesHtml = '';
    document.getElementsByClassName('start')[0].style.display = 'none';
    submitBtn.style.display = 'block';
    for (var i = 0; i < choicesLength; i++) {
        choicesHtml += " <label class='' for='choice" + (i + 1) + "'>" + choices[i].option + "<input type='radio' name='quiz" + currentQuestion +
        "' id='choice" + (i + 1) +
        "' value='" + choices[i].correct + "'>"  +  "<i></i>" + "</label><br>";
    }
    submitBtn.addEventListener('click',checkAnswers,false);
    changeHTML('.quizName',(currentQuestion+1)+'/'+ quizData .questions.length);
    changeHTML('.quizTitle',quizData.questions[currentQuestion].q);
    changeHTML('.answerArea',choicesHtml);
    if (currentQuestion === 0) {
        submitBtn.textContent = quizData.submitContent;
    }
};

function checkAnswers(){
    if (askQuestion) {
        submitBtn.textContent = quizData.nextSubmitContent;
        askQuestion = false;
        // 找用户选择了哪个radio
        var userpick;
        var userpickCurrent;
        var correctIndex;
        var currentLabel;
        var radios = document.getElementsByName('quiz' + currentQuestion);
        var radiosLength = radios.length;
        for (var i = 0; i < radiosLength; i++) {
            if (radios[i].checked) {
                userpick = radios[i].value;
                userpickCurrent = radios[i];
                currentLabel = document.getElementsByTagName('label')[i].style;
            }
            if (radios[i].value == 'true') {
                correctIndex = i;
            }
        }
        var labelCurrent = document.getElementsByTagName('label')[correctIndex];
        var labelStyle = document.getElementsByTagName('label')[correctIndex].style;
        if (userpick === 'true'){
            score++;
            var elRight = document.createElement('span');
            labelCurrent.appendChild(elRight);
            elRight.className = 'right';
            labelStyle.color = '#EC6C46';
            changElement('i','hide');
            changElement('label','changePosition');
        } else if (userpick === 'false') {
            currentLabel.color = '#4A4A4A';
            labelStyle.color = '#EC6C46';
            changElement('i','hide');
            changElement('label','changePosition');
            userpickCurrent.insertAdjacentHTML('afterend','<span class="wrong"></span>');
            var elRight = document.createElement('span');
            labelCurrent.appendChild(elRight);
            elRight.className = 'right';
        }
    } else {
        askQuestion = true;
        submitBtn.textContent = quizData.submitContent;
        if (currentQuestion < quizData.questions.length - 1) {
          currentQuestion++;
          loadAskAnswers();
        } else {
          showFinalResults();
        }
    }
};

function showFinalResults(){
    submitBtn.insertAdjacentHTML('afterend','<button type="button" class="Done">开启App之旅</button>');
    var doneBtn = document.getElementsByClassName('Done')[0];
    var scoreDescreption;
    changeHTML('.quizName',score);
    changeHTML('.quizTitle','最终得分');
    scoreRange.sort(function (a,b) {
      return a.startScore - b.startScore;
    });
    scoreRange.forEach(function (element) {
      if (score >= element.startScore) {
        scoreDescreption = element.content;
      }
    });
    changeHTML('.answerArea',scoreDescreption);
    submitBtn.style.display = 'none';
    doneBtn.addEventListener('click', startPage,false);
};

window.addEventListener('load',startPage,false);
