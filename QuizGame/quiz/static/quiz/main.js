let score = 0;
let currentIdQuestion = 0;
let parser = new DOMParser();

function getCookie(name) {
    let cookie = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return cookie ? cookie[2] : null;
}

function closeOptionModal() {
    document.getElementById('option-modal').style.display = "none"
}


function getSelectedRadioButtonValue() {
    const radioButtons = document.getElementsByName("option");
    
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            const labelId = radioButton.getAttribute('id') + '-label';
            const label = document.getElementById(labelId);
            return label.innerHTML;
        }
    }
    
    return null;
}

function shuffleAnswers(object) {
    let answers = []
    answers.push(object["correct_answer"])
    for (let i = 0; i < 3; ++i) {
        answers.push(object["incorrect_answers"][i])
    }
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]]; 
      }
    return answers;
}


function NextQuestion(mode) {
    console.log("Siguiente pregunta")
    let questionObject = undefined;
    //getting the question and putting it into the html
    fetch(`https://opentdb.com/api.php?amount=1&difficulty=${mode}&type=multiple`)
    .then(response => response.json())
    .then(result => {
        object = result["results"];
        questionObject = object;
        question = object[0]["question"]
        category = object[0]["category"]
        document.getElementById("display-question").innerHTML = `${question}`;    
        shuffled = shuffleAnswers(object[0])
        document.getElementById("option-one-label").innerHTML = shuffled[0];
        document.getElementById("option-two-label").innerHTML = shuffled[1];
        document.getElementById("option-three-label").innerHTML = shuffled[2];
        document.getElementById("option-four-label").innerHTML = shuffled[3];
        return fetch("/saveQuestion",{
            method: 'post',
            headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
            body: JSON.stringify({
                category: questionObject[0]["category"],
                correct_answer: questionObject[0]["correct_answer"],
                question: questionObject[0]["question"],
                type: questionObject[0]["type"],
                incorrect_answers: questionObject[0]["incorrect_answers"]
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            currentIdQuestion = result["pk"]
            console.log(currentIdQuestion)

        })
    })

    
}

function checkAnswer(mode) {
    const selectedOption = getSelectedRadioButtonValue();

    if (selectedOption === null) {
        // Mostrar un modal o mensaje de error al usuario
        document.getElementById('option-modal').style.display = "flex";
        return; // Salir de la función si no hay opción seleccionada
    }

    fetch(`/get/${currentIdQuestion}`)
        .then(response => response.json())
        .then(result => {
            const correct_answer = result["correct_answer"];
            const parsedDoc = new DOMParser().parseFromString(correct_answer, 'text/html');

            const decodedContent = parsedDoc.documentElement.textContent;
            console.log(decodedContent);
            if (decodedContent === selectedOption) {
                score++;
                document.getElementById("player-score").textContent = score;
                setTimeout(() => {
                }, 1000)
                NextQuestion(mode)
                const radioButtons = document.getElementsByName("option");
                for (const radioButton of radioButtons) {
                    radioButton.checked = false;
                }
                const next = document.getElementById("next-question-button")
                next.style.background = "none";

            } else {
                fetch("saveScore", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify({
                        "score": score
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    document.getElementById('score-modal').style.display = "flex";
                    document.querySelector(".grade-details").innerHTML = `You have scored ${score} points <br> The correct answer was ${decodedContent}`
                    console.log(document.querySelector(".grade-details").innerHTML)
                    score = 0;
                    currentIdQuestion = 0;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
