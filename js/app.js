// list that holds my cards
const cardsList = [
    {
        number: 1,
        name: 'Targaryen',
        icon: 'img/targaryen-icon.png',
    },
    {
        number: 2,
        name: 'Stark',
        icon: 'img/stark-icon.png'
    },
    {
        number: 3,
        name: 'Lannister',
        icon: 'img/lannister-icon.png'
    },
    {
        number: 4,
        name: 'Baratheon',
        icon: 'img/baratheon-icon.png'
    },
    {
        number: 5,
        name: 'Greyjoy',
        icon: 'img/greyjoy-icon.png'
    },
    {
        number: 6,
        name: 'Arryn',
        icon: 'img/arryn-icon.png'
    },
    {
        number: 7,
        name: 'Martell',
        icon: 'img/martell-icon.png'
    },
    {
        number: 8,
        name: 'Bolton',
        icon: 'img/bolton-icon.png'
    },
    {
        number: 9,
        name: 'Frey',
        icon: 'img/frey-icon.png'
    },
    {
        number: 10,
        name: 'Tully',
        icon: 'img/tully-icon.png'
    },
    {
        number: 11,
        name: 'Mormont',
        icon: 'img/mormont-icon.png'
    },
    {
        number: 12,
        name: 'Tyrell',
        icon: 'img/tyrell-icon.png'
    }
];
// Rating Messages
const ratingResult = {
    high: {
        image: 'img/john.jpg',
        message: 'You are the azor ahai!! You completed the game with 3 stars!!'
    },
    medium: {
        image: 'img/tyrion.jpg',
        message: 'You are pretty smart like tyrion. You completed the game with 2 stars!!'
    },
    low: {
        image: 'img/joffrey.jpg',
        message: 'You completed the game with one star, your character is joffrey....'
    }
}
// ** VARIABLES //

// Memory game dom elements
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const restart = document.querySelectorAll('.restart');
const timer = document.querySelector('.timer');
let stars = document.querySelectorAll('.fa-star');
const audio = document.querySelector('audio');
const message = document.querySelector('.message');
const audioButton = document.querySelector('.music-icon');
const modal = document.querySelector('#modalFinish');
const closeBtn = document.querySelector('.close-btn');
const resultMsg = document.querySelector('#result-msg');
// Operational Variables'
let gameStarted = false;
let openedCards = [];
let matchedCards = [];
let movesCounter = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;
let intervalId = null;
let resultStars = 3;
// ** FUNCTIONS //

//TODO: Main function that draws the deck
function drawDeck () {
    while(deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    // starting counter
    movesCounter = 0;
    moves.textContent = movesCounter;
    // starting timer
    timer.textContent = `${hours}:${minutes}:${seconds}`;
    // cards shuffled
    let deckCards = shuffle(cardsList.concat(cardsList));
    //Adding each card to the deck
    // creating document fragment that holds cards
    let cardsWrapper = document.createDocumentFragment();
    deckCards.forEach((element) => {
        let cardItem = document.createElement('li');
        cardItem.classList.add('card');
        let imageItem = document.createElement('img');
        imageItem.setAttribute('src', element.icon);
        cardItem.setAttribute('value', element.number);
        cardItem.setAttribute('id', element.name);
        cardItem.appendChild(imageItem);
        // Adding event listener to each card
        cardItem.addEventListener('click', showCard);
        cardsWrapper.appendChild(cardItem);
    });
    deck.appendChild(cardsWrapper);
}
//TODO: function thats shows the card
function showCard(event) {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
        audio.play();
        audioButton.style.color ="#02b3e4";
    }
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    openedCards.push(event.target)
    if (openedCards.length > 1) {
        increaseCounter();
        if (openedCards[0].value !== openedCards[1].value) {
            unmatchCards();
        }  else {
            showMessage(`You found the house ${openedCards[0].id}!!`);
            matchCards();
        }
    }
}
//TODO: Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
//TODO: function than increases the moveCounter Variable
function increaseCounter () {
    movesCounter++;
    moves.textContent = movesCounter;
    // Rating Stars Validations
    if (movesCounter > 18 && movesCounter < 24) {
        stars[2].style.color = "grey";
    } else if (movesCounter > 24) {
        stars[2].style.color = "grey";
        stars[1].style.color = "grey";
    }
}
//TODO: disables cards
function enableCards(){
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('disabled');
    });
}
//TODO: enables cards
function disableCards(){
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.add('disabled');
    });
}
//TODO: function for unmatched cards
function unmatchCards () {
    disableCards();
    openedCards[0].classList.add('unmatch');
    openedCards[1].classList.add('unmatch');
    setTimeout(() => {
        enableCards();
        openedCards[0].classList.remove('unmatch', 'open', 'disabled');
        openedCards[1].classList.remove('unmatch', 'open', 'disabled');
        openedCards = []
    }, 1000)
}
//TODO: function that matches cards
function matchCards () {
    disableCards();
    openedCards[0].classList.add("match");
    openedCards[1].classList.add("match");
    setTimeout(() => {
        enableCards();
    }, 1000);
    matchedCards = matchedCards.concat(openedCards);
    if (matchedCards.length === 24) {
        if (movesCounter > 18 && movesCounter < 24) {
            resultStars = 2;
            displayFinalMessage(ratingResult.medium);
        } else if (movesCounter > 18) {
            resultStars = 1
            displayFinalMessage(ratingResult.low);
        } else {
            resultStars = 3
            displayFinalMessage(ratingResult.high);
        }
        clearInterval(intervalId);
        showModal();
    }
    openedCards = [];
}
//TODO: function that starts timer
function startTimer () {
    intervalId = setInterval(() => {
        timer.textContent = `${hours}:${minutes}:${seconds}`;
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes === 60) {
            hours++;
            minutes = 0;
            seconds = 0;
        }
    }, 1000);
}
//TODO: restart the game function
function restartTimer () {
    seconds = 0;
    minutes = 0;
    hours = 0;
    timer.textContent = `${hours}:${minutes}:${seconds}`;
    intervalId ? clearInterval(intervalId) : null;
    gameStarted = false;
    stars[2].style.color = 'yellow';
    stars[1].style.color = 'yellow';
}
//TODO: function that shows a message
function showMessage (msg) {
    message.textContent = msg;
    message.style.visibility = 'visible';
    setTimeout(() => {
        message.style.visibility = 'hidden';
    }, 3000);
}
//TODO: function that changes the sound status
function changesSound () {
    if (audio.paused) {
        audio.play();
        audioButton.style.color ="#02b3e4";
    } else {
        audioButton.style.color ="white";
        audio.pause();
    }
}
//TODO: function that shows success message
function showModal () {
    modal.classList.add("show");
}
// function that closes success message
function closeModal () {
    modal.classList.remove("show");
}
//TODO: appends a result message depending on the rating
function displayFinalMessage (message) {
    while(resultMsg.firstChild) {
        resultMsg.removeChild(resultMsg.firstChild);
    }
    let messageWrapper = document.createDocumentFragment();
    let messageImage = document.createElement('img');
    messageImage.setAttribute('src', message.image);
    let messageText = document.createElement('h2');
    messageText.textContent = message.message;
    messageWrapper.appendChild(messageImage);
    messageWrapper.appendChild(messageText);
    resultMsg.appendChild(messageWrapper);
    // show stats in result table
    document.querySelector('#stars-result').textContent = resultStars;
    document.querySelector('#movements-result').textContent = movesCounter;
    document.querySelector('#time-result').textContent = `${hours}:${minutes}:${seconds}`;
}
// ** LISTENERS **//

// listener that resets deck
restart.forEach((element) => {
    element.addEventListener('click', () => {
        drawDeck();
        restartTimer();
        audio.pause();
        audioButton.style.color ="white";
        closeModal();
        matchedCards = [];
    })
});
// listener that changes Audio
audioButton.addEventListener('click', () => {
    changesSound();
});
// listener for close modal btn
closeBtn.addEventListener('click', () => {
    closeModal();
    drawDeck();
    restartTimer();
    audio.pause();
    audioButton.style.color ="white";
    closeModal();
    matchedCards = [];
});
// When browser is ready event
document.addEventListener('DOMContentLoaded', () => {
    drawDeck();
    particlesJS('particles-js',{
        "particles": {
          "number": {
            "value": 33,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#fff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 10,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": false,
            "distance": 500,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 2
          },
          "move": {
            "enable": true,
            "speed": 6,
            "direction": "bottom",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "bubble"
            },
            "onclick": {
              "enable": true,
              "mode": "repulse"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 0.5
              }
            },
            "bubble": {
              "distance": 400,
              "size": 4,
              "duration": 0.3,
              "opacity": 1,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }
    )
});
