angular.module('time', [])

.filter('time', function() {
  return function(input) {
    var date = new Date(input);

    // var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    // if (hh < 10) {hh = '0' + hh}
    if (mm < 10) {mm = '0' + mm;}
    if (ss < 10) {ss = '0' + ss;}

    return mm + ':' + ss;
  };
});
