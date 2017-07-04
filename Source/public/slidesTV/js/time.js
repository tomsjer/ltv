function pad(num){
  return num < 10 ? '0'+num : num;
}

var element = document.querySelectorAll('.time a')[0];
var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'];

setInterval(function(){
    var date = new Date();
    var time = date.getDate() + ' ' + months[date.getMonth()] +' '+ date.getHours() + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds())
    element.innerHTML = time;
},1000);