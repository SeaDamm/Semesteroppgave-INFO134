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





function writeDetails(dataObj, input)
{
  console.log(input)
  var details = document.getElementById("kommunedetaljer")
  var detailsElem = details.children
  var elements = {} // dictionary for all children of "kommunedetaljer"

  for(var element in detailsElem) {
    elements[detailsElem[element].id] = detailsElem[element]
  }

  var befolkning = dataObj.befolkning.data.elementer;
  var sysselsatte = dataObj.sysselsatte.data.elementer;
  var utdanning = dataObj.utdanning.data.elementer;

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
    console.log("Making it visible")

    details.className = "visible"
    // municipality name
    elements.header.innerHTML = kommuneNavn

    // municipality number
    elements.kommunenr.innerHTML = "Kommunenummer: " + befolkningInfo.kommunenummer

    // Writing total population
    var befolkningMenn = befolkningInfo.Menn
    var befolkningSum = calculatePopulation(1, befolkningMenn) +
    calculatePopulation(1, befolkningInfo.Kvinner);

    elements.befolkningnr.innerHTML =
    "Befolkningsnummer i " + lastIndex(toArray(befolkningMenn)) +
    ": " + befolkningSum

    // population in employment
    var sysselBegge = toArray(sysselsatteInfo["Begge kjønn"]).sort()
    sysselBegge = lastIndex(sysselBegge)
    var sysselProsent = sysselsatteInfo["Begge kjønn"][sysselBegge]

    newLine(
      elements.sysselstat,
      "Sysselsatte i " + sysselBegge + ": " +
      Math.round(befolkningSum*(sysselProsent/100))
    )
    newLine(
      elements.sysselstat,
      "Sysselsatte målt i prosent: " + sysselProsent + "%"

    )

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

    newLine(
      elements.videreutdanning,
      "Antall med høyere utdanning i " + utdanningAar + " (Universitets-, høgskole- og fagskolenivå): " +
      Math.round(befolkningSum*(utdanningSum/100))
    )

    newLine(elements.videreutdanning, "Antall med høyere utdanning målt i prosent: " + utdanningSum + "%")
  } else {
    document.getElementById("errortext").innerHTML = "Vi fant ingen kommuner med kommunenummer " + input
    details.className = "hidden"
  }


  // Historical evolution
  var table = document.getElementById("historisk_vekst")
  var tableHeaders = document.getElementById("detalj_historisk_headers")

  var tableHeadersList = []
  var tableDict = {}

  function createTableColumn(headerText, cellObj) {
    tableHeadersList.push(headerText)

    var cellArray = toArray(cellObj).sort()
    for(var cellIndex in cellArray) {
      var year = cellArray[cellIndex]
      if(!tableDict[year]) {
        tableDict[year] = []
      }
      console.log("TableDict vs TableHeaders Length:",tableDict[year], tableHeaders.length-1)
      while(tableDict[year].length < tableHeadersList.length-1) {
        tableDict[year].push(" - ")
        console.log("WRITING DASH")
      }
      tableDict[year].push(cellObj[year])
    }
    console.log("TableDict in createTableColumn:",tableDict)

  }

  function writeTable(headers, dict) {
    for(var header in headers) {
      var tableH = document.createElement("th")
      tableH.innerHTML = headers[header]
      tableHeaders.appendChild(tableH)
    }

    var tableArray = toArray(tableDict).sort()
    console.log("TableArray:",tableArray)
    for(var row in tableArray) {
      var tableRow = document.createElement("tr")
      var rowStart = document.createElement("td")
      rowStart.innerHTML = tableArray[row]
      tableRow.appendChild(rowStart)
      console.log("TableDict:",tableDict[tableArray[row]])
      for(var i in tableDict[tableArray[row]]) {
        var tableCell = document.createElement("td")
        tableCell.innerHTML = tableDict[tableArray[row]][i]
        tableRow.appendChild(tableCell)
      }
      table.appendChild(tableRow)
    }
    console.log("Writing done!")
  }
/*
  function createTableColumn(headerText, cellObj) {
    var header = document.createElement("th")
    header.innerHTML = headerText
    tableHeaders.appendChild(header)

    var cellArray = toArray(cellObj).sort()
    for(var cellIndex in cellArray) {
      var year = cellArray[cellIndex]
      var row = document.getElementById("detail_"+year)
      if(!row) {
        var row = document.createElement("tr")
        row.id = "detail_"+year
        var column = document.createElement("td")
        column.innerHTML = year
        row.appendChild(column)
        table.appendChild(row)
      }

      var cell = document.createElement("td")
      cell.innerHTML = cellObj[year]
      console.log("Cell",cell)
      row.appendChild(cell)
      console.log("Row",row)
    }
  }
*/

  //var befolkningLoggMenn = toArray(befolkningInfo.Menn).sort
  createTableColumn("Befolkning menn", befolkningInfo.Menn)
  createTableColumn("Befolkning kvinner", befolkningInfo.Kvinner)

  createTableColumn("Sysselsatte menn %", sysselsatteInfo.Menn)
  createTableColumn("Sysselsatte kvinner %", sysselsatteInfo.Kvinner)

  for(var utdanning in utdanningInfo) {
    if(utdanning == "kommunenummer") {
      continue
    }
    var utdanningNavn
    switch(utdanning) {
      case "01":
        utdanningNavn = "grunnskolenivå"
        break;
      case "02a":
        utdanningNavn = "Videregående skole-nivå"
        break;
      case "11":
        utdanningNavn = "fagskolenivå"
        break;
      case "03a":
        utdanningNavn = "Universitets- og høgskolenivå kort"
        break;
      case "04a":
        utdanningNavn = "Universitets- og høgskolenivå lang"
        break;
      default:
        break;
    }
    console.log("UTDANNINGINFO:",utdanningNavn)
    if(utdanningNavn) {
      createTableColumn("Antall menn " + utdanningNavn + " %", utdanningInfo[utdanning].Menn)
      createTableColumn("Antall kvinner " + utdanningNavn + " %", utdanningInfo[utdanning].Kvinner)
    } else {
      continue;
    }
  }

  console.log(tableDict)
  writeTable(tableHeadersList, tableDict)
}




/*
Som i “detaljer” skal dere i utgangspunktet ikke vise noe informasjon her, men brukeren skal kunne skrive inn to gyldige kommunenummere. Når brukeren skriver inn dette, så skal dere vise utdanningsdata for det siste året (som datasettet dekker) innen kjønnskategoriene “Menn” og “Kvinner” i begge kommunene, for alle utdanningskategorier. For hver kjønnskategori og hver utdanningskategori skal dere indikere hvilken av kommunene som har høyest andel utdannede. Dere skal også utrope en “vinner”. Vinneren er kommunen som har høyest andel utdannede i flest utdanningskategorier.*/


function writeComparison(dataset_obj, input1, input2) {
  // Input, kommunenummere
  console.log(dataset_obj);
  console.log(input1, input2);
  var kommuner = dataset_obj.befolkning.data.elementer

  // Checks inputs
  for(var kommune in kommuner) {
    // Checks input1
    if(kommuner[kommune].kommunenummer == input1) {
      var kommune1 = kommuner[kommune]
    }
    // Checks input2
    if(kommuner[kommune].kommunenummer == input2) {
      var kommune2 = kommuner[kommune]
    }

    // Checks if both inputs have a municipality
    if(kommune1 && kommune2) {
      break;
    }



  }



}
