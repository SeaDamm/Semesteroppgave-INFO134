xhrLoadings = {} // Is used in Data.onload to keep track of all datasets that are loading

load = function(callback, obj) {
    obj.onload(0)
    let xhr = new XMLHttpRequest();
    xhr.open("GET", obj.url);

    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText);
            if(callback) {
              callback(response, obj)
            }
            obj.onload(1)
        }
    };
    xhr.send()
}

getData = function(response, obj) { // Sets data_obj.data as the xhr response.
// Don't call this function directly! Use "load(getData, data_obj)"
  obj.data = response
}


function Data(url) {
  this.url = url;
  this.data = undefined // The dataset from load()


  this.getNames = function() {
    var kommuner = this.data.elementer

    if(kommuner) {
      var result = []
      for (var kommune in kommuner) {
        result.push(kommune)
      }
    }
    console.log(result.sort())
    return result.sort()
  }

  this.getIDs = function() {
    var kommuner = this.data.elementer

    if(kommuner) {
      var result = []
      for(var kommune in kommuner) {
        result.push(kommuner[kommune].kommunenummer)
      }
    }
    return result
  }

  this.getInfo = function(nr) { // nr has to be a string! ("1234")
    var kommuner = this.data.elementer

    for(var kommune in kommuner) {
      if(kommuner[kommune].kommunenummer == nr) {
        return {"data":kommuner[kommune], "name":kommune}
      }
    }
  }

  this.onload = function(loaded) {
    xhrLoadings[this.url] = loaded
    allLoaded()
  }
}

function loadAllData(){
load(getData, befolkning_obj)
load(getData, sysselsatte_obj)
load(getData, utdanning_obj)
}

function allLoaded() { // Checks if all datasets have finished loading
  console.log(xhrLoadings)
  loadText = document.getElementById("loading")
  for(var load in xhrLoadings) {
    if(xhrLoadings[load] != 1) {
      // Is still loading
      disableButtons(true)
      if(loadText) {
        loadText.style.display = "inline"
      }
      return
    }
  }
  // Has finished loading
  var main = document.getElementsByTagName("main")[0]
  if(main) {
    main.className = "visible"
  }

  disableButtons(false)

  if(loadText) {
    loadText.style.display = "none"
  }
}

function disableButtons(bool) {
  var buttons = document.getElementsByClassName("dataButton")
  for(var i = 0; i < buttons.length; i++) {
    console.log("BUTTON: ", buttons[i])
    if(bool) {
      buttons[i].classList.add("disabled")
    } else {
      buttons[i].classList.remove("disabled")
    }
    buttons[i].disabled = bool
  }
}



befolkning_url = "http://wildboy.uib.no/~tpe056/folk/104857.json"
sysselsatte_url = "http://wildboy.uib.no/~tpe056/folk/100145.json"
utdanning_url = "http://wildboy.uib.no/~tpe056/folk/85432.json"


befolkning_obj = new Data(befolkning_url)
sysselsatte_obj = new Data(sysselsatte_url)
utdanning_obj = new Data(utdanning_url)
