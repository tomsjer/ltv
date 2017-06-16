setInterval(function(){
    var date = new Date();
    var time = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    var element = document.querySelectorAll('.time a')[0];
    element.innerHTML = time;
},1000);
