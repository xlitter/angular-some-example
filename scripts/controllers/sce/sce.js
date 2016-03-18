angular.module('app').controller('SceCtrl', function($scope, $sce) {
  var vm = $scope;
  formData = vm.formData = {};
  formData.datas = [
    '<a  onclick="alert(\'a\')">测试</a>',
    'abc123ceshi',
    '<h1>this is h1</h1>',
    '<div ng-click="click()">angular click {{formData.message}}</div>'
  ].map(function(v) {
      return trustAsHtml(v);
    });


  function trustAsHtml(html) {
    return $sce.trustAsHtml(html);
  }
  
  
  vm.click=function(){
    if(formData.message){
      formData.message = 'This is event click';
    } else {
      formData.message = 'This is odd click';
    }
  }
  return vm;
}).directive('complieLink', function() {
  return {
    link: function(){
      
    }
  };
}).directive('clock', function($timeout){
  return {
    link: function(scope, element, attrs){
      function update(){
        element.text(new Date());
        $timeout(update, 1000);
      }
      update();
    }
  }
});