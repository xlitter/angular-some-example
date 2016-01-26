angular.module('app').controller('CodeMirrorCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  'use strict';

  var vm = $scope,
    content = "<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\r\n  xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd\">\r\n  <modelVersion>4.0.0</modelVersion>\r\n  <groupId>com.mijiang.test</groupId>\r\n  <artifactId>helloWorld</artifactId>\r\n  <packaging>war</packaging>\r\n  <version>0.0.1-SNAPSHOT</version>\r\n  <name>helloWorld Maven Webapp</name>\r\n  <url>http://maven.apache.org</url>\r\n  <dependencies>\r\n    <dependency>\r\n      <groupId>junit</groupId>\r\n      <artifactId>junit</artifactId>\r\n      <version>3.8.1</version>\r\n      <scope>test</scope>\r\n    </dependency>\r\n  </dependencies>\r\n  <build>\r\n    <finalName>helloWorld</finalName>\r\n  </build>\r\n</project>\r\n",
    formData = vm.formData = {
      content : ''
    };

  vm.editorOptions = {
    lineWrapping: true,
    lineNumbers: true,
    readOnly: 'nocursor',
    mode: 'xml',
    onLoad: function(codeMirror){
      codeMirror.on('change', function(cm){
        var doc = cm.getDoc();
        formData.lineCount = doc.lineCount();
      });
    }
  };
  
  function dealySetCodeMirrorContent(){
    $timeout(function(){
      formData.content = content;
    }, 1500);
  }
  
  function init() {
    dealySetCodeMirrorContent();
  }  
  
  init();
  
  return vm;

}]);