angular.module('app').config(['ngClipProvider', function (ngClipProvider) {
  ngClipProvider.setPath('/libs/zeroclipboard/ZeroClipboard.swf');
}])
  .controller('ClipBoardCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    'use strict';

    var vm = $scope,
      formData = vm.formData = {};

      //当flash不能被使用时,会被调用
    vm.clipFallback = function(e, message){
      console.log(message);
    };
    
    vm.showMessage = function () {
      alert('Copied!');
    };
    return vm;
  }]);
