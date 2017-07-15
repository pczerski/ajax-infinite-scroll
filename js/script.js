'use strict';

// Definicja funkcji Ajax
function ajax(ajaxOptions) {
    // Opcje połączenia i jego typu
    var options = {
        type: ajaxOptions.type || "POST",
        url: ajaxOptions.url || '',
        onError: ajaxOptions.onError || function () {},
        onSuccess: ajaxOptions.onSuccess || function () {},
        dataType: ajaxOptions.dataType || 'text'
    }

    function httpSuccess(httpRequest) {
        try {
            return (httpRequest.status >= 200 && httpRequest.status < 300 || httpRequest.status == 304 || navigator.userAgent.indexOf('Safari') >= 0 && typeof httpRequest.status == 'undefined');
        } catch (e) {
            return false;
        }
    }

    // Utworzenie obiektu XMLHTTPRequest - konieczne do użycia Ajaxu
    var httpReq = new XMLHttpRequest();

    // Otwarcie połączenia
    httpReq.open(options.type, options.url, true);

    // Sprawdzenie stanu połączenia - wywoływane za każdym razem gdy zmienia się ready state - od 0 do 4
    httpReq.onreadystatechange = function () {
        if (this.readyState == 4) {
            // Sprawdza status połczenie
            if (httpSuccess(this)) {
                //console.log('Połączenie działa');
                //console.log(this.readyState);
                //console.log(this.status);

                // Jesli dane w formacie XML, to zwróć obiekt responseXML, w innym razie responseText (JSON to tekst)
                var returnData = (options.dataType == 'xml') ? this.responseXML : this.responseText;
                //console.log(returnData); // Dostajemy na razie czysty tekst, który trzeba sparsować do JSONa

                options.onSuccess(returnData);

                httpReq = null; // Zerowanie połączenia, aby pobrać kolejne elementy
            } else {
                options.onError(console.log('błąd!'));
            }
        }
    }

    httpReq.send(); // Bez tego połączenie nie zadziała
}

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        ajax({
            type: "GET",
            url: 'https://jsonplaceholder.typicode.com/users',
            onError: function (msg) {
                console.log(msg);
            },
            onSuccess: function (response) {
                var jsonObjArray = JSON.parse(response);
                for (var i in jsonObjArray) {
                    var userId = document.createElement('p');
                    var userName = document.createElement('p');
                    var userURL = document.createElement('p');

                    userId.innerHTML = 'User ID: ' + jsonObjArray[i].id;
                    userName.innerHTML = 'User Name: ' + jsonObjArray[i].name;
                    userURL.innerHTML = 'User URL: ' + jsonObjArray[i].website + '<br>-------';

                    document.body.appendChild(userId);
                    document.body.appendChild(userName);
                    document.body.appendChild(userURL);
                }
            }
        })
    }
}
