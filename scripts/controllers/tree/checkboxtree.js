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
        code: "wj",
        children: [{
          name: 'node4',
          code:'node-4',
          children: [{
            name: 'node5',
            code: 'node-5',
            children: [{
              name: 'node6',
              code: 'node-6'
            }]
          }]
        }]
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
