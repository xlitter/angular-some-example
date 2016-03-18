angular.module('app').controller('SecurityCtrl', function($scope, HttpService) {
  'use strict';

  var vm = $scope;

  function query() {
    HttpService.get('/auth').then(function(v) {
      console.log('auth value', v);
    }).catch(function(err) {
      console.log('error', err);
    })
  }
  
  function init() {
    query();
  }

  init();

  return vm;

});