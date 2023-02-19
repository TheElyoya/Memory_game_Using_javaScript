class AudioController {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flip = new Audio("Assets/Audio/flip.wav");
    this.match = new Audio("Assets/Audio/match.wav");
    this.victory = new Audio("Assets/Audio/victory.wav");
    this.gameOver = new Audio("Assets/Audio/gameOver.wav");
    this.bgMusic.volume = 0.4;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flipMusic() {
    this.flip.play();
  }

  matchMusic() {
    this.match.play();
  }

  victoryMusic() {
    this.stopMusic();
    this.victory.play();
  }

  gameOverMusic() {
    this.stopMusic();
    this.gameOver.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.totalTime = totalTime;
    this.arrayOfCards = cards;
    this.remainingTime = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.flips = document.getElementById("flips");
    this.audioController = new AudioController();
  }

  startGame() {
    this.cardToCheck = null;
    this.clicks = 0;
    this.matchedCards = [];
    this.remainingTime = this.totalTime;
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.flips.innerText = this.clicks;
    this.timer.innerText = this.remainingTime;
  }
  hideCards() {
    this.arrayOfCards.forEach((card) => {
      card.classList.remove("matched");
      card.classList.remove("visible");
    });
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flipMusic();
      card.classList.add("visible");
      this.clicks++;
      this.flips.innerText = this.clicks;
      if (this.cardToCheck) {
        this.checkMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  checkMatch(card) {
    if (this.getCardInfo(card) === this.getCardInfo(this.cardToCheck))
      this.cardMatched(card, this.cardToCheck);
    else this.misMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }

  cardMatched(card1, card2) {
    this.audioController.matchMusic();
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);

    if (this.matchedCards.length === this.arrayOfCards.length) {
      this.victory();
    }
  }

  misMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }

  getCardInfo(card) {
    return card.getElementsByClassName("midd-img")[0].src;
  }

  shuffleCards() {
    for (let i = this.arrayOfCards.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [this.arrayOfCards[i], this.arrayOfCards[randomIndex]] = [
        this.arrayOfCards[randomIndex],
        this.arrayOfCards[i],
      ];
      this.arrayOfCards[i].style.order = randomIndex;
      this.arrayOfCards[randomIndex].style.order = i;
    }
  }

  startCountDown() {
    return setInterval(() => {
      this.remainingTime--;
      this.timer.innerText = this.remainingTime;
      if (this.remainingTime === 0) {
        this.gameOver();
      }
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOverMusic();
    document.getElementById("game-over-text").classList.add("visible");
  }

  victory() {
    clearInterval(this.countDown);
    this.audioController.victoryMusic();
    document.getElementById("victory-text").classList.add("visible");
  }

  canFlipCard(card) {
    return (
      card !== this.cardToCheck &&
      !this.matchedCards.includes(card) &&
      !this.busy
    );
  }
}

ready();

function ready() {
  let overlays = [...document.getElementsByClassName("overlay-text")];
  let cards = [...document.getElementsByClassName("card")];
  const game = new MixOrMatch(90, cards);
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", function () {
      overlay.classList.remove("visible");
      game.startGame();
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });
}
