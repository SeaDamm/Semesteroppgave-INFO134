var befolkningUrl = "http://wildboy.uib.no/~tpe056/folk/104857.json";
var sysselsatteUrl = "http://wildboy.uib.no/~tpe056/folk/100145.json"
var utdanningUrl = "http://wildboy.uib.no/~tpe056/folk/85432.json"
//var befolkning = "https://no.wikipedia.org/wiki/John_King_Davis"


function Data(url, output)
{
  this.data = {}
  this.load = function(callback, loadText) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      if(loadText){
        document.getElementById("loading").innerHTML = "LOADING"
      }
      xhr.onreadystatechange = function(){
          if (xhr.readyState === 4 && xhr.status === 200) {
              document.getElementById("loading").innerHTML = ""

              response = JSON.parse(xhr.responseText);
              console.log(response)
              callback(response)
              //callback(data)
              //console.log(xhr.response)
              //var response = xhr.responseText
              //console.log(response);
          }
      };
      xhr.send()
  }

  /*this.load = function(response) {
    //console.log(response)
    //this.data["contents"] = response
    //return this.data
  }*/
  this.url = url;


  listElement = document.getElementById("list")

  this.getNames = function() {
    function hentKommuner(response) {
      if(response.elementer){
        textOutput = "<ul>"
        for (var kommune in response.elementer) {
          textOutput += "<li>"+kommune+"</li>"
        }
        listElement.innerHTML = textOutput + "</ul>"
      } else {
        listElement.innerHTML = "Kunne ikke finne kommunene"
      }
    }

    this.load(hentKommuner)
  }

  this.getIDs = function() {
    function hentNummere(response) {
      kommuner = response.elementer
      if(kommuner) {
        textOutput = "<ul>"
        for (var kommune in kommuner) {
          textOutput += "<li>"+kommuner[kommune].kommunenummer+" - "+kommune+"</li>"
        }
        listElement.innerHTML = textOutput + "</ul>"
      } else {
        listElement.innerHTML = "Kunne ikke finne kommunene"
      }
    }
    this.load(hentNummere)
  }

  this.getInfo = function(kommunenummer) {
    /*for (var number in kommunenummer) {
      console.log(number)
    }*/
    function hentInfo(response) {
      kommuner = response.elementer
      if(kommuner) {
        for (var kommune in kommuner) {
          if(kommuner[kommune].kommunenummer == kommunenummer) {
            console.log(kommuner[kommune]);
            return
          }
        }
        listElement.innerHTML = "Kunne ikke finne noen kommuner med tilsvarende kommunenummer"
      } else {
        listElement.innerHTML = "Klarer ikke å finne noen kommuner i JSON-filen"
      }
    }
  this.load(hentInfo)
  }
}




/*

function printKommuner(names) {
  var nameList = document.getElementById("namelist");//document.getElementById('namelist');
  console.log(names)
  if(names)
  {
    textOutput = "<ul>"
    for (var kommune in befolkning.getNames) {
      textOutput += "<li>"+kommune+"</li>";
    }


    nameList.innerHTML = textOutput;
  } else {
  nameList.innerHTML = "Klarte ikke å finne kommunene";
  }
}
*/

window.onload = function() {
  befolkning = new Data("http://wildboy.uib.no/~tpe056/folk/104857.json")
  //printKommuner(befolkning.getNames(befolkning.load(befolkning.getNames)));
}
