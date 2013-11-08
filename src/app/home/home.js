angular.module('myApp.Home', [
  'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'app/home/home.html'
    });
})

.controller('HomeCtrl', function($scope) {
  $scope.lead = 'Just another AngularJS boilerplate.';
});
