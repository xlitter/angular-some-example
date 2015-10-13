angular.module('app').factory('BtnRoleService', function($location){
   'use strict';
  var userRoles = [];
  function init(){
    var roles = $location.hash();
    if(roles){
      roles = JSON.parse(roles);
      userRoles = roles; 
    }
  }
  
  init();
  
  return {
    clear : function(){
      userRoles.length = 0;
      return this;
    },
    setUserRoles : function(roles){
      if(Array.isArray(roles)){
        userRoles.push.apply(userRoles, roles);
      } else {
        userRoles.push(roles);
      }
      return this;
    },
    getUserRoles: function(){
      return userRoles;
    }
  };
});