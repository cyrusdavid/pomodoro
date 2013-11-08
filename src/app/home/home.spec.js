describe('myApp.Home', function() {

  var scope, HomeCtrl;

  beforeEach(module('myApp.Home'));

  beforeEach(inject(function($controller) {
    scope = {};
    HomeCtrl = $controller('HomeCtrl', {$scope: scope});
  }));

  it('has a controller', function() {
    expect(HomeCtrl).toBeDefined();
  });

});
