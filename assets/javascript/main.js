let blackJackGame = {
  you: { scoreSpan: "#your-score", div: "#your-box", score: 0 },
  dealer: { scoreSpan: "#dealer-score", div: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  cardsValue: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];
const hitSound = new Audio("assets/sounds/swish.m4a");
const winSound = new Audio("assets/sounds/cash.mp3");
const lossSound = new Audio("assets/sounds/aww.mp3");

document.querySelector("#hit-button").addEventListener("click", blackJackHit);
document.querySelector("#stand-button").addEventListener("click", dealerLogic);
document.querySelector("#deal-button").addEventListener("click", blackJackDeal);

function blackJackHit() {
  if (blackJackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  let cardPicker = Math.floor(Math.random() * 13);
  return blackJackGame["cards"][cardPicker];
}

function showCard(card, player) {
  if (player["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `assets/images/${card}.png`;
    document.querySelector(player["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackJackDeal() {
  if (blackJackGame["turnsOver"] === true) {
    blackJackGame["isStand"] = false;

    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#your-score").textContent = 0;
    document.querySelector("#dealer-score").textContent = 0;
    document.querySelector("#your-score").style.color = "white";
    document.querySelector("#dealer-score").style.color = "white";

    document.querySelector("#blackjack-status").textContent = "Let's play";
    document.querySelector("#blackjack-status").style.color = "black";

    blackJackGame["turnsOver"] = true;
  }
}

function updateScore(card, player) {
  if (card === "A") {
    if (player["score"] + blackJackGame["cardsValue"][card][1] <= 21) {
      player["score"] += blackJackGame["cardsValue"][card][1];
    } else {
      player["score"] += blackJackGame["cardsValue"][card][0];
    }
  } else {
    player["score"] += blackJackGame["cardsValue"][card];
  }
}

function showScore(player) {
  if (player["score"] > 21) {
    document.querySelector(player["scoreSpan"]).textContent = "BUST!";
    document.querySelector(player["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(player["scoreSpan"]).textContent = player["score"];
    document.querySelector(player["scoreSpan"]).style.color = "yellow";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackJackGame["isStand"] = true;

  while (DEALER["score"] <= 16 && blackJackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1200);
  }

  blackJackGame["turnsOver"] = true;
  let winner = blackJackWinner();
  showResult(winner);
}

function blackJackWinner() {
  let winner;

  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackJackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackJackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackJackGame["draws"]++;
    }
  } else if ((YOU["score"] > 21 && DEALER["score"]) <= 21) {
    blackJackGame["losses"]++;
    winner = DEALER;
  } else if ((YOU["score"] > 21 && DEALER["score"]) > 21) {
    blackJackGame["draws"]++;
  }

  console.log(blackJackGame);
  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (blackJackGame["turnsOver"] === true) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackJackGame["wins"];
      message = "You won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackJackGame["losses"];
      message = "You lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackJackGame["draws"];
      message = "Tied";
      messageColor = "black";
    }

    document.querySelector("#blackjack-status").textContent = message;
    document.querySelector("#blackjack-status").style.color = messageColor;
  }
}
