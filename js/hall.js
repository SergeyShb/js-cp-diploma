let seanceInfo = JSON.parse(localStorage.seanceInfo);   //считываем из localStorage объект seanceInfo 
console.log(seanceInfo);

let hallInfo = JSON.parse(localStorage.hallInfo);   //считываем из localStorage объект hallInfo
console.log(hallInfo);

let buyingInfoTitle = document.querySelector(".buying__info-title");
console.log(buyingInfoTitle);

buyingInfoTitle.innerText = hallInfo.filmName;   //добавляем название фильма

let = buyingInfoStart = document.querySelector(".buying__info-start");
console.log(buyingInfoStart);

buyingInfoStart.innerText = "Начало сеанса: " + seanceInfo.seanceStartTime;   //добавляем время начала сеанса


let buyingInfoHall = document.querySelector(".buying__info-hall");
console.log(buyingInfoHall);

buyingInfoHall.innerText = hallInfo.hallName;   //добавляем название зала

let priceStandart = document.querySelector(".price-standart");
console.log(priceStandart);

priceStandart.innerText = hallInfo.priceStandart;   //добавляем цену за стандартное 

let priceVip = document.querySelector(".price-vip");
console.log(priceVip);

priceVip.innerText = hallInfo.priceVip;   //добавляем цену за vip


let confStepWrapper = document.querySelector(".conf-step__wrapper");   //место разметки посадчных мест
console.log(confStepWrapper);
confStepWrapper.innerHTML = "";   //удаляем всю html разметку внутри тэга <div class="conf-step__wrapper">


let reservedChairInfoObject = {};   //создаём объект для записи информации о выбранных местах 

reservedChairInfoObject.filmName = hallInfo.filmName;
reservedChairInfoObject.hallName = hallInfo.hallName;
reservedChairInfoObject.seanceStartTime = seanceInfo.seanceStartTime;
reservedChairInfoObject.seanceId = seanceInfo.seansesId;
reservedChairInfoObject.hallId = hallInfo.hallId;
reservedChairInfoObject.timestamp = seanceInfo.timestamp;

console.log(reservedChairInfoObject);



let body = `event=get_hallConfig&timestamp=${seanceInfo.timestamp}&hallId=${hallInfo.hallId}&seanceId=${seanceInfo.seansesId}`;   // POST запрос который будем передавать

//вызываем функцию создания HTTP - запроса к серверу createRequest
createRequest(body, (response) => {

    console.log(response);

    if (response === null) {
        confStepWrapper.insertAdjacentHTML("beforeEnd", hallInfo.hallConfig );
    } else {
        confStepWrapper.insertAdjacentHTML("beforeEnd", response );
    };


    let confStepRow = Array.from(confStepWrapper.querySelectorAll(".conf-step__row"));   //находим все ряды в разметке
    console.log(confStepRow);

    let ticketPaymentSum = 0;   //переменная для суммы цен билетов
    let chairSelectedArr = [];   //массив для объектов выбранных ряда места

    for (let i = 0; i < confStepRow.length; i++) {

        let confStepChair =  Array.from(confStepRow[i].querySelectorAll(".conf-step__chair"));   //находим все места в ряде  
        console.log(confStepChair);

        for (let j = 0; j < confStepChair.length; j++) {

            //при клике на место
            confStepChair[j].addEventListener("click", (event) => {

            console.log("Ряд " + (i + 1));
            console.log("Место " + (j + 1));



                if ( event.target.classList.contains("conf-step__chair_disabled") === false ) {   //проверяем не отключено ли место
                    if ( event.target.classList.contains("conf-step__chair_taken") === false ) {   //проверяем не занято ли место

                        event.target.classList.toggle("conf-step__chair_selected");   //при клике выбираем или отменяем выбор места

                        //при клике и выборе или отмене выбора места, прибавляем или вычитаем стоимость билета за это место
                        if (event.target.classList.contains("conf-step__chair_selected")) {   //если выбранный элемент содержит класс выбранного места  

                            if (event.target.classList.contains("conf-step__chair_standart")) {
                                ticketPaymentSum += Number(hallInfo.priceStandart);
                            } else {
                                ticketPaymentSum += Number(hallInfo.priceVip);
                            }

                        } else {

                            if (event.target.classList.contains("conf-step__chair_standart")) {
                                ticketPaymentSum -= Number(hallInfo.priceStandart);
                            } else {
                                ticketPaymentSum -= Number(hallInfo.priceVip);
                            }

                        };

                        //при клике и выборе или отмене выбора места, добавляем в массив объект с рядом и местом или удаляем массив из объекта
                        if (event.target.classList.contains("conf-step__chair_selected")) {
                            chairSelectedArr.push({ row: i + 1, chair: j + 1 });  
                        } else {
                            let chairSelectedIndex;
                           
                            for (let k = 0; k < chairSelectedArr.length; k++ ) {
                                if (chairSelectedArr[k].row === i + 1 && chairSelectedArr[k].chair === j + 1) {
                                    chairSelectedIndex = k;
                                }
                            }

                            chairSelectedArr.splice(chairSelectedIndex, 1);

                        };

                       
                        console.log(ticketPaymentSum);
                        console.log(chairSelectedArr);

                    };

                };

            });


        };
       

    };
    


    let acceptinButton = document.querySelector(".acceptin-button");
    console.log(acceptinButton);

    acceptinButton.addEventListener("click", () => {

        if (ticketPaymentSum === 0) {
            alert("Вы не выбрали ни одного места")
        } else {

            reservedChairInfoObject.ticketPaymentSum = ticketPaymentSum;   //добавляем в объект сумму за выбранные места
            reservedChairInfoObject.rowChairSelectedArr = chairSelectedArr;   //добавляем в объект массив объектов выбранных мест (ряд место)

            let hallConfig = document.querySelector(".conf-step__wrapper").innerHTML ;   //находим html разметку которая находится внутри тэга <div class="conf-step__wrapper">     
            console.log(hallConfig);

            reservedChairInfoObject.hallConfig = hallConfig;   //добавляем в объект разметку с выбранными местами

            console.log(reservedChairInfoObject);


            localStorage.setItem("seanceAndReservedChairInfo", JSON.stringify(reservedChairInfoObject));   //записываем в localStorage объект reservedChairInfoObject (информация о сеансе и забронированных местах) для передачи на другую страницу
            console.log(localStorage.seanceInfo);

            window.location.href = "payment.html";   //при клике на кнопку переход на страницу покупки

        };

    
    });


});