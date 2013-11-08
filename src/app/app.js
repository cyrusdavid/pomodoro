angular.module('myApp', [
  'myApp.templates',
  'myApp.Home',
  'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
});
