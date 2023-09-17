class Navigation {
  selectHeader: NodeListOf<Element>;
  selectItem: NodeListOf<Element>;
  selectArrow: Element | null;
  select: Element | null;
  text?: Element | null;
  innerText?: Element | null;
  parentElement?: Element | null | undefined;
  numberComments: Element | number | string | null;
  btnOnlyFavorite: any;
  closest: any;
  classList: any;
  currentText: any;
  commFav: any;

  constructor() {
    this.selectHeader = document.querySelectorAll(".header-tabs_select-header");
    this.selectItem = document.querySelectorAll(".header-tabs_select-item");
    this.selectArrow = document.querySelector(".svg-arrow");
    this.select = document.querySelector(".header-tabs_select-current");
    this.text = this.text;
    this.innerText = this.innerText;
    this.numberComments = document.getElementById("numberOfComments");
    this.btnOnlyFavorite = document.querySelector(".header-tabs_heart-button");
  }
  // создание селекта
  //  то есть сюда переписываем функцию select
  selectitems() {
    this.selectHeader.forEach((item) => {
      item.addEventListener("click", this.selectToggle); // переключаем класс .is-active у .header-tabs_select показывая .header-tabs_select-body.
      item.addEventListener("click", this.reverseTriangle);
    });

    this.selectItem.forEach((item) => {
      //нажимаем на пункты .header-tabs_select-body и записываем в .header-tabs_select-current.
      item.addEventListener("click", this.selectChoose);
    });
  }

  selectToggle() {
    const parent = this.parentElement;
    if (parent) {
      parent.classList.toggle("is-active");
    }
  }

  reverseTriangle() {
    if (navigation.selectArrow) {
      navigation.selectArrow.classList.toggle("reverse-arrow");
    } // переворачиваем треугольник svg
  }
  // Опциональная цепочка ?. останавливает вычисление и возвращает undefined, если значение перед ?. равно undefined или null
  selectChoose() {
    //записываем в text пункт на который мы нажимаем
    this.text = this.innerText;
    // возвращает ближайший родительский элемент (или сам элемент - .header-tabs_select)
    this.select = this.closest(".header-tabs_select");
    // записываем то что у нас в .header-tabs_select-current
    this.currentText = this.select?.querySelector(
      ".header-tabs_select-current"
    );
    //записываем в .header-tabs_select-current то что у нас в text
    this.currentText.innerText = this.text;
    // убираем .is-active и .header-tabs_select-body пропадает
    this.select?.classList.remove("is-active");

    filterSelect(this.text);

    navigation.removeCheckMarkClass(); //убираем галочку
    this.classList?.add("check-mark"); // дабавляем галочку на выбранный пункт
  }

  filterSelect(textSelect: string) {
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

  removeCheckMarkClass() {
    this.selectItem.forEach((item) => {
      item.classList.remove("check-mark"); // удаляем класс .check-mark (убираем галочку)
    });
  }

  showNumberComments() {
    const numberComments = this.numberComments as HTMLElement;
    if (numberComments) {
      numberComments.innerHTML = `<p class="numOfCom"> Комментарии <span class="numSpan">(${comments.length})</span></p>`;
    }
  }

  filterInFavorite() {
    this.btnOnlyFavorite.addEventListener("click", function () {
      navigation.saveCommentsFavorite();
      navigation.localCommentsFavorite();
    });
  }

  saveCommentsFavorite() {
    this.commFav = comments.filter((item) => item.like === true);
    localStorage.setItem("commFav", JSON.stringify(this.commFav));
  }

  localCommentsFavorite() {
    if (localStorage.getItem("commFav")) {
      comments = JSON.parse(localStorage.getItem("commFav") || '{}');
    }
    //сначала рисуем
    showComments();
    toggleHeart();
    changeRating();
    createAnswer();
    submitAnswer();
  }
}

let navigation = new Navigation();
navigation.selectitems();
navigation.filterInFavorite();
