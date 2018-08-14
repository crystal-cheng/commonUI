
window.onload=function(){
  var btn = document.getElementsByClassName('btn');
  btn[0].onclick = function(){
    window.location.href = '/importExcel';
  }
  btn[1].onclick = function(){
    window.location.href = '/exportExcel';
  }
}



