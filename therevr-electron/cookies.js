// require('electron-cookies')
// console.log('lol')

var style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = `
  body {
    overflow: hidden;
  }
  
  #pageFooter {
    display: none;
  }

  #pagelet_bluebar {
    display: none;
  }

  ._50f4 {
    display: none;
  }

  ._1rf5 {
    display: none;
  }

  ._4-u5._30ny {
    padding: 30px 0;
  }
`
document.addEventListener('DOMContentLoaded', () => {

  document.getElementsByTagName('head')[0].appendChild(style)
  console.log( document.querySelectorAll("._xkt") )

  var buttons = document.querySelectorAll("._xkt");
  buttons[1].style.display = "none";
  buttons[2].style.display = "none";

})