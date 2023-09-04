function createRequest(body, callback) {

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jscp-diplom.netoserver.ru/");

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")   //http заголовок

    xhr.responseType = "json";   //задаём тип ответа JSON

    xhr.send(body);

    
    xhr.onload = function() {
        let response = xhr.response;
        console.log(response)

        callback(response);
        
    };

    xhr.onerror = function() {
        console.log(error);
    };
};