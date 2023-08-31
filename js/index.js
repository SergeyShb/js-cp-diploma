let date = new Date();   //текущие время и дата
console.log(date);

let monthDate = date.getDate();   //получаем сегодняшнее число месяца
console.log(monthDate);



let pageNavDay = Array.from(document.querySelectorAll(".page-nav__day"));   //все вкладки дат 
console.log(pageNavDay);

//убираем выделение красным входного дня
let indexOfActiveWeekendDay = pageNavDay.findIndex(item => item.classList.contains("page-nav__day_weekend")) ;   //ищем индекс дня недели который выделен красным как выходной
pageNavDay[indexOfActiveWeekendDay].classList.remove("page-nav__day_weekend");

//убираем рандомную активную вкладку
let indexOfChosenDay = pageNavDay.findIndex(item => item.classList.contains("page-nav__day_chosen")) ;   //ищем индекс выбранной вкладки
pageNavDay[indexOfChosenDay].classList.remove("page-nav__day_chosen");

//let timestamp;


for (let i = 0; i < pageNavDay.length; i++) {
    
    //изменение вкладки по клику
    pageNavDay[i].addEventListener("click", (event) => {
        event.preventDefault();
        let indexOfActivePageDay = pageNavDay.findIndex(item => item.classList.contains("page-nav__day_chosen")) ;   //ищем индекс активной вкладки
        console.log(indexOfActivePageDay);

        pageNavDay[indexOfActivePageDay].classList.remove("page-nav__day_chosen");
        pageNavDay[i].classList.add("page-nav__day_chosen");


        //устанавливаем новую дату при нажатии на новую вкладку

        let timeAtTheMoment = new Date();   //текущие время и дата в настоящий момент при клике
        console.log(timeAtTheMoment);
        let dateOnSelectedTab = timeAtTheMoment.getDate() + i   //дата на выбранной вкладке
        console.log(dateOnSelectedTab);
        dateOnSelectedDayinMilliseconds = timeAtTheMoment.setDate(dateOnSelectedTab);   //время и дата в выбранный день в миллисекундах
        console.log(dateOnSelectedDayinMilliseconds);
        let dateOnSelectedDay = new Date(dateOnSelectedDayinMilliseconds);   //переводим миллисекунды в дату и время
        console.log(dateOnSelectedDay);

        date = dateOnSelectedDay;   //устанавливаем новую дату

        settingTimestamp();   //вызываем функцию определения и добавления timestamp

    });


    //установка актуальных дат на вкладках
    let currentDate = new Date();   //создаем новый экземпляр даты
    currentDate.setDate(monthDate + i);   //устанавливаем в новый экземпляр даты новое число месяца (произойдет корректировка даты если получится несуществующее число месяца, (например 32 станет 1))
    pageNavDay[i].querySelector(".page-nav__day-number").textContent = currentDate.getDate();   //установка актуальной даты на вкладке
    
   
    //делаем активной вкладку с текущей датой
    if(pageNavDay[i].querySelector(".page-nav__day-number").textContent == monthDate) {
        pageNavDay[i].classList.add("page-nav__day_chosen");
    };
    

    //установка актуальных дней недели на вкладках
    let daysOnTabs = date.getDate() + i   //получаем день месяца и прибавляем i
    console.log(daysOnTabs);

    let settingDaysOnTabs = date.setDate(daysOnTabs)   //установливаем дату из daysOnTabs
    console.log(settingDaysOnTabs);

    let weekday = date.toLocaleDateString("ru-Ru", { weekday: "short" })   //получаем день недели
    console.log(weekday);

    pageNavDay[i].querySelector(".page-nav__day-week").textContent = weekday;

    date = new Date();   //сброс времени и даты на текущие (чтобы в следующей итерации не было суммирования дат)


    //делаем выходные дни красным цветом
    if(pageNavDay[i].querySelector(".page-nav__day-week").textContent === "сб" || pageNavDay[i].querySelector(".page-nav__day-week").textContent === "вс") {
        pageNavDay[i].classList.add("page-nav__day_weekend");       
    };


};




let xhr = new XMLHttpRequest();
xhr.open("POST", "https://jscp-diplom.netoserver.ru/");

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");   //http заголовок

xhr.responseType = "json";   //задаём тип ответа JSON

xhr.send("event=update");

xhr.onload = function() {
    xhr.response;
    console.log(xhr.response);
    console.log(xhr.getAllResponseHeaders());



    let main = Array.from(document.getElementsByTagName("main"))[0];   //получаем тэг main 
    console.log(main);

    main.innerHTML = "";   //удаляем всю html разметку внутри тэга main


    for (let i in xhr.response.films.result) {
        main.insertAdjacentHTML("beforeEnd", `

            <section class="movie">

                <div class="movie__info">
                    <div class="movie__poster">
                        <img class="movie__poster-image" alt=" ` + xhr.response.films.result[i].film_name + ` постер" src=" ` + xhr.response.films.result[i].film_poster + ` ">
                    </div>
                    <div class="movie__description">
                        <h2 class="movie__title"> ` + xhr.response.films.result[i].film_name + ` </h2>
                        <p class="movie__synopsis"> ` + xhr.response.films.result[i].film_description + ` </p>
                        <p class="movie__data">
                            <span class="movie__data-duration"> ` + xhr.response.films.result[i].film_duration + `  минут</span>
                            <span class="movie__data-origin"> ` + xhr.response.films.result[i].film_origin + ` </span>
                        </p>
                    </div>
                </div>  

            </section>    

        `);

        

        let filmId = xhr.response.films.result[i].film_id
        console.log(filmId);

        //находим добавленный элемент и дабавляем к нему дата-атрибут filmId
        let movieInfo = main.lastElementChild.querySelector(".movie__info");   //=========================================
        console.log(movieInfo);
        movieInfo.dataset.filmId = filmId;   //добавляем дата-атрибут со значением filmId



        let seanceFilmId = xhr.response.seances.result.filter(item => item.seance_filmid === filmId);   //получили массив объектов с сеансами (для данного фильма)
        console.log(seanceFilmId);

        let seancesTime = seanceFilmId.map(item => item.seance_time);   //получили массив с элеметами времени начала сеанса
        console.log(seancesTime);

        let seanceHallId = seanceFilmId.map(item => item.seance_hallid);   //из массива объектов с сеансами, извлекли только значения seance_hallid 
        console.log(seanceHallId);

        seanceHallId = Array.from(new Set(seanceHallId));   //убрали повторяющиеся значения seance_hallid (залы)
        console.log(seanceHallId);






        let hallsAndFilmsInfoArr = [];   
        

        //создаем массив объектов только с залами в которых показывают данный фильм 
        for (let i = 0; i < seanceHallId.length; i++) {
            console.log("начало")
            
            hallsFilms = xhr.response.halls.result.find(item => item.hall_id === seanceHallId[i]);   //находим объект в котором есть название нужного зала
            console.log(hallsFilms);

            //проверяем если у зала hall_open === "1" значит зал открыт и показываем его на странице
            if(hallsFilms.hall_open === "1") {

                //здесь находим все что звязанно с залами (halls)

                let hallName = hallsFilms.hall_name;   //   название зала
                console.log(hallName);
                
                let hallId = hallsFilms.hall_id;   //ID зала
                console.log(hallId);

                let hallPriceStandart = hallsFilms.hall_price_standart;   //цена стандартного билета
                console.log(hallPriceStandart);

                let hallPriceVip = hallsFilms.hall_price_vip;   //цена VIP билета
                console.log(hallPriceVip);

                let hallConfig = hallsFilms.hall_config;   //конфигурфция зала (html)
                console.log(hallConfig);




                //здесь находим всё что связанно с сеансами (seanses)

                let hallSeances = seanceFilmId.filter(item => item.seance_hallid === seanceHallId[i]).map(item => item.seance_time)   //значение (время)
                console.log(hallSeances);

                let seancesId = seanceFilmId.filter(item => item.seance_hallid === seanceHallId[i]).map(item => item.seance_id)   //seance_id для данного фильма в данном зале
                console.log(seancesId);

                let seancesStartInMinutes = seanceFilmId.filter(item => item.seance_hallid === seanceHallId[i]).map(item => item.seance_start)   //seance_start (начало сеанса в минутах) для данного фильма в данном зале
                console.log(seancesStartInMinutes);

                
    

                //добавляем найденные значения и массивы в объект

                hallsAndFilmsInfoArr.push({
                    name: hallName, 
                    time: hallSeances, 
                    seansesID: seancesId, 
                    seancesStartInMinutes: seancesStartInMinutes, 
                    hallID: hallId, 
                    priceStandart: hallPriceStandart, 
                    priceVip: hallPriceVip,
                    hallConfig: hallConfig
                });
                console.log(hallsAndFilmsInfoArr);

            };

            

            console.log("конец итерации");
        };

        hallsAndFilmsInfoArr.sort((x, y) => x.name.localeCompare(y.name));   //сортируем по названию зала
        

        


        let section = Array.from(document.getElementsByTagName("section"))[i];
        console.log(section);

        for (let j = 0; j < hallsAndFilmsInfoArr.length; j++) {

            section.insertAdjacentHTML("beforeEnd", `

                <div class="movie-seances__hall">
                    <h3 class="movie-seances__hall-title"> ` + hallsAndFilmsInfoArr[j].name + ` </h3>
                    <ul class="movie-seances__list">
                        
                    </ul>
                </div>
            
            `);

            //находим добавленный элемент и добавляем для него дата-атрибуты
            let movieSeancesHall = Array.from(main.lastElementChild.querySelectorAll(".movie-seances__hall"));   //=========================================
            let lastMovieSeancesHall = movieSeancesHall[movieSeancesHall.length - 1]
            console.log(lastMovieSeancesHall);
            lastMovieSeancesHall.dataset.filmName = xhr.response.films.result[i].film_name   //добавляем дата-атрибут с названием фильма
            lastMovieSeancesHall.dataset.hallName = hallsAndFilmsInfoArr[j].name   //добавляем дата-атрибут с названием зала
            lastMovieSeancesHall.dataset.hallId = hallsAndFilmsInfoArr[j].hallID;   //добавляем дата-атрибут со значением hallId
            lastMovieSeancesHall.dataset.priceStandart = hallsAndFilmsInfoArr[j].priceStandart;   //добавляем дата-атрибут со значением цены стандартного билета
            lastMovieSeancesHall.dataset.priceVip = hallsAndFilmsInfoArr[j].priceVip;   //добавляем дата-атрибут со цены VIP билета
            lastMovieSeancesHall.dataset.hallConfig = hallsAndFilmsInfoArr[j].hallConfig   //добавляем дата-атрибут с конфигурацией зала             



            let ul = Array.from(section.getElementsByTagName("ul"))[j];
            console.log(ul);

            let seances = hallsAndFilmsInfoArr[j].time;
            console.log(seances);

            for (let k = 0; k < seances.length; k++) {

                ul.insertAdjacentHTML("beforeEnd", `

                    <li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"> ` + seances[k] + ` </a></li>

                `);

                let movieSeancesTime = Array.from(lastMovieSeancesHall.querySelectorAll(".movie-seances__time"));
                let lastMovieSeancesTime = movieSeancesTime[movieSeancesTime.length - 1];
                console.log(lastMovieSeancesTime);
                lastMovieSeancesTime.dataset.seanceStartTime = seances[k];
                lastMovieSeancesTime.dataset.seansesId = hallsAndFilmsInfoArr[j].seansesID[k];
                lastMovieSeancesTime.dataset.seancesStartInMinutes = hallsAndFilmsInfoArr[j].seancesStartInMinutes[k];


                settingTimestamp()   //вызываем функцию определения и добавления timestamp

                
                console.log(date);
                
            };


        };


    };

                     

    let movieSeancesTime = Array.from(document.querySelectorAll(".movie-seances__time"));
    console.log(movieSeancesTime);

    for (let i = 0; i < movieSeancesTime.length; i++) {


        movieSeancesTime[i].addEventListener("click", () => {

    
            localStorage.setItem("seanceInfo", JSON.stringify(movieSeancesTime[i].dataset));   //записываем в localStorage объект movieSeancesTime[i].dataset (информация о сеансе) для передачи на лругую страницу
            console.log(localStorage.seanceInfo);

            localStorage.setItem("hallInfo", JSON.stringify(movieSeancesTime[i].closest(".movie-seances__hall").dataset));   //записываем в localStorage объект (информация о зале) для передачи на другую страницу
            console.log(localStorage.hallInfo);


        });

        
    };


};





//функция определения timestamp для каждого элемента времени сеанса и добавления его в дата-атрибут
function settingTimestamp() {
    let movieSeancesTime = Array.from(document.querySelectorAll(".movie-seances__time"));

    for (let i = 0; i < movieSeancesTime.length; i++) {

        let dateMidnightOnSelectedDay = Math.trunc(date.setHours(0, 0, 0) / 1000);       //устанавливаем 00 часов, 00 минут, 00 секунд для даты выбранного дня и переводим в секунды
        console.log(dateMidnightOnSelectedDay);
        let seanceStartTime = movieSeancesTime[i].dataset.seancesStartInMinutes * 60;   //время начала сеанса в секундах  
        console.log(seanceStartTime);
        let timestamp = dateMidnightOnSelectedDay + seanceStartTime;   //timestamp время начала сеанса в секундах
        console.log(timestamp); 

        movieSeancesTime[i].dataset.timestamp = timestamp;   //добавляем дата-атрибут timestamp
        console.log(movieSeancesTime[i].dataset);

        let dateNow = new Date();   //дата и время в данный момент
        console.log(dateNow);
        let dateNowTimestamp = Math.trunc(dateNow / 1000);   //timestamp даты и времени в данный момент
        console.log(dateNowTimestamp);


        //если timestamp времени начала сеанса меньше чем timestamp времени в данный момент, то делаем элемент неактивным, иначе делаем его активным 
        if (timestamp < dateNowTimestamp) {
            movieSeancesTime[i].classList.add("acceptin-button-disabled");
        } else {
            movieSeancesTime[i].classList.remove("acceptin-button-disabled");
        };

    };

};