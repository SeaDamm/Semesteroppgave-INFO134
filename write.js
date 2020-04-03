// writes new line to a given element and automatically adds line break (if br == true)
// If replace == true, set the element.innerHTML as the text instead of appending it
function newLine(element, text, replace = false, br = true) {
  if(replace) {
    element.innerHTML += text
  } else {
    element.innerHTML = text
  }
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




// Writes basic information about each municipality
function writeOverview(obj) {

  var list = document.createElement("ul");
  for (kommune of obj.getNames()){
    var info = obj.data.elementer[kommune]

    var paragraph = document.createElement("li");
    // municipality name
    newLine(paragraph, "<h2>" + kommune + "</h2>", 1)

    // municipality number
    newLine(paragraph, "Kommunenummer: " + info.kommunenummer)

    // Total population for the dataset's last year
    var befolkningSum = calculatePopulation(1, info.Menn) +
    calculatePopulation(1, info.Kvinner)

    // Dataset's last year's population
    newLine(paragraph,"<h3>Total befolkning (" + lastIndex(toArray(info.Menn)) + ")</h3>", 0, 0) // Header
    newLine(paragraph, "Befolkningstall: " + befolkningSum) // Number

    // increment in population
    var befolkningSumFjor = calculatePopulation(2, info.Menn) +
    calculatePopulation(2, info.Kvinner);

    var increment = (Math.round((befolkningSum / befolkningSumFjor) * 1000) - 1000) / 10;
    newLine(paragraph, "Vekst siden i fjor (%): " + increment);

    list.appendChild(paragraph);
 }
 var element = document.getElementById("oversikt");
 element.appendChild(list);
}




// Function that shows the details of a given municipality
function writeDetails(dataObj, input)
{
  // The HTML-element that contains all information about the municipality
  var details = document.getElementById("kommunedetaljer")
  var detailsElem = details.children

  // dictionary for all children of "kommunedetaljer"
  var elements = {}
  for(var element in detailsElem) {
    elements[detailsElem[element].id] = detailsElem[element]
  }


  var befolkning = dataObj.befolkning.data.elementer;
  var sysselsatte = dataObj.sysselsatte.data.elementer;
  var utdanning = dataObj.utdanning.data.elementer;

  //befolkningInfo = undefined (ER DEN NØDVENDIG?)
  // Getting all important data from the municipality
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
    // Display municipality details

    details.className = "visible"
    // municipality name
    elements.header.innerHTML = kommuneNavn

    // municipality number
    elements.kommunenr.innerHTML = "Kommunenummer: " + befolkningInfo.kommunenummer

    // Writing total population
    var befolkningMenn = befolkningInfo.Menn;
    var befolkningSum = calculatePopulation(1, befolkningMenn) +
    calculatePopulation(1, befolkningInfo.Kvinner);

    elements.befolkningnr.innerHTML =
    "Befolkningsnummer i " + lastIndex(toArray(befolkningMenn)) +
    ": " + befolkningSum

  // population in employment
    // Employment in amount
    var sysselBegge = toArray(sysselsatteInfo["Begge kjønn"]).sort()
    sysselBegge = lastIndex(sysselBegge)
    newLine(
      elements.sysselstat,
      "Sysselsatte i " + sysselBegge + ": " +
      Math.round(befolkningSum*(sysselProsent/100)),
      1
    )
    // Employment in percentage
    var sysselProsent = sysselsatteInfo["Begge kjønn"][sysselBegge]
    newLine(
      elements.sysselstat,
      "Sysselsatte målt i prosent: " + sysselProsent + "%"
    )



    // Returns statistics for education
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

    // The year of the data
    utdanningAar = lastIndex(toArray(utdanningInfo["11"].Menn))
    // The data (sum of all higher educational grades)
    utdanningSum =
    getUtdanningInfo(utdanningInfo["11"], "both") +
    getUtdanningInfo(utdanningInfo["03a"], "both") +
    getUtdanningInfo(utdanningInfo["04a"], "both")

  // Display the educational data
    // Amount
    newLine(
      elements.videreutdanning,
      "Antall med høyere utdanning i " + utdanningAar + " (Universitets-, høgskole- og fagskolenivå): " +
      Math.round(befolkningSum*(utdanningSum/100)),
      1
    )
    // Percentage
    newLine(elements.videreutdanning, "Antall med høyere utdanning målt i prosent: " + utdanningSum + "%")


    // Educational statistics the past years table
    var table = document.getElementById("historisk_vekst")
    var tableHeaders = document.createElement("tr")
    tableHeaders.id = ("detalj_historisk_headers")

    // Will contain all the table's headers
    var tableHeadersList = []
    // Will contain all years and the data for them (ex: 2018: [123, 32])
    var tableDict = {}

    // Creates each table column as a key in the variable tableDict
    function createTableColumn(headerText, cellObj) {
      tableHeadersList.push(headerText)

      var cellArray = toArray(cellObj).sort()
      for(var cellIndex in cellArray) {
        var year = cellArray[cellIndex]
        if(!tableDict[year]) {
          tableDict[year] = []
        }
        // If not all the data has statistics from this year, add dashes to
        // the array to ensure it still aligns properly
        while(tableDict[year].length < tableHeadersList.length-1) {
          tableDict[year].push(" - ")
        }
        tableDict[year].push(cellObj[year])
      }
    }

    // Uses the variables tableHeadersList and tableDict to write the data
    // as a table
    function writeTable(headers, dict) {
      // Adding the headers
      var emptyHeader = document.createElement("th")
      tableHeaders.appendChild(emptyHeader)
      for(var header in headers) {
        var tableH = document.createElement("th")
        tableH.innerHTML = headers[header]
        tableHeaders.appendChild(tableH)
      }
      table.appendChild(tableHeaders)

      // Adding the columns in tableDict
      var tableArray = toArray(tableDict).sort()
      for(var index in tableArray) {
        row = tableArray[index]
        var tableRow = document.createElement("tr")

        // Adds the years first to the table
        var rowStart = document.createElement("td")
        rowStart.innerHTML = row
        tableRow.appendChild(rowStart)

        // Adds all the data for the given year
        for(var i in tableDict[row]) {
          var tableCell = document.createElement("td")
          tableCell.innerHTML = tableDict[row][i]
          tableRow.appendChild(tableCell)
        }

        table.appendChild(tableRow)
      }
    }

  // Adds all table data
    // population
    createTableColumn("Befolkning menn", befolkningInfo.Menn)
    createTableColumn("Befolkning kvinner", befolkningInfo.Kvinner)

    // Population (percentage)
    createTableColumn("Sysselsatte menn %", sysselsatteInfo.Menn)
    createTableColumn("Sysselsatte kvinner %", sysselsatteInfo.Kvinner)

    // All education data
    for(var utdanning in utdanningInfo) {
      if(utdanning == "kommunenummer") {
        continue
      }
      var utdanningNavn
      // Will get the names of all the education categories
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
      createTableColumn("Antall menn " + utdanningNavn + " %", utdanningInfo[utdanning].Menn)
      createTableColumn("Antall kvinner " + utdanningNavn + " %", utdanningInfo[utdanning].Kvinner)
    }

    writeTable(tableHeadersList, tableDict)
  } else {
    // Display error text if no municipality with the number is found
    document.getElementById("errortext").innerHTML = "Vi fant ingen kommuner med kommunenummer " + input
    details.className = "hidden"
  }



}




/*
Som i “detaljer” skal dere i utgangspunktet ikke vise noe informasjon her, men brukeren skal kunne skrive inn to gyldige kommunenummere. Når brukeren skriver inn dette, så skal dere vise utdanningsdata for det siste året (som datasettet dekker) innen kjønnskategoriene “Menn” og “Kvinner” i begge kommunene, for alle utdanningskategorier. For hver kjønnskategori og hver utdanningskategori skal dere indikere hvilken av kommunene som har høyest andel utdannede. Dere skal også utrope en “vinner”. Vinneren er kommunen som har høyest andel utdannede i flest utdanningskategorier.*/


function writeComparison(dataset_obj, input1, input2) {
  // Input, kommunenummere
  console.log("dataset", dataset_obj);
  console.log("input", input1, input2);

  // The HTML-element that contains all information about the municipality
  var compare = document.getElementsByClassName("sammenlignkommune")
  var compareElem = [compare[0].children, compare[1].children]
  var compareText = document.getElementById("sammenligntekst")

  var kommuner = dataset_obj.utdanning.data.elementer
  var listDict = [{},{}]
  var points = []

  // Finds municipality with the user input
  for(var kommune in kommuner) {
    // Checks input1
    if(kommuner[kommune].kommunenummer == input1) {
      var kommune1Navn = kommune
      var kommune1 = kommuner[kommune]
    }
    // Checks input2
    if(kommuner[kommune].kommunenummer == input2) {
      var kommune2Navn = kommune
      var kommune2 = kommuner[kommune]
    }

    // Checks if both inputs have a municipality
    if(kommune1 && kommune2) {
      break;
    }
  }

  if(kommune1 && kommune2) {
    document.getElementById("kommunesammenligning").className = "visible"

  var kommuneData = [
    {"compare":compare[0],"compareElem":compareElem[0],"kommune":kommune1,
    "listDict":listDict[0],"navn":kommune1Navn},
    {"compare":compare[1],"compareElem":compareElem[1],"kommune":kommune2,
    "listDict":listDict[1],"navn":kommune2Navn},
  ]


  function flushList(ul) {
    ul.innerHTML = "<ul></ul>"
    console.log("UL:",ul)
  }

  function writeListElement(text, ul) {
    var li = document.createElement("li")
    li.innerHTML = text

    ul.appendChild(li)
  }

  function writeEducationList(kommune){
    var list = kommune.compareElem[1]
    console.log("kommune.compareElem[1]:",kommune.compareElem[1])

    //console.log("log kommune", kommune)
    //console.log("log kommuner", kommuner)
    var educationLevel = kommune.kommune
    //console.log("educationLevel", educationLevel)

    for(var index in educationLevel){
    var category = educationLevel[index]
      if (index == "kommunenummer"){
        continue
      }

      var utdanningNavn
      switch(index) {
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


      var educationMen = toArray(category.Menn).sort()
      var educationMen = lastIndex(educationMen)
      var educationMen = category.Menn[educationMen]

      var educationWomen = toArray(category.Kvinner).sort()
      var educationWomen = lastIndex(educationWomen)
      var educationWomen = category.Kvinner[educationWomen]

      kommune.listDict[utdanningNavn] = [educationMen]
      kommune.listDict[utdanningNavn].push(educationWomen)
      //writeListElement(educationMen, list)
      //writeListElement(educationWomen, list)
      console.log("Wrote data for", utdanningNavn)
      //writeListElement(utdanningNavn, compareText)
     }

    }
    /*console.log("compareElem[1]:", kommuneData[1].compareElem[1])
    flushList(kommuneData[1].compareElem[1])
    flushList(kommuneData[2].compareElem[1])
*/
    flushList(kommuneData[0].compareElem[1])
    flushList(kommuneData[1].compareElem[1])
    writeEducationList(kommuneData[0])
    flushList(compareText)
    writeEducationList(kommuneData[1])

console.log("KOMMUNENAVN:",kommuneData[0].navn,"kommuneData[0].compareElem[0]:", kommuneData[0].compareElem[0])
    kommuneData[0].compareElem[0].innerHTML = kommuneData[0].navn
    kommuneData[1].compareElem[0].innerHTML = kommuneData[1].navn

    console.log("LISTDICT:",kommuneData[0].listDict)
    for(var index in kommuneData[0].listDict) {
      var dict1 = kommuneData[0].listDict[index]
      var dict2 = kommuneData[1].listDict[index]

      for(var gender in dict1) {
        if(gender == 1) {
          var genderName = "kvinner"
        } else {
          var genderName = "menn"
        }

        writeListElement(index + " ("+genderName+")", compareText)
        if(dict1[gender] > dict2[gender]) {
          writeListElement("!"+dict1[gender]+"!", kommuneData[0].compareElem[1])
          writeListElement(dict2[gender], kommuneData[1].compareElem[1])

          points.push(1)
        } else if (dict2[gender] > dict1[gender]) {
          writeListElement(dict1[gender], kommuneData[0].compareElem[1])
          writeListElement("!"+dict2[gender]+"!", kommuneData[1].compareElem[1])
          points.push(0)
        } else {
          writeListElement(dict1[gender], kommuneData[0].compareElem[1])
          writeListElement(dict2[gender], kommuneData[1].compareElem[1])
        }
      }
    }
    var pointPercentage = 0
    for(var point in points) {
      pointPercentage += points[point]
    }
    pointPercentage /= points.length
    console.log(pointPercentage)

    var winText = document.getElementById("vinnertekst")
    if(pointPercentage > 0.5) {
      winText.innerHTML = kommuneData[0].navn + " er vinneren!"
    } else if(pointPercentage < 0.5) {
      winText.innerHTML = kommuneData[1].navn + " er vinneren!"
    } else {
      winText.innerHTML = "Det ble uavgjort!"
    }

  } else {
    document.getElementById("kommunesammenligning").className = "hidden"
    if(!kommune1) {
      document.getElementById("errortext").innerHTML =
      "Vi fant ingen kommuner med kommunenummer " + input1;
    } else {
      document.getElementById("errortext").innerHTML =
    "Vi fant ingen kommuner med kommunenummer " + input2;
    }
  }
}

   // Hente ut utdanningsdata fra siste året, menn og kvinner, alle kategorier
