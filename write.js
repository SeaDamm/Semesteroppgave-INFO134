//Functions

function writeList(obj) {
  console.log(obj);
  for (kommune in obj.getNames()) {
    document.getElementById("oversikt").innerHTML = obj.getNames();
  }
}




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
