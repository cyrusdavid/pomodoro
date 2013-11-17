describe('myApp.Home', function() {
  var player = {
      play: function () {}
    },
    scope, HomeCtrl, interval;

  beforeEach(module('myApp.Home'));

  beforeEach(inject(function($rootScope, $controller, $interval) {
    scope = $rootScope.$new();
    interval = $interval;
    HomeCtrl = $controller('HomeCtrl', {$scope: scope, $interval: interval, player: player});
  }));

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  it('has a controller', function() {
    expect(HomeCtrl).toBeDefined();
  });

  it('starts pomodori count at 0', function() {
    expect(scope.pomodoriCount).toEqual(0);
  });

  it('default action is Start', function() {
    expect(scope.currentAction).toEqual('Start');
  });

  it('currentAction changes to reset on pomodoro', function() {
    scope.pomodoro();
    expect(scope.currentAction).toEqual('Reset');
  });

  it('currentTime deducted by 1000 every second', inject(function($interval){
    var time = 1500000;
    scope.pomodoro();
    expect(scope.currentTime).toEqual(1500000);
    $interval.flush(1000);
    expect(scope.currentTime).toEqual(time - 1000);
  }));

  it('increments pomodori and do a break', inject(function($interval){
    spyOn(scope, 'pomodoroBreak');
    spyOn(interval, 'cancel');
    spyOn(player, 'play');
    scope.pomodoro();
    $interval.flush(1500000);
    expect(scope.currentTime).toEqual(0);
    expect(player.play).toHaveBeenCalled();
    expect(scope.pomodoriCount).toEqual(1);
    expect(interval.cancel).toHaveBeenCalled();
    expect(scope.pomodoroBreak).toHaveBeenCalled();
  }));

  it('currentTime incremented by 1000 every second', inject(function($interval) {
    scope.pomodoroBreak();
    expect(scope.currentTime).toEqual(0);
    $interval.flush(1000);
    expect(scope.currentTime).toEqual(1000);
  }));

  it('back to pomodoro after 5 minutes', inject(function($interval) {
    spyOn(player, 'play');
    spyOn(scope, 'pomodoro');
    spyOn(interval, 'cancel');
    scope.pomodoroBreak();
    $interval.flush(300000);
    expect(scope.currentTime).toEqual(300000);
    expect(interval.cancel).toHaveBeenCalled();
    expect(player.play).toHaveBeenCalled();
    expect(scope.pomodoro).toHaveBeenCalled();
  }));

  it('has long break', inject(function($interval) {
    spyOn(scope, 'pomodoro');
    spyOn(player, 'play');
    spyOn(interval, 'cancel');
    scope.pomodoriCount = 4;
    scope.pomodoroBreak();
    $interval.flush(300000);
    expect(scope.currentTime).toEqual(300000);
    expect(interval.cancel).not.toHaveBeenCalled();
    expect(player.play).not.toHaveBeenCalled();
    expect(scope.pomodoro).not.toHaveBeenCalled();
    $interval.flush(1500000);
    expect(interval.cancel).toHaveBeenCalled();
    expect(player.play).toHaveBeenCalled();
    expect(scope.pomodoro).toHaveBeenCalled();
    expect(scope.pomodoriCount).toEqual(0);
  }));

});
