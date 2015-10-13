angular.module('app').controller('CheckBoxTreeCtrl', function($scope) {
  'use strict';

  var vm = $scope;
  
  vm.areaData = [{
    name: "Jiangsu",
    code: "js",
    children: [{
      name: "Nanjing",
      code: "nj"
    }, {
      name: "Suzhou",
      code: "sz",
      children: [{
        name: "Wujiang",
        code: "wj"
      }, {
        name: "Changshu",
        code: "cs"
      }]
    }]
  }, {
    name: "Yunnan",
    code: "yn"
  }, {
    name: "Fujian",
    code: "fj"
  }];
  
  vm.$on('sn.controls.tree:selectedNodeChanged', function(e){
  
  });
  return vm;
});
