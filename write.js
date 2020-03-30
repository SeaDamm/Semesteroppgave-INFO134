
function writeOverview(obj) {

  function toArray(obj) { // Converts Object to array
    return Object.keys(obj);
  }

  function lastIndex(arr, i = 1) { // Finds last index of array. i is last index of array
    return arr[arr.length - i]
  }

  function newLine(element, text, br = 1) { // writes new line to a given element and automatically adds line break
    element.innerHTML += text
    if(br) {
      element.innerHTML += "<br>"
    }
  }


  var list = document.createElement("ul");
  for (kommune of obj.getNames()){
    var info = obj.data.elementer[kommune]

    var paragraph = document.createElement("li");
    newLine(paragraph, "<h2>" + kommune + "</h2>", 0)

    newLine(paragraph, "Kommunenummer: " + info.kommunenummer)

// Total population for the dataset's last year
    var mennArray = toArray(info.Menn)
    var kvinnerArray = toArray(info.Kvinner)
    var befolkningSum = info.Menn[lastIndex(mennArray)] + info.Kvinner[lastIndex(kvinnerArray)]

    newLine(paragraph, "<h3>Total befolkning (" + lastIndex(mennArray) + ")</h3>", 0)
    newLine(paragraph, "Befolkningstall: " + befolkningSum)

    // increment in population
    var befolkningSumFjor = info.Menn[lastIndex(mennArray, 2)] + info.Kvinner[lastIndex(kvinnerArray, 2)]
    var vekstProsent = (Math.round((befolkningSum / befolkningSumFjor) * 1000) - 1000) / 10
    newLine(paragraph, "Vekst siden i fjor (%): " + vekstProsent)


    list.appendChild(paragraph);
 }
 var element = document.getElementById("oversikt");
 element.appendChild(list);
}










/*
function writeInfo(data, elemName) {
  listElement = document.getElementById(elemName)
  listElement.innerHTML = data.name
  return data.data
}


function checkEqual(obj1, obj2) { // Checks if two datasets have the same municipalities (???)
  names1 = obj1.getNames()
  names2 = obj2.getNames()

  for (var i = 0; i < names1.length; i++) {
    if(names1[i] != names2[i]) {
      console.log(names1[i],"!=",names2[i])
    }
  }
}
*/
