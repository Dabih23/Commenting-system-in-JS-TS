var Navigation = /** @class */ (function () {
    function Navigation() {
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
    Navigation.prototype.selectitems = function () {
        var _this = this;
        this.selectHeader.forEach(function (item) {
            item.addEventListener("click", _this.selectToggle); // переключаем класс .is-active у .header-tabs_select показывая .header-tabs_select-body.
            item.addEventListener("click", _this.reverseTriangle);
        });
        this.selectItem.forEach(function (item) {
            //нажимаем на пункты .header-tabs_select-body и записываем в .header-tabs_select-current.
            item.addEventListener("click", _this.selectChoose);
        });
    };
    Navigation.prototype.selectToggle = function () {
        this.parentElement.classList.toggle("is-active");
    };
    Navigation.prototype.reverseTriangle = function () {
        navigation.selectArrow.classList.toggle("reverse-arrow"); // переворачиваем треугольник svg
    };
    // Опциональная цепочка ?. останавливает вычисление и возвращает undefined, если значение перед ?. равно undefined или null
    Navigation.prototype.selectChoose = function () {
        var _a, _b, _c;
        //записываем в text пункт на который мы нажимаем
        this.text = this.innerText;
        // возвращает ближайший родительский элемент (или сам элемент - .header-tabs_select)
        this.select = this.closest(".header-tabs_select");
        // записываем то что у нас в .header-tabs_select-current
        this.currentText = (_a = this.select) === null || _a === void 0 ? void 0 : _a.querySelector(".header-tabs_select-current");
        //записываем в .header-tabs_select-current то что у нас в text
        this.currentText.innerText = this.text;
        // убираем .is-active и .header-tabs_select-body пропадает
        (_b = this.select) === null || _b === void 0 ? void 0 : _b.classList.remove("is-active");
        filterSelect(this.text);
        navigation.removeCheckMarkClass(); //убираем галочку
        (_c = this.classList) === null || _c === void 0 ? void 0 : _c.add("check-mark"); // дабавляем галочку на выбранный пункт
    };
    Navigation.prototype.filterSelect = function (textSelect) {
        if (textSelect === "По дате") {
            localComments();
            showComments();
            saveCommentsRelevance();
            localCommentsRelevance();
        }
        else if (textSelect === "По актуальности") {
            localComments();
            showComments();
            saveCommentsRelevance();
            localCommentsRelevance();
        }
        else if (textSelect === "По количеству оценок") {
            localComments();
            showComments();
            saveCommentRating();
            localCommentsRating();
        }
        else if (textSelect === "По количеству ответов") {
            localComments();
            showComments();
            saveCommentsAnswer();
            localCommentsAnswer();
        }
    };
    Navigation.prototype.removeCheckMarkClass = function () {
        this.selectItem.forEach(function (item) {
            item.classList.remove("check-mark"); // удаляем класс .check-mark (убираем галочку)
        });
    };
    Navigation.prototype.showNumberComments = function () {
        this.numberComments.innerHTML = "<p class=\"numOfCom\"> \u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 <span class=\"numSpan\">(".concat(comments.length, ")</span></p>");
    };
    Navigation.prototype.filterInFavorite = function () {
        this.btnOnlyFavorite.addEventListener("click", function () {
            navigation.saveCommentsFavorite();
            navigation.localCommentsFavorite();
        });
    };
    Navigation.prototype.saveCommentsFavorite = function () {
        this.commFav = comments.filter(function (item) { return item.like === true; });
        localStorage.setItem("commFav", JSON.stringify(this.commFav));
    };
    Navigation.prototype.localCommentsFavorite = function () {
        if (localStorage.getItem("commFav")) {
            comments = JSON.parse(localStorage.getItem("commFav"));
        }
        //сначала рисуем
        showComments();
        toggleHeart();
        changeRating();
        createAnswer();
        submitAnswer();
    };
    return Navigation;
}());
var navigation = new Navigation();
navigation.selectitems();
navigation.filterInFavorite();
