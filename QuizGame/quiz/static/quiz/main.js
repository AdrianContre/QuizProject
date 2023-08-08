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

function checkAnswer() {
    const optionSelected = getSelectedRadioButtonValue();
    if (optionSelected === null) {
        document.getElementById('option-modal').style.display = "flex"
    }
    else {
        fetch(`/get/${currentIdQuestion}`)
        .then(response => response.json())
        .then(result => {
            correct_answer = result["correct_answer"];
            const parsedDoc = parser.parseFromString(correct_answer, 'text/html');

            // Obtener el contenido decodificado
            const decodedContent = parsedDoc.documentElement.textContent;
            console.log(decodedContent)
            if(decodedContent == optionSelected) {
                score++;
                document.getElementById("player-score").innerHTML = score
            }
            else {
                //post de la puntuación obtenida por el jugador y vuelves a la pantalla de play, con un pequeño modal 
                return fetch("saveScore", {
                    method: "POST",
                    headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
                    body: JSON.stringify({
                        "score": score
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    score = 0;
                    currentIdQuestion = 0;
                    return fetch("/", {
                        method: 'GET',
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                      
                })
                .catch(error => {
                    console.log(error)
                })
            }
        })
    }

}