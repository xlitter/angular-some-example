angular.module('minos').controller('TestCtrl', function($scope){
  'use strict';
  
  var vm =$scope;
  
  vm.role = 'ROLE_ADMIN, ROLE_USER';
  return vm;
});