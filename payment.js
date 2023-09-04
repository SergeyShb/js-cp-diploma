let seanceAndReservedChairInfo = JSON.parse(localStorage.seanceAndReservedChairInfo);   //считываем из localStorage объект seanceAndReservedChairInfo  
console.log(seanceAndReservedChairInfo);

let ticketTitle = document.querySelector(".ticket__title");
console.log(ticketTitle);

ticketTitle.innerText = seanceAndReservedChairInfo.filmName;   //добавляем название фильма

let ticketChairs = document.querySelector(".ticket__chairs");
console.log(ticketChairs);
ticketChairs.innerText = "";

//добавляем ряд и место которые выбирали
for (let i in seanceAndReservedChairInfo.rowChairSelectedArr) {

    if (i != seanceAndReservedChairInfo.rowChairSelectedArr.length - 1) {
        ticketChairs.innerText += " " + seanceAndReservedChairInfo.rowChairSelectedArr[i].row + "/" + seanceAndReservedChairInfo.rowChairSelectedArr[i].chair + ","; 
    } else {
        ticketChairs.innerText += " " + seanceAndReservedChairInfo.rowChairSelectedArr[i].row + "/" + seanceAndReservedChairInfo.rowChairSelectedArr[i].chair;
    }
    
};

let ticketHall = document.querySelector(".ticket__hall");
console.log(ticketHall);

//добавляем номер зала
ticketHall.innerText = seanceAndReservedChairInfo.hallName.replace(/\D/g, "");   //.replace(/\D/g, "") - убираем все символы кроме цифр

let ticketStart = document.querySelector(".ticket__start");
console.log(ticketStart);

ticketStart.innerText = seanceAndReservedChairInfo.seanceStartTime;   //добавляем время начала фильма

let ticketCost = document.querySelector(".ticket__cost");
console.log(ticketCost);

ticketCost.innerText = seanceAndReservedChairInfo.ticketPaymentSum;   //добавляем стоимость билеов


let acceptinButton = document.querySelector(".acceptin-button");   //кнопка "получить код бронирования"
console.log(acceptinButton);

//при клике на кнопку бронируем места и отправляем разметку с выбранными местами на сервер
acceptinButton.addEventListener("click", () => {

    // POST запрос который будем передавать
    let body = `event=sale_add&timestamp=${seanceAndReservedChairInfo.timestamp}&hallId=${seanceAndReservedChairInfo.hallId}&seanceId=${seanceAndReservedChairInfo.seanceId}&hallConfiguration=${seanceAndReservedChairInfo.hallConfig}`;    

    //вызываем функцию создания HTTP - запроса к серверу createRequest
    createRequest(body);

});