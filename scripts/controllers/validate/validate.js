angular.module('app').controller('ValidateCtrl', ['$scope', function($scope){
  'use strict';
  
  var vm = $scope,
  formData = vm.formData=  {
    payModes : [{code : '0', name:'月'}]
  };
  
  vm.options = {
    min: 10,
    max: 100
  };
  
  vm.payOptions={
    0: {
      min: 10, 
      max: 20
    },
    1: {
      min: 11,
      max: 15
    },
    2:{
      min: 21,
      max: 30
    } 
  };
  
  vm.setBuyCnt = function(cnt){
    formData.cnt = cnt;
  };
  
  vm.setPayModeAndCnt = function(mode, cnt){
    formData.payMode = mode;
    formData.payCnt = cnt;
  }
  return vm;
  
}]);