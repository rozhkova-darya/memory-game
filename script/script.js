//Получение необходимых элементов со страницы

//Игровое поле
const cardsContainer = document.getElementById("game"),
  //Выбор сложности
  mode = document.querySelector(".mode-list"),
  //Все сложности
  modeItems = document.querySelectorAll(".mode-item"),
  //Минуты в поле "Время"
  minutesTotal = document.getElementById("min"),
  //Секунды в поле "Время"
  secondsTotal = document.getElementById("sec"),
  //Минуты в поле "Рекорд"
  recordMinutesTotal = document.getElementById("record-min"),
  //Секунды в поле "Рекорд"
  recordSecondsTotal = document.getElementById("record-sec"),
  //Минуты в поле "Финиш"
  finishMinutesTotal = document.getElementById("finish-min"),
  //Секунды в поле "Финиш"
  finishSecondsTotal = document.getElementById("finish-sec"),
  //Окно "Финиш"
  finishBox = document.querySelector(".finish"),
  //Кнопка "Сыграть еще"
  finishBtn = document.querySelector(".finish__btn");

(function () {
  const headerBtn = document.querySelector(".header__btn");
  const closeBtn = document.querySelector(".overlay-close");
  const overlay = document.querySelector(".overlay");
  headerBtn.addEventListener("click", () => {
    document.querySelector(".header__set").classList.add("active");
    document.querySelector(".overlay").classList.add("visable");
  });
  closeBtn.addEventListener("click", () => {
    document.querySelector(".header__set").classList.remove("active");
    document.querySelector(".overlay").classList.remove("visable");
  });
  overlay.addEventListener("click", () => {
    document.querySelector(".header__set").classList.remove("active");
    document.querySelector(".overlay").classList.remove("visable");
  });
})();

// CLASS FindTrio
class FindTrio {
  allCards = ["01", "02", "03", "04", "05"]; //Все возможные номера картинок
  gameCards = [...this.allCards, ...this.allCards, ...this.allCards]; //Карточи для вывода на игровое поле

  minutes = 0;
  seconds = 0; //Минуты и секунды для таймера

  flippedCards = [];
  flippedCardsHard = [];

  modeGame = document.querySelector(".mode-item.active").dataset.mode; //Сложность
  play = false; //Игра
  timer; //ID для setTimeout таймера

  //Перемешивание номеров игровых карт
  shaffleGameCards() {
    for (let i = this.gameCards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.gameCards[i], this.gameCards[j]] = [
        this.gameCards[j],
        this.gameCards[i],
      ];
    }
  }
  //Создание карточки
  createCard(i) {
    const card = document.createElement("div"), //Карточка
      front = document.createElement("div"), //Бокс лицевого изображения
      back = document.createElement("div"); //Бокс заднего изображения, рубашка

    //Классы боксов
    card.classList.add("card");
    front.classList.add("card-front");
    back.classList.add("card-back");

    //Атрибут карточки
    card.setAttribute("data-value", this.gameCards[i]);

    //Добавление картинок
    front.innerHTML = `<img class="card-img" src="./image/${this.gameCards[i]}.png" alt="Найди трио">`;
    back.innerHTML = `<img class="card-img" src="./image/bg.png" alt="back-face">`;

    //Сборка боксов
    card.append(front);
    card.append(back);

    //Возвращаем готовую карточку
    return card;
  }
  //Вывод карточек на игровое поле
  showCards() {
    cardsContainer.innerHTML = "";
    this.shaffleGameCards(); //Перемешивание игровых карточек

    for (let i = 0; i < this.gameCards.length; i++) {
      //Каждую новую карточку помещаем на игровое поле
      cardsContainer.append(this.createCard(i));
    }
  }
  //Переворачивание и сравнивание карт
  flip(card) {
    card.classList.add("flip");
    this.flippedCards.push(card);
    if (this.modeGame === "hard") {
      this.flippedCardsHard.push(card);
    }

    if (this.flippedCards.length === 2) {
      this.checkingMatches(this.flippedCards, this.flippedCardsHard);
    }
    if (this.flippedCards.length === 3) {
      this.checkingMatches(this.flippedCards, this.flippedCardsHard);
    }
  }

  //Проверяем совпадение
  checkingMatches(flippedCards, flippedCardsHard) {
    if (flippedCards.length === 2) {
      if (flippedCards[0].dataset.value !== flippedCards[1].dataset.value) {
        this.unFlipEasy(flippedCards);
        if (this.modeGame === "hard") {
          this.unFlipHard(flippedCardsHard);
        }
      } else return;
    }

    if (flippedCards.length === 3) {
      if (flippedCards[0].dataset.value !== flippedCards[2].dataset.value) {
        this.unFlipEasy(flippedCards);
        if (this.modeGame === "hard") {
          this.unFlipHard(flippedCardsHard);
        }
      } else {
        this.checkingCards();
        this.flippedCards = [];
      }
    }
  }

  //Закрываем карточки на легком уровне
  unFlipEasy(flippedCards) {
    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.remove("flip"));
    }, 600);
    this.flippedCards = [];
  }

  //Закрываем карточки на сложном уровне
  unFlipHard(flippedCardsHard) {
    console.log("flippedCardsHard 1: ", flippedCardsHard);
    setTimeout(() => {
      flippedCardsHard.forEach((card) => {
        card.classList.remove("flip");
      });
    }, 600);
    this.flippedCardsHard = [];
    console.log("flippedCardsHard 2: ", this.flippedCardsHard);
  }

  //Проверка карт на поле, определение выигрыша
  checkingCards() {
    this.cards = cardsContainer.querySelectorAll(".card:not(.flip)");
    if (this.cards.length === 0) {
      this.finished();
    }
  }

  //Запись рекорда
  setRecord(mode) {
    if (localStorage.getItem(`record__${mode}`)) {
      let record = JSON.parse(localStorage.getItem(`record__${mode}`));
      recordMinutesTotal.innerHTML = this.addZero(record.minutes);
      recordSecondsTotal.innerHTML = this.addZero(record.seconds);
    } else {
      let newRecord = `record__${mode}`;
      localStorage.setItem(
        newRecord,
        JSON.stringify({ minutes: 0, seconds: 0 })
      );
      recordMinutesTotal.innerHTML = "00";
      recordSecondsTotal.innerHTML = "00";
    }
  }

  //Фиксация нового рекорда
  setNewRecord(mod) {
    let lastRecord = JSON.parse(localStorage.getItem(`record__${mod}`));
    if (this.minutes < lastRecord.minutes) {
      localStorage.setItem(
        `record__${mod}`,
        JSON.stringify({ minutes: this.minutes, seconds: this.seconds })
      );
      this.setRecord(mod);
    } else if (
      this.seconds < lastRecord.seconds &&
      this.minutes == lastRecord.minutes
    ) {
      localStorage.setItem(
        `record__${mod}`,
        JSON.stringify({ minutes: lastRecord.minutes, seconds: this.seconds })
      );
      this.setRecord(mod);
    } else if (lastRecord.seconds == 0 && lastRecord.minutes == 0) {
      localStorage.setItem(
        `record__${mod}`,
        JSON.stringify({ minutes: this.minutes, seconds: this.seconds })
      );
      this.setRecord(mod);
    } else {
      return;
    }
  }

  //Запуск таймера
  startTimer() {
    this.timer = setInterval(() => {
      if (this.seconds >= 59) {
        this.minutes++;
        minutesTotal.innerHTML = this.addZero(this.minutes);
        this.seconds = `00`;
        secondsTotal.innerHTML = this.seconds;
      } else {
        this.seconds++;
        secondsTotal.innerHTML = this.addZero(this.seconds);
      }
    }, 999);
  }

  //Сброс таймера
  resetTimer() {
    clearInterval(this.timer);
    this.seconds = 0;
    secondsTotal.innerHTML = this.addZero(this.seconds);
    this.minutes = 0;
    minutesTotal.innerHTML = this.addZero(this.minutes);
  }

  //Победа
  finished() {
    clearInterval(this.timer);
    finishBox.style.opacity = "1";
    finishBox.style.pointerEvents = "auto";
    this.setNewRecord(this.modeGame);
    finishSecondsTotal.innerHTML = this.addZero(this.seconds);
    finishMinutesTotal.innerHTML = this.addZero(this.minutes);
  }

  //Добавление 0 к числу
  addZero(num) {
    if (num < 10) {
      return (num = `0${num}`);
    } else {
      return num;
    }
  }

  eventListener() {
    //Клик по карточке
    cardsContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("card")) {
        this.flip(target);
        if (!this.play) {
          this.startTimer();
          this.play = true;
        } else {
          return;
        }
      }
    });
    //Клик по кнопке "Сыграть еще"
    finishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.play = false;
      this.resetTimer();
      this.showCards();
      finishBox.removeAttribute("style");
    });
    //Клик по сложности
    mode.addEventListener("click", (e) => {
      if (!this.play) {
        modeItems.forEach((item, i, items) => {
          if (e.target == item) {
            if (items[i + 1]) {
              items[i].classList.remove("active");
              items[i + 1].classList.add("active");
              mode.style.transform = `translateX(-${100 * (i + 1)}px)`;
              this.modeGame =
                document.querySelector(".mode-item.active").dataset.mode;
              this.setRecord(this.modeGame);
            } else {
              items[i].classList.remove("active");
              items[0].classList.add("active");
              mode.removeAttribute("style");
              this.modeGame =
                document.querySelector(".mode-item.active").dataset.mode;
              this.setRecord(this.modeGame);
            }
          }
        });
      } else return;
    });
  }

  //Запуск
  init() {
    this.showCards();
    this.setRecord(this.modeGame);
    this.eventListener();
  }
}

new FindTrio().init();
