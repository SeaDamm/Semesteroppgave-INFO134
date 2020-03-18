var befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json";
//var befolkning = "https://no.wikipedia.org/wiki/John_King_Davis"

function load(url){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            console.log(response)
            //console.log(xhr.response)
            //var response = xhr.responseText
            //console.log(response);
        }
    };
    xhr.send()
}
