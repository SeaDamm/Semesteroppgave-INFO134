//function that makes content of elements visible
//is being called by button onclick in html

function viseInnhold(innhold) {
  var contents = document.getElementsByTagName('main')[0].children
  for(var node in contents) {
    contents[node].className = "hidden"
    if(contents[node].id == innhold) {
      contents[node].className = "visible";
    }
  }
}
