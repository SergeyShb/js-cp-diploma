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



let ticketInfoQr = document.querySelector(".ticket__info-qr");   //элемент с qr кодом
console.log(ticketInfoQr);



//получение даты (день-месяц-год) из timestamp
let filmDateTimestamp = seanceAndReservedChairInfo.timestamp;   //timestamp из объекта seanceAndReservedChairInfo 
let filmDateOnMilliseconds = filmDateTimestamp * 1000;   //умножаем timestamp на 1000 чтобы перевести в миллисекунды
let filmFullDate = new Date(filmDateOnMilliseconds)   //переводим миллисекунды в полную дату 
console.log(filmFullDate);

let day = filmFullDate.getDate();
let month = filmFullDate.getMonth() + 1;
let year = filmFullDate.getFullYear();

let filmDate = day + "-" + month + "-" + year;
console.log(filmDate);



let qr = QRCreator(`Фильм: ` + seanceAndReservedChairInfo.filmName +`; Зал: ` + ticketHall.innerText +`; Ряд/Место: ` + ticketChairs.innerText + `; Дата: ` + filmDate +`; Начало сеанса: ` + seanceAndReservedChairInfo.seanceStartTime, 
{
    image: "SVG"   //задаем формат SVG
});


const content = (qrcode) => {
    return qrcode.error ? `недопустимые исходные данные ${qrcode.error}` : qrcode.result;
}

console.log(qr.result);   //результат в формате SVG 

ticketInfoQr.outerHTML = ` <div class="ticket__info-qr"></div> `;   //вместо <img> создаем <div>

let infoQr = document.querySelector(".ticket__info-qr");   //находим созданный <div>
infoQr.append(content(qr));   //добавляем внутри <div> SVG


//удаляем из localStorage всю информацию которую передавали между страницами
localStorage.removeItem("seanceInfo");
localStorage.removeItem("hallInfo");
localStorage.removeItem("seanceAndReservedChairInfo");

