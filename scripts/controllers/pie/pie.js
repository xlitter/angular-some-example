angular.module('app').controller('PieCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  'use strict';

  var vm = $scope,
    formData = vm.formData = {};

  function genDeg() {
    var result = [], i;
    for (i = 0; i <= 360; i += 30) {
      result.push(i);
    }
    return result;
  }
  
  function init() {
    formData.percents = genDeg();
  }
  
  init();
  return vm;

}]);