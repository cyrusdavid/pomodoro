angular.module('myApp.Home', [
  'ngRoute',
  'time'
])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'app/home/home.html',
      title: 'Pomodoro'
    });
})

.factory('player', function ($document) {
  var player = $document[0].createElement('audio');

  player.src = '/audio/ringing.mp3';
  player.volume = 1;

  return player;
})

.controller('HomeCtrl', function ($rootScope, $scope, $interval, player) {
  $scope.pomodoriCount = 0;
  $scope.currentTime = 1500000;
  $scope.currentAction = 'Start';

  $scope.$watch(
    function () {
      return $scope.currentTime;
    },
    function (newVal, oldVal) {
      if (newVal !== oldVal &&
        (newVal === 0 || // 25-minute timer is up
          (newVal === 300000 && $scope.pomodoriCount !== 4) || // short break is up
          (newVal === 1800000 && $scope.pomodoriCount === 0)) // long break is up
      ) {
        player.play();
      }
    },
    true
  );

  $scope.pomodoro = function doPomodoro() {
    $scope.currentAction = 'Reset';
    $scope.currentTime = 1500000;

    var interval = $interval(function tick() {
      $scope.currentTime -= 1000;
      if ($scope.currentTime === 0) {
        $scope.pomodoriCount++;
        $interval.cancel(interval);
        $scope.pomodoroBreak();
      }
    }, 1000);
  };

  $scope.pomodoroBreak = function doBreak() {
    $scope.currentTime = 0;
    var breakLength = $scope.pomodoriCount === 4 ? 1800000 : 300000,
        interval = $interval(function tick() {
      $scope.currentTime += 1000;
      if ($scope.currentTime === breakLength) {
        $interval.cancel(interval);
        if ($scope.pomodoriCount === 4) $scope.pomodoriCount = 0;
        $scope.pomodoro();
      }
    }, 1000);
  };

});
