// writes new line to a given element and automatically adds line break
function newLine(element, text, br = true) {
  element.innerHTML += text
  if(br) {
    element.innerHTML += "<br>"
  }
}

// Finds last index of array. i will count as negative index to the array.
function lastIndex(arr, i = 1) {
  return arr[arr.length - i]
}

// Converts Object to array
function toArray(obj) {
  return Object.keys(obj);
}

// Calculates population at given last year. year 1 = 2018, 2 = 2017, etc.
function calculatePopulation(year, infoObj) {
  var objArray = toArray(infoObj)
  var result = infoObj[lastIndex(objArray, year)]
  return result
}


function writeOverview(obj) {

  var list = document.createElement("ul");
  for (kommune of obj.getNames()){
    var info = obj.data.elementer[kommune]

    var paragraph = document.createElement("li");
    newLine(paragraph, "<h2>" + kommune + "</h2>", 0)

    newLine(paragraph, "Kommunenummer: " + info.kommunenummer)

    // Total population for the dataset's last year
    var befolkningSum = calculatePopulation(1, info.Menn) +
    calculatePopulation(1, info.Kvinner)

    newLine(paragraph,"<h3>Total befolkning (" + lastIndex(toArray(info.Menn)) + ")</h3>",false)
    newLine(paragraph, "Befolkningstall: " + befolkningSum)

    // increment in population
    var befolkningSumFjor = calculatePopulation(2, info.Menn) +
    calculatePopulation(2, info.Kvinner);

    var vekstProsent = (Math.round((befolkningSum / befolkningSumFjor) * 1000) - 1000) / 10;
    newLine(paragraph, "Vekst siden i fjor (%): " + vekstProsent);

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

  befolkningInfo = undefined

  for(var kommune in befolkning) {
    if(befolkning[kommune].kommunenummer == input) {
      befolkningInfo = befolkning[kommune]
      sysselsatteInfo = sysselsatte[kommune]
      utdanningInfo = utdanning[kommune]
      kommuneNavn = kommune
      break;
    }
  }

  if(befolkningInfo) {

    elements.header.innerHTML = kommuneNavn

    elements.kommunenr.innerHTML = "Kommunenummer: " + befolkningInfo.kommunenummer

    var befolkningMenn = befolkningInfo.Menn
    var befolkningSum = calculatePopulation(1, befolkningMenn) +
    calculatePopulation(1, befolkningInfo.Kvinner);
    elements.befolkningnr.innerHTML = "Befolkningsnummer i " + lastIndex(toArray(befolkningMenn)) + ": " + befolkningSum


    var sysselBegge = toArray(sysselsatteInfo["Begge kjønn"]).sort()
    sysselBegge = lastIndex(sysselBegge)

    elements.sysselstat.innerHTML = "Sysselsatte i " + sysselBegge + ": " +
    sysselsatteInfo["Begge kjønn"][sysselBegge];

    function getUtdanningInfo(utdanningList, gender, year = 1) {
      switch (gender) {
        case "male":
          var resultIndex = lastIndex(toArray(utdanningList.Menn))
          var result = utdanningList.Menn[resultIndex]
          break;
        case "female":
          var resultIndex = lastIndex(toArray(utdanningList.Kvinner))
          var result = utdanningList.Kvinner[resultIndex]
          break;
        case "both":
          var resultIndex = lastIndex(toArray(utdanningList.Menn))
          var result = utdanningList.Menn[resultIndex]
          resultIndex = lastIndex(toArray(utdanningList.Kvinner))
          result += utdanningList.Kvinner[resultIndex]
          break;
      }
      console.log(result)
      return result
    }

    utdanningAar = lastIndex(toArray(utdanningInfo["11"].Menn))
    utdanningSum = getUtdanningInfo(utdanningInfo["11"], "both") +
    getUtdanningInfo(utdanningInfo["03a"], "both") +
    getUtdanningInfo(utdanningInfo["04a"], "both")

    elements.videreutdanning.innerHTML =
    "Antall med høyere utdanning i " + utdanningAar + " (Universitets-, høgskole- og fagskolenivå): " + utdanningSum

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
