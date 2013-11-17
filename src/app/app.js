angular.module('myApp', [
  'myApp.templates',
  'myApp.Home',
  'ngRoute'
])

.config(function ($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
})

.run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (event, currentRoute) {
      $rootScope.title = currentRoute.title;
    });
});
