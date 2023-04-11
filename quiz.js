let quistionesCount = document.querySelector(".quiz-info .Count span");
let bulletsSpan = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quiz_area = document.querySelector(".quiz-area");
let answers_area = document.querySelector(".answers-area");
let submitq = document.querySelector(".submit-button");
let resulte = document.querySelector(".resulte");
let c = document.querySelector(".countdown")

let Q = 0;
let scoure = 0;
let duration = 10

function getQuistion() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let qObj = JSON.parse(this.responseText);
            let qcount = qObj.length;
            addBullets(qcount);
            addQdata(qObj[ Q ], qcount);
            countdown(duration, qcount)
            submitq.onclick = () => {
                let R = qObj[ Q ][ "right_answer" ];
                Q++;
                checkRanswer(R, qcount);
                quiz_area.innerHTML = "";
                answers_area.innerHTML = "";
                addQdata(qObj[ Q ], qcount);
                activeSpan();
                clearInterval(countdownInterval)
                countdown(duration, qcount)
                showResulte(qcount);
            };
            // counter(Q)
            // Q++
        }
    };


    myRequest.open("GET", "quistiones.json", true);
    myRequest.send();
}
getQuistion();


function addBullets(num) {
    quistionesCount.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let bullets = document.createElement("span");

        
        // if (i === 0) {
        //         bullets.className = "on";
        //     }
            bulletsSpan.appendChild(bullets);
        }
}






function addQdata(obj, count) {
    if (Q < count) {
        let header = document.createElement("h2");
        let Q_title_Txt = document.createTextNode(obj.title);
        header.appendChild(Q_title_Txt);
        quiz_area.appendChild(header);


        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            let inp = document.createElement("input");
            inp.name = "questione";
            inp.type = "radio";
            inp.id = `answer_${i}`;
            inp.dataset.answer = obj[ `answer_${i}` ];

            let label = document.createElement("label");
            label.htmlFor = inp.id;
            let labletxt = document.createTextNode(obj[ `answer_${i}` ]);
            label.appendChild(labletxt);
            mainDiv.appendChild(inp);
            mainDiv.appendChild(label);
            answers_area.prepend(mainDiv);
        }
    }




}



function checkRanswer(rightAnswer, qcount) {
    let answers = document.getElementsByName("questione");

    let theChoosen;
    for (let i = 0; i < answers.length; i++) {
        if (answers[ i ].checked) {
            theChoosen = answers[ i ].dataset.answer;
        }
    }
    if (theChoosen === rightAnswer) {
        scoure++;
    }
}



function activeSpan() {
    let spans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(spans);
    arrayOfSpans.forEach((span, index) => {
        if (Q-1 === index) {
            span.className = "on";
        }
    });
}

function showResulte(count) {
    let txt;
    if (Q=== count && scoure < (count / 2)) {
        txt = `<span class="Bad"><b>Not Good</b></span> , ${scoure} From ${count}`;
    } else if (Q === count && scoure >= (count / 2) && scoure < count) {
        txt = `<span class="good"><b>Good</b></span> , ${scoure} From ${count}`;
    } else if (Q === scoure ) {
        txt = `<span class="Exelant"><b>Exelant</b></span> , ${scoure} From ${count}`;
        
    }
    if (Q === count) {
        quiz_area.remove();
        answers_area.remove();
        submitq.remove();
        bullets.remove();
        resulte.innerHTML = txt;
        resulte.style.display = "block";
    }
}




function countdown(duration , count) {
    if (Q < count) {
        let min, sec
        countdownInterval = setInterval(() => {
            min = parseInt(duration / 60)
            sec = parseInt(duration % 60)
            min = min <10 ? `0${min}`:min
            sec = sec < 10 ? `0${sec}`:sec
            c.innerHTML = `${min}:${sec}`
            if (--duration < 0) {
                clearInterval(countdownInterval)
                submitq.click()
            }
        },1000)
    }
}




