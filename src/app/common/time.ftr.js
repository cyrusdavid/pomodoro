angular.module('time', [])

.filter('time', function() {
  return function(input) {
    var date = new Date(input),
        mm = date.getMinutes(),
        ss = date.getSeconds();

    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;

    return mm + ':' + ss;
  };
});
