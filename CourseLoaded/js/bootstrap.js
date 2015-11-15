(function() {
  'use strict';
  /**
  * Gets Current Time 
  */
  function displayCurrentTime() {
    // Get the current time
    var clock = new Date(),
        h = clock.getHours(),
        m = clock.getMinutes(),
        s = clock.getSeconds();

    // Make sure that hours, minutes are all 2 digits each
    if(h.toString().length < 2) { h = '0' + h; }
    if(m.toString().length < 2) { m = '0' + m; }

    var time = h + ':' + m ;

    // Update the current time
    document.getElementById('time').innerHTML = time;
  }


  window.onload = function() {
    // Update the clock every second
    displayCurrentTime();
    setInterval(displayCurrentTime, 1000);
  };
})();
