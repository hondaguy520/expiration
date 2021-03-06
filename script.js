$(function() {
  navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
    });

  var date, data = {}, HTMLlist = [], items = [], html = "";

  Date.prototype.addTime= function(h){
      this.setHours(this.getHours() + h);
      return this;
  }

  function start(){
    date = new Date(), HTMLlist = [], items = [];
    $('#myUL li').remove();
    
    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.key(i));
    }
    items.sort().reverse();
    
    for (i = 0; i < localStorage.length; i++){
      HTMLlist.push(JSON.parse(localStorage.getItem(items[i])));
    }
    
    function populateList(el, month, time, category, day){
      html = "<li class=" + category + "><p class='item'>- <a>" + el.item + "</a></p></br><div class='month'>"
        + month + "</div><div class='day " + day + "'>" + day + "</div><div class='time'>" + time +
        "</div><button class='delete fa fa-minus' id='" + el.item + "'></button></li>";
      let selector = "#" + category;
      $(selector).after(html);
    };
    
    HTMLlist.map(function(el){
        let time, day, month, category = el.category;        
       
        if (el.type == "days") {
        month = date.addTime(el.length * 24).toString('MM-d');
        time = date.toString('h:mm tt');
        day = date.addTime(el.length).toString('ddd');
        } else {
        month = date.toString('MM-d');
        time = date.addTime(el.length).toString('h:mm tt');
        day = date.toString('ddd');
      }
      
      populateList(el, month, time, category, day);
      date = new Date();
    })

///////////////////////////  end of start   ////////////////////////////////////
  };

  $("form").on("submit", function(event) {
    event.preventDefault();
    let item = $("#item").val(), length = $("#length").val(), selectedVal, selected = $("#radioDiv input[type='radio']:checked"), category = $("#category option:selected").val();

    if (selected.length > 0) {
      selectedVal = selected.val();
    }
    data = {item: item, length: Number(length), type: selectedVal, category: category};
    localStorage.setItem(item, JSON.stringify(data));

    clearInterval(startTimes);
    timer();

    $('#item, #length').val('');
  });

  function timer() {
    start();
    startTimes = setInterval(start, 60000);
  }

  timer();

  $(document).on('click', '.delete', function(event){
    event.preventDefault();
    localStorage.removeItem(this.id);

    clearInterval(startTimes);
    timer();
  });

  $('#edit').click(function(){
    $('.delete').toggle();
  })



});
