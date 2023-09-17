function auto_grow(element: { style: { height: string; }; scrollHeight: string; }) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}

let count: HTMLElement | null = document.querySelector(".count-comment-body");
let message: HTMLElement | null = document.querySelector(".text-long-message");
let textarea: HTMLInputElement | null= document.querySelector("#comment-body");
let btn = document.getElementById("comment-send");
let limit = 1000;

function validateTextarea() {
  textarea!.addEventListener("input", () => {
    let textlength = textarea!.value.length;
    count!.innerText = `${textlength}/${limit}`;

    if (textlength > limit) {
      count!.innerHTML = `${textlength}/${limit}`;
      count!.style.color = "#FF0000";

      message!.innerText = `Слишком длинное сообщение`;
      message!.style.color = "#FF0000";

      btn!.style.backgroundColor = "#dbd7d7";
      btn!.style.color = "#918d8d";
    } else if (textlength <= 0) {
      count!.innerHTML = `Макс. ${limit} символов`;
      count!.style.color = "#918d8d";

      btn!.style.backgroundColor = "#dbd7d7";
      btn!.style.color = "#918d8d";
    } else if (textlength <= limit) {
      message!.innerText = "";

      count!.style.color = "#918d8d";

      btn!.style.backgroundColor = "#ABD873";
      btn!.style.color = "#000000";
    } else {
      count!.innerText = `Макс. ${limit} символов`;
    }
  });
}

validateTextarea();

// создаём отправку, отображение и сохранение комментов

let comments: {
  ratingScoreAnswer: any; answer: never[]; body: any; time: number; userSend: string; photoSend: string; like: boolean; favoriteOff: string; ratingScore: number; 
}[] = [];
let comAnswers = [];
let arrowAnswer = "";
let indexArrow = "";
let drawAnswer = "";

function commentSend(): void {
  btn!.addEventListener("click", (event: Event) => {
    event?.preventDefault();
    let commentBody = document.getElementById("comment-body") as HTMLInputElement;

    // answer должен быть массивом
    let comment: {
      ratingScoreAnswer?: number | undefined;
      answer: {
        bodyAnswer: string;
        timeAnswer: number;
        userSendAnswer: string;
        userAnswer: string;
        photoAnswer: string;
        likeAnswer: boolean;
        favoriteOffAnswer: string;
        ratingScoreAnswer?: number | undefined;
      }[];
      body: string;
      time: number;
      userSend: string;
      photoSend: string;
      like: boolean;
      favoriteOff: string;
      ratingScore: number;
    } = {
      answer: [],
      body: commentBody!.value,
      time: Math.floor(Date.now() / 1000),
      userSend: "Максим Авдеенко",
      photoSend: "./images/Max.png",
      like: false,
      favoriteOff: "В избранное",
      ratingScore: 0,
    };

    count!.innerText = `Макс. ${limit} символов`; // обнуляем при клике счётчик символов
    btn!.style.backgroundColor = "#dbd7d7"; // обнуляем стиль счётчика
    commentBody!.value = ""; // очищаем поле

    if (comment.body.length > 0 && comment.body.length <= limit) {
      comments.push(comment);
      showNumberComments();
      showComments();
      saveComments();
      toggleHeart();
      changeRating();
      createAnswer();
      submitAnswer();
      filterInFavorite();
    }
  });
}

commentSend();

// функция для отображения количества комментов
function showNumberComments() {
  let numberComments: HTMLElement | null = document.getElementById("numberOfComments");
  let numberofcom = `<p class="numOfCom"> Комментарии <span class="numSpan">(${comments.length})</span></p>`;
  numberComments!.innerHTML = numberofcom;
}

function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments)); // сохраняем в Local
}

function localComments() {
  // отображаем из Local
  if (localStorage.getItem("comments")) {
    comments = JSON.parse(localStorage.getItem("comments") || '{}');
  }
  showComments();
  toggleHeart();
  changeRating();
  createAnswer();
  submitAnswer();
}

localComments();
showNumberComments();

//   localStorage.clear();

function showComments() {
  let resultComment: HTMLElement | null = document.getElementById("result-comment");

  resultComment!.innerHTML = "";
  comments.forEach(function (item, index) {
    let out = "";
    out += `<div class="image-alex-sent"></div>`;
    out += `<div class="user-sent">${item.userSend}</div>`;
    out += `<div class="text-date">${timeConverter(item.time)}</div>`;
    out += `<p class="text-sent">${item.body}</p>`;
    out += `<div class="toolbar-sent">
          
                     <button class="button-bordernone btn-answer" data-index-arrow="${index}">
                         <svg class="toolbar-sent_svg-answer" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                             <path fill-rule="evenodd" clip-rule="evenodd" d="M8.004 2.98l-6.99 4.995 6.99 4.977V9.97c1.541-.097 2.921-.413 7.01 3.011-1.34-4.062-3.158-6.526-7.01-7.001v-3z" fill="#918d8d"></path>
                         </svg>
                     </button>
                     
                     <h3 class="toolbar-sent_text">Ответить</h3>
  
                     <div class="inFavorite ${
                       item.like ? "toggleHeart" : ""
                     }" data-index="${index}">
                          ${paintHeart(item.like)}
                     </div>
                     
                          <div class="rating-minus">
                              <button class="button-bordernone rating btn__rating-minus" data-index-change="${index}">
                                  <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                  <path d="M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z" fill="#FF0000"/>
                              </svg>
                              </button>
                          </div>
  
                     
                          <h3 class="toolbar-sent_text-rating rating-text-${index}">${
      item.ratingScore
    }</h3>
                          
                          <div class="rating-plus">
                              <button class="button-bordernone rating btn__rating-plus" data-index-change="${index}">
                                  <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                                  <path d="M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z" fill="#8AC540"/>
                                  </svg>
                              </button>
                          </div>
  
                  </div>
  
                  <div class="block-result-answer answer-field-${index}"></div>
                 </div>`;
    resultComment!.innerHTML += out;
    //как отрисовали ответ , то теперь имеем блок для отрисовки ответов
    //вызываем функцию отрисовки и обязательно передаем индекс комента
    answerContentDraw(index);
    toggleHeartAnswer(index);
    changeRatingAnswer(index);
  });
  // resultComment.innerHTML = out;
}

function timeConverter(UNIX_timestamp: number) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = date + "." + month + " " + hour + ":" + min;
  return time;
}

// вешаем клик на ЛАЙК "В избранное" комментов

function toggleHeart() {
  document.querySelectorAll(".inFavorite").forEach(function (item) {
    item.addEventListener("click", function (event) {
      if (event.target !== null) {
        const favoriteBtn = (event.target as HTMLElement).closest(".inFavorite");
        if (favoriteBtn !== null) {
          favoriteBtn.classList.toggle("toggleHeart");
          const index: number = Number(favoriteBtn?.getAttribute("data-index"));
          if (isNaN(index)) {
            return;
          }
          console.log(index);

          if (favoriteBtn.classList.contains("toggleHeart")) {
            //перерисрвываем верстку лайка передавая значение тру
            favoriteBtn.innerHTML = paintHeart(true);
            //тут перезаписываем значение лайка в нашем массиве
            comments[index].like = true;
          } else if (!favoriteBtn.classList.contains("toggleHeart")) {
            //перерисрвываем верстку лайка передавая значение фолс
            favoriteBtn.innerHTML = paintHeart(false);
            //тут перезаписываем значение лайка в нашем массиве
            comments[index].like = false;
          }
          //перезаписываем в локальном хранилище данные чтобы были актуальны
          saveComments();
        }
      }
    });
  });
}

//  вешаем клик на ЛАЙК "В избранное" ответов

interface Answer {
  likeAnswer: boolean;
}

function toggleHeartAnswer(index: number) {
  document.querySelectorAll(".inFavoriteAnswer").forEach(function (item) {
    item.addEventListener("click", function (event) {
      let favoriteBtnAnswer = (event.target as HTMLElement).closest(".inFavoriteAnswer");
      if (favoriteBtnAnswer === null) {
        return;
      }
      favoriteBtnAnswer.classList.toggle("toggleHeartAnswer");
      let indexAnswer = favoriteBtnAnswer.getAttribute("data-index-answer");
      if (indexAnswer !== null) {
        const answer: Answer = comments[index].answer[Number(indexAnswer)];
        if (favoriteBtnAnswer.classList.contains("toggleHeartAnswer")) {
          //перерисрвываем верстку лайка передавая значение тру
          favoriteBtnAnswer.innerHTML = paintHeart(true);
          //тут перезаписываем значение лайка в нашем массиве
          answer.likeAnswer = true;
        } else if (!favoriteBtnAnswer.classList.contains("toggleHeartAnswer")) {
          //перерисрвываем верстку лайка передавая значение фолс
          favoriteBtnAnswer.innerHTML = paintHeart(false);
          //тут перезаписываем значение лайка в нашем массиве
          answer.likeAnswer = false;
        }
        //перезаписываем в локальном хранилище данные чтобы были актуальны
        saveComments();
      }
    });
  });
}

//отрисовку в зависимости от Like в отдельную функцию, ею всегда и будем пользоваться

function paintHeart(like: boolean) {
  let htmlHeart = "";
  if (like) {
    htmlHeart = `<button class="button-bordernone">
              <svg class="toolbar-sent_svg-heartempty" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g opacity="0.4">
              <mask id="mask0_12_601" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="url(#pattern0)"/>
              </mask>
              <g mask="url(#mask0_12_601)">
              <rect x="-1.25" width="29.5" height="27.5" fill="black"/>
              </g>
              </g>
              <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_12_601" transform="scale(0.0104167)"/>
              </pattern>
              <image id="image0_12_601" width="96" height="96" xlink:href="data:image/png;base64,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"/>
              </defs>
              </svg>
          </button>
          <h3 class="toolbar-sent_text">В избранном</h3>`;
  } else {
    htmlHeart = `<button class="button-bordernone">
              <svg  class="toolbar-sent_svg-heartempty" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <mask id="mask0_3_291" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="url(#pattern0)"/>
              </mask>
              <g mask="url(#mask0_3_291)">
              <rect opacity="0.4" x="2" y="4" width="21" height="19" fill="black"/>
              <path d="M3.5 9.00004C2.5 12.9999 8.83333 17.3333 12 20C20 14.4 21.1667 10.5001 20.5 9.00004C18.5 4.20004 13.8333 6.16667 12 8.00001C7 3.5 4.5 6.50002 3.5 9.00004Z" fill="white"/>
              </g>
              <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_3_291" transform="scale(0.0104167)"/>
              </pattern>
              <image id="image0_3_291" width="96" height="96" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAKSklEQVR4nO2ce5AUxR3Hfz3v2feyu/fAQ+CAoDkFBAOUhocpgsbSIyASH8TCJFaSMmpSMZXEmKoz0aS0UlplJT5QimjKBxINSUAqGiMVkQsiormcJXgcdxx3t+zu7e3jdufdnT+QihqFmd3Zmz3pT9Xvr+3+9W9+3+menp3uBqBQKBQKhUKhUCgUCoVCoVAoFAqFQqHUFFTrBsjyDRHQisuxrlxBDH0msrQoEOABY5YA5hHLjSGGKwInFBEr/BNCvi3oH1sO1ySWi66bB3rhOssy5oChxhC2fIRgARHCAyAVGM4iHJtlODGNeHk7sIHtaM8fUrWI5SQ1EYBAB2MtfvtSoim3kbHR2Sgz0EKKIxyY+qmD8YUBxVtSJBRPguB/hRP9d6POrdmqYlmyvtkoZ3+JtNJClE22kJGBKNHKp66EGIBgDDPxliESjPUhUX6CnSptRlu3WtXE8olNue3QXLhqtaUU74JkTyvKHPMDwZU5kgIEprT1QSC6lw9Hb0G7nsk4qU4WXdto6tmHcGHkC2igewroSmVxAABEmjU4a3YPSP5H+f07fosASOXOPoprAiiLr5mGlJFNKHl4PhzvjbjlFwQJYMaCHuQL3yvsf/Hx0xUnAEid/5U7mLHcN+DIgVYwVNdCgUmTy9DS1kWkwA3SG3865IZLVwRQ519+BSllH0Q9b04Hy3TD5f8TP7tAWmbvluTIWtS59RNvZ7L86oCayz2P+ruWwGhSrkkcDAt4xvyjJBi/x//Wzo3VuqtaAGXeyp+R7OD3mKPdTdX6Oi1SAOPPLdynTQpdFt21Lffhn0pL1jRDLvs39tAb54FWrvnkAjfPHEFNrY/JB176aTV+qgq0NHflnTB08HYm3R+uxo8jeAnM2Yv+DdGGFcHXtqYBAMYWtTfCWP4V5r09bcgyxi0UiE0pGC3nPBZ65+XbK3VRsQD5eSuvZ1P9D7BDBxOV+qgYTgD93C92hmJ46XAxKATV4uvcwdfngTmOyf8A3Dg9S5pm3R1456UHKqlfkQDZ+e1zuNzADq73QEsl9d2A+COG2brgaQIkJLy/dxWoJcarWMypcwdxrGVV5K0d+53WdSwAgQ4m1/bqXuHd1y6seIrpElZsyigiFsNkh8ZvCPwkEAP6ORd3RXznLkD7NzrqhqzTtm49n/052991FdJKnNO6boOUgoyUouR1HAAEkFKYVApK/vtSR152UtNRt01f3B5E5dwNTDEjETjxNkLthKFSjkfl0TXZBVc76o2OBDDzhR8yQ+9P9/pi69XYoYOtppq+y0lObQtAABCjlVcjpcB4faH1aqCWENHKKwh02M6r7YLDF6xcwo4MzvD6IuvdmOzg1OTczmV282r7QYqV8vWokPF7O++pf5h8KoDjYzcAwKt2ytufyRjaeWBqJ7oa5dOxDABLP8ducVtDEIEOhuhqk9fde6IYNrQYsfmOZUuAw3P2xJGu0KmnTWO0UvDY3C9NtpNbW0MQIrgRGaqP2ClMAWKosmHycQAYPF1ZWwJYAI1gqAEqgD2IacgGa4bslLUnAMEMJoSlAtiDABCwkK102RIAY6RghAwCIFQX2pkBZhgdW5atj9A2nwHWKOHEEhXAHpjlVQOzo3bK2hLA5MxBg5dKPEC0utDODCxeLsuYP+0DGMDmNHRO1+5RkxNKXk/vJopZLFec1bNTs5Nb22/CJssdJwCz7ZY/k7FYLmm3rG0BCGLfs1h+KTOeH70nIBYnAkbc23bL2/431OCEv+pSQPe6e9e7mVJIMXhxu9282u4BDPbt1uTosFAanWq3zpmI4gsP47K+z2552z3ggr5dOUOUj2BAnt9ldWsIgcGJhy4c2n+a1b//w9knSY5/XJeDmucXWqemyNGyzgoPO8mpIwH8AWNrOZDo9/pC69WUYKxvYGDmDic5dSRAW3e3rnHiPoPlAQNQ+5AZnAgGw7+2DpztIXC8mkwV/bcXw5NpL/iY5SPNvZgN3+E0n44FuKRvX1KTfLtMlvf8ouvFDE4kBi+/dNGxTse7eSpa3Yax9KN8ePKySLZ/WiX1P2sUIs29hihWtEy9ogWtS5MH0rooP6uJ/jN+RqSJAVVnxc2X9L39kf0Kdql4eXoHALM8MWNvPNN7ISKkUjcTGoIYyCRaO5elei6udN9YxUu6OwCwyoob8qGmQa/vQq8sF24eNHluQzWb9qpaU39Z8t1uhQ88rQh+xetp4HhbWQyVVE7euGLwvao261W9l4oAoJdjM3bGcgMrOUuv+d6sesBieZyJnr19Zebwqmp9Vb2rBAGQHCOtzYTP6saI8XxYqLVZiIFUuKVLEyLXVpu7D/LnDi/EZp0bMEsvxvJD0z7L3SATbulVJf+K9uMHj7jhz9Vc/TkxfamsKE/FxpKe7R2rJdlQ81GV819zZban0y2fjrconYpny7n+df5Ej8lyyySjHHTTt9eM+hsGNUG+6cps7y43/boqAADAM2ru0Ff9iRxmuMWioQS8HrPdsKwvPjzGB76/Ktf3F7fz5boAAABb1PyB1XLjMYPlFstG2dYSvXol60sMlXjfbVfl+/9YC/81fV6+EJp2mWCWH4mVU1Mn4oN5xJcY0Hj5m2vyRx3tfHRCzfOyJTJlqWTqm+OlVOtE+cuCIAbS/obDKiOtv6bQ969atjUuN+ZT4bNbRcvc1lBOnc/iGp2m4hImw5KML9FtsWL7uny/K1PNUzFuI8Nz0dYwNpRtcWXkIsnS63KNqcaKRkaO7Uay0b4unR4bjzbHdWh+FYAb9k/eGNIL7WFjLDaebZ+OvBAcLQiB57mx4e+sA3D9aLJPw5Nn45P+5q9Lln5Pg5qdgir/I9EVCCDISNE+lRU61peST4x3+55NTn4faGoTMH4moWbbeGx6ctKJzvBWRop2EU5Yd33h2PtexODp7HAzTJNYubwxYCqXR43iuA5JBc6fyfP+nTkldNOt0GNrJXMtqIvp+Sa5YbWEzXsTem4WW+MjcCzEQEoIHzEZ7icblPRzNW3MBnUhAADAw4HGBsm0nptkFBf6La0mB+4pjFDOCKE3yyz62s2ltO0l5LWkbgQAOPFxZ5MQ+4Uf6zfGzbGzqvjS9zG/CNJc4JjGCI/cqI/8ys1zP6ulrgQ4ye/4xDwJzE0NZvF8gZh8Nb40xJlpLtitI2H9d/Xj/3ErRreoSwEAAB4F4IGP3u/D+tqEVXJ8JCYBgFHWlywy0vZhI3tzB8Cpz032iLoV4CQPcdElPJCHGq3i53li2Zqu6ojFKTZwUAf2Wzeb2T21jrEa6l4AAIBHYbLPYkubQkT/8iSsnHK6OsLI6SISd6asyLc7oM/Fc4trw4QQ4CQPsuG1MrF+3YBLM9mPPUctQJBkfH064n9wi5Xb5lGIjplQAgAA3AuTWmTW2NKElQUyMUUAAAWxeorxHShZ4pofQ2bI6xidUJMvYrXk76AUFhH9SZPxNVuAppYRX0oj8YlRPHb1nVAueB3fGcX9ELzyN+C/1Os4KBQKhUKhUCgUCoVCoVAoFDv8F6pOyz8OCDukAAAAAElFTkSuQmCC"/>
              </defs>
              </svg>
          </button>
          <h3 class="toolbar-sent_text">В избранное</h3>`;
  }
  return htmlHeart;
}

// вешаем клики на РЕЙТИНГ комменты, меняем рейтинг в зависимости от нажатия на  + или -

function changeRating() {
  document.querySelectorAll(".rating").forEach(function (item) {
    item.addEventListener("click", function (event) {
      const btn = (event.target as HTMLElement).closest(".rating");
      if (btn !== null) {
        const indRat: number = parseInt(btn.getAttribute("data-index-change") || "0");
        if (!isNaN(indRat)) {
          if (btn.classList.contains("btn__rating-plus")) {
            comments[indRat].ratingScore++;
          }
          if (btn.classList.contains("btn__rating-minus")) {
            comments[indRat].ratingScore--;
          }
          const ratingText = document.querySelector(`.rating-text-${indRat}`);
          if (ratingText !== null) {
            ratingText.textContent = comments[indRat].ratingScore.toString();
          }
          saveComments();
        }
      }
    });
  });
}

// вешаем клики на РЕЙТИНГ ответа, меняем рейтинг в зависимости от нажатия на  + или -

function changeRatingAnswer(index: number) {
  document.querySelectorAll(".rating-answer").forEach(function (item) {
    item.addEventListener("click", function (event) {
      const btnAns = (event.target as HTMLElement).closest(".rating-answer");
      if (btnAns === null) {
        return;
      }
      const indRatAns: number = parseInt(btnAns.getAttribute("data-index-change-answer") || "0");
      if (indRatAns === null) {
        return;
      }
      console.log(indRatAns);

      if (btnAns.classList.contains("btn__rating-plus-answer")) {
        comments[indRatAns].ratingScoreAnswer++;
      }
      if (btnAns.classList.contains("btn__rating-minus-answer")) {
        comments[indRatAns].ratingScoreAnswer--;
      }
      btnAns.textContent = comments[indRatAns].ratingScoreAnswer.toString();
      saveComments();
    });
  });
}

// вешаем клик на ОТВЕТ

function createAnswer() {
  document.querySelectorAll(".btn-answer").forEach((item: Element) => {
    item.addEventListener("click", (event: Event) => {
      const arrowAnswer = (event.target as HTMLElement).closest(".btn-answer");
      const indexArrow = arrowAnswer?.getAttribute("data-index-arrow");
      const drawAnswer = document.querySelector(`.answer-field-${indexArrow}`) as HTMLElement;
      if (drawAnswer) {
        drawAnswer.innerHTML = `<form class="area-answer">
                      <input class="field-answer" type="text" size="40" id="idAnswer" placeholder="Введите ответ...">
                      <button class="submit-answer" type="submit" id="btnAnswer">Ответить</button>
                  </form>`;
        submitAnswer(Number(indexArrow));
        toggleHeartAnswer(Number(indexArrow));
        changeRatingAnswer(Number(indexArrow));
        saveComments();
      }
    });
  });
}


// снимаем submit с кнопки "Ответить" - preventDefault();

function submitAnswer(): void {
  document.querySelectorAll(".submit-answer").forEach((item: Element) => {
    item.addEventListener("click", (subm: Event) => {
      subm.preventDefault();
      let answertBody = document.getElementById("idAnswer") as HTMLInputElement;

      let comAnswer: {
        bodyAnswer: string;
        timeAnswer: number;
        userSendAnswer: string;
        userAnswer: string;
        photoAnswer: string;
        likeAnswer: boolean;
        favoriteOffAnswer: string;
        ratingScoreAnswer: number;
    } = {
        bodyAnswer: answertBody.value,
        timeAnswer: Math.floor(Date.now() / 1000),
        userSendAnswer: "Максим Авдеенко",
        userAnswer: "Джунбокс3000",
        photoAnswer: "./images/Jun.png",
        likeAnswer: false,
        favoriteOffAnswer: "В избранное",
        ratingScoreAnswer: 0,
    };
      
      // тут мы кладем ответ в нужный коммент по ключу indexArrow
      // который мы передали в createAnswer сюда
      comments[Number(indexArrow)].answer.push(comAnswer);

      // передаем обязательно индекс родителя
      answerContentDraw(Number(indexArrow));
      toggleHeartAnswer(Number(indexArrow));
      changeRatingAnswer(Number(indexArrow));
      saveComments();
    });
  });
}


//рисуем ответ

function answerContentDraw(index: number) {
  let outAnswer = "";
  // drawAnswer тут получаем, мы знаем индекс родителя всегда
  const drawAnswer = document.querySelector(`.answer-field-${index}`);
  //в answerComment клажем ответы нужного комментария
  const answerComment = comments[index].answer;
  answerComment.forEach(function (item: { userAnswer: any; userSendAnswer: any; timeAnswer: number; bodyAnswer: any; likeAnswer: boolean; ratingScoreAnswer: any; }, index: any) {
    outAnswer += `<div data-answer="${index}" class="container-answer container-answer-${index}">
                      <div class="image-jun-answer"></div>
                      <div class="user-answer">${item.userAnswer}</div>
                      <div class="arrow-answer">
                          <svg class="toolbar-sent_svg-answer" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M8.004 2.98l-6.99 4.995 6.99 4.977V9.97c1.541-.097 2.921-.413 7.01 3.011-1.34-4.062-3.158-6.526-7.01-7.001v-3z" fill="#918d8d"></path>
                          </svg>
                      </div>
                      <div class="post-sender-name">${item.userSendAnswer}</div>
                      <div class="text-date-answer">${timeConverter(
                        item.timeAnswer
                      )}</div>
                      <p class="text-send-answer">${item.bodyAnswer}</p>
  
                      <div class="inFavoriteAnswer position-like-answer ${
                        item.likeAnswer ? "toggleHeartAnswer" : ""
                      }" data-index-answer="${index}">
                              ${paintHeart(item.likeAnswer)}
                      </div>
  
                      <div class="rating-answer-area">
  
                      
                      <div class="rating-minus">
                      <button class="button-bordernone rating-answer btn__rating-minus-answer" data-index-change-answer="${index}">
                          <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                          <path d="M13.0696 11.6399V13.2955H7.26562V11.6399H13.0696Z" fill="#FF0000"/>
                      </svg>
                      </button>
                  </div>
  
                          <h3 class="toolbar-sent_text-rating rating-text-answer${index}">${
      item.ratingScoreAnswer
    }</h3>
                         
  
  
                          <div class="rating-plus">
                          <button class="button-bordernone rating-answer btn__rating-plus-answer" data-index-change-answer="${index}">
                              <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle opacity="0.1" cx="10" cy="13" r="10" fill="black"/>
                              <path d="M9.13281 17.169V8.52699H10.8523V17.169H9.13281ZM5.67472 13.7045V11.9851H14.3168V13.7045H5.67472Z" fill="#8AC540"/>
                              </svg>
                          </button>
                      </div>
                      </div>    
                      <div>`;
  });

  if (drawAnswer) {
    drawAnswer.innerHTML = outAnswer;
  }
}

// создаём отображение только по избанным

function filterInFavorite() {
  let btnOnlyFavorite: Element | null = document.querySelector(".header-tabs_heart-button");

  if (btnOnlyFavorite) {
    btnOnlyFavorite.addEventListener("click", function () {
      saveCommentsFavorite();
      localCommentsFavorite();
    });
  }
}

filterInFavorite();

// записываем в Local только в избранное

function saveCommentsFavorite() {
  let commFav = comments.filter((item) => item.like === true);
  localStorage.setItem("commFav", JSON.stringify(commFav));
}

// отображаем из Local только в избранное

function localCommentsFavorite() {
  if (localStorage.getItem("commFav")) {
    comments = JSON.parse(localStorage.getItem("commFav") as string);
  }
  //сначала рисуем
  showComments();
  toggleHeart();
  changeRating();
  createAnswer();
  submitAnswer();
}

// фильтр по рейтингу

function saveCommentRating(): void {
  // сортируем и сохраняем рейтинг в Local
  let reverseRating: HTMLElement | null = document.querySelector(".svg-arrow");
  let commRat = comments.map((comment) => {
    return {
      data: comment.body,
      length: comment.body.length,
      ownerDocument: document,
      appendData: () => {},
      ...comment,
    };
  }).sort((a, b) => (a.ratingScore > b.ratingScore ? 1 : -1));

  if (reverseRating && !reverseRating.classList.contains("reverse-arrow")) {
    localStorage.setItem("commRat", JSON.stringify(commRat));
  } else {
    commRat.reverse();
    localStorage.setItem("commRat", JSON.stringify(commRat));
  }
}


function localCommentsRating(): void {
  // отображаем отсортированный рейтинг из Local
  let commRat: string | null = localStorage.getItem("commRat");

  if (commRat) {
    comments = JSON.parse(commRat);
  }
  //сначала рисуем
  showComments();
  toggleHeart();
  changeRating();
  createAnswer();
  submitAnswer();
}

// фильтр по актуальности

function saveCommentsRelevance(): void {
  // сортируем и сохраняем по актуальности в Local
  let reverseRating: HTMLElement | null = document.querySelector(".svg-arrow");
  let commRel = comments.sort((a, b) => (a.time > b.time ? 1 : -1));

  if (reverseRating && !reverseRating.classList.contains("reverse-arrow")) {
    localStorage.setItem("commRel", JSON.stringify(commRel));
  } else {
    commRel.reverse();
    localStorage.setItem("commRel", JSON.stringify(commRel));
  }
}

function localCommentsRelevance() {
  // отображаем отсортированный по актуальности из Local
  if (localStorage.getItem("commRel")) {
    comments = JSON.parse(localStorage.getItem("commRel") as string);
  }
  //сначала рисуем
  showComments();
  toggleHeart();
  changeRating();
  createAnswer();
  submitAnswer();
}

// фильтр по колличеству ответов

function saveCommentsAnswer(): void {
  // сортируем и сохраняем по колличеству ответов в Local
  let reverseRating: HTMLElement | null = document.querySelector(".svg-arrow");
  let commAns = comments.sort((a, b) => (a.answer > b.answer ? 1 : -1));

  if (reverseRating && !reverseRating.classList.contains("reverse-arrow")) {
    localStorage.setItem("commAns", JSON.stringify(commAns));
  } else {
    commAns.reverse();
    localStorage.setItem("commAns", JSON.stringify(commAns));
  }
}

function localCommentsAnswer() {
  // отображаем отсортированный по колличеству ответов из Local
  if (localStorage.getItem("commAns")) {
    comments = JSON.parse(localStorage.getItem("commAns") as string);
  }
  //сначала рисуем
  showComments();
  toggleHeart();
  changeRating();
  createAnswer();
  submitAnswer();
}

// условия отображения по Select (выподающее меню)

function filterSelect(textSelect: string | Element | null | undefined) {
  if (textSelect === "По дате") {
    localComments();
    showComments();
    saveCommentsRelevance();
    localCommentsRelevance();
  } else if (textSelect === "По актуальности") {
    localComments();
    showComments();
    saveCommentsRelevance();
    localCommentsRelevance();
  } else if (textSelect === "По количеству оценок") {
    localComments();
    showComments();
    saveCommentRating();
    localCommentsRating();
  } else if (textSelect === "По количеству ответов") {
    localComments();
    showComments();
    saveCommentsAnswer();
    localCommentsAnswer();
  }
}
