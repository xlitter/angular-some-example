angular.module('app').factory('UserService', ['$q', 'Utils', 'HttpService', 'DataCache',
  'mockService', 'BtnRoleService',
  function($q, Utils, HttpService, DataCache, mockService, BtnRoleService) {
    'use strict';


    function getRoles() {
      //      var url = '';
      //            return HttpService.get(url);

      var mockData = BtnRoleService.getUserRoles();

      return mockService.delay(mockData, 0);
    }

    //获取用户所有权限
    function queryUserAllRoles() {
      var cacheKeys = Utils.cacheKeys,
        roleKey = cacheKeys.userRoles,
        userRoles;

      if (!roleKey) {
        throw new Error('请设置Utils.cacheKeys.userRoles的值');
      }

      userRoles = DataCache.get(roleKey);

      if (angular.isObject(userRoles)) {
        return $q.when(userRoles);
      } else {
        return getRoles().then(function(data) {
          var roleObj = {};

          data = data || [];

          //处理用户权限为键值对
          roleObj = data.reduce(function(prev, next) {
            prev[next.code] = 1;
            return prev;
          }, roleObj);

          DataCache.put(roleKey, roleObj);
          return roleObj;
        });
      }
    }

    return {
      getUserAllRoles: function(success, error) {
        if (!success) {
          throw new Error('need a success handle function ');
        }

        error = error || function() {
          return {
            done: false,
            value: false
          };
        };
        return queryUserAllRoles().then(success, error);
      }
    };
  }
]);
