// writes new line to a given element and automatically adds line break
function newLine(element, text, br = 1) {
  element.innerHTML += text
  if(br) {
    element.innerHTML += "<br>"
  }
}

// Finds last index of array. i is last index of array
function lastIndex(arr, i = 1) {
  return arr[arr.length - i]
}

function toArray(obj) { // Converts Object to array
  return Object.keys(obj);
}


function writeOverview(obj) {

  var list = document.createElement("ul");
  for (kommune of obj.getNames()){
    var info = obj.data.elementer[kommune]

    var paragraph = document.createElement("li");
    newLine(paragraph, "<h2>" + kommune + "</h2>", 0)

    newLine(paragraph, "Kommunenummer: " + info.kommunenummer)

// Total population for the dataset's last year
    var mennArray = toArray(info.Menn)
    var kvinnerArray = toArray(info.Kvinner)

    function beregnBefolkning(year) {
      var result = info.Menn[lastIndex(mennArray, year)]
      result += info.Kvinner[lastIndex(kvinnerArray, year)]
      return result
    }

    var befolkningSum = beregnBefolkning(1)

    newLine(
      paragraph,
      "<h3>Total befolkning (" + lastIndex(mennArray) + ")</h3>",
      0
    )
    newLine(paragraph, "Befolkningstall: " + befolkningSum)

    // increment in population
    var befolkningSumFjor = beregnBefolkning(2)
    var vekstProsent = (Math.round((befolkningSum / befolkningSumFjor) * 1000) - 1000) / 10
    newLine(paragraph, "Vekst siden i fjor (%): " + vekstProsent)


    list.appendChild(paragraph);
 }
 var element = document.getElementById("oversikt");
 element.appendChild(list);
}









function writeDetails(befolkObj, sysselObj, utdanningObj, input) {
  var detailsElem = document.getElementById("kommunedetaljer").children
  var elements = {} // dictionary for all children of "kommunedetaljer"
  for(var element in detailsElem) {
    elements[detailsElem[element].id] = detailsElem[element]
  }

  var befolkning = befolkObj.data.elementer;
  var sysselsatte = sysselObj.data.elementer;
  var utdanning = utdanningObj.data.elementer;

  for(var kommune in befolkning) {
    if(kommuner[kommune].kommunenummer == input) {
      befolkningInfo = befolkning[kommune]
      sysselsatteInfo = sysselsatte[kommune]
      utdanningInfo = utdanning[kommune]
      kommuneNavn = kommune
      break;
    }
  }

  if(befolkningInfo) {
    elements.header.innerHTML = kommuneNavn
    elements.kommunenr.innerHTML = befolkningInfo.kommunenummer
    elements.befolkningnr.innerHTML = befolkningInfo.
  } else {
    elements.header.innerHTML = "Vi fant ingen kommuner med kommunenummer " + input
  }

}




/*
Som i “detaljer” skal dere i utgangspunktet ikke vise noe informasjon her, men brukeren skal kunne skrive inn to gyldige kommunenummere. Når brukeren skriver inn dette, så skal dere vise utdanningsdata for det siste året (som datasettet dekker) innen kjønnskategoriene “Menn” og “Kvinner” i begge kommunene, for alle utdanningskategorier. For hver kjønnskategori og hver utdanningskategori skal dere indikere hvilken av kommunene som har høyest andel utdannede. Dere skal også utrope en “vinner”. Vinneren er kommunen som har høyest andel utdannede i flest utdanningskategorier.*/

function checkEqual(obj, input1, input2) {
  // Input, kommunenummere
  var kommuner = obj.data.elementer
  for(var kommune in kommuner) {
    if(kommuner[kommune].kommunenummer == input1) {
      var kommune1 = kommuner[kommune]
    }
    if(kommuner[kommune].kommunenummer == inpu2) {
      var kommune2 = kommuner[kommune]
    }
    if(kommune1 && kommune2) {
      break;
    }
  }



}
