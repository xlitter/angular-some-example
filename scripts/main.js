var app = angular.module('app', ['ngSanitize', 'ui.router', 'angularFileUpload','sn.controls', 'sn.error']);

app.constant('baseUrl', '');

app.constant('Utils', {})
  .run(['$rootScope', 'Utils', 'envService',
    function($rootScope, Utils, envService) {
      'use strict';
      //获取当前环境 dev, sit, pre, prd
      Utils.settings = {};
      Utils.settings.env = envService.get();

      //用户权限数据缓存全局key
      Utils.cacheKeys = {
        userRoles: 'User.roles'
      };

      Utils.MockRoles = [];

      $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        $rootScope.$broadcast('router:state:change', toState);
      });
    }
  ]);

//router
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/console');
    $stateProvider.state('Console', {
        url: '/console',
        templateUrl: 'partials/console.html',
        controller: 'ConsoleCtrl',
        resolve: {
          init: ['UserService', function(UserService) {
            //用户权限初始化
            return UserService.getUserAllRoles(angular.noop);
          }]
        }
      })
      .state('BtnRole', {
        parent: 'Console',
        url: '/btnrole',
        templateUrl: 'partials/role/btn-role.html',
        controller: 'BtnRoleCtrl'
      }) 
      .state('BtnRoleExp', {
        url: '/btnroleexp',
        templateUrl: 'partials/role/btn-role-exp.html',
        controller: 'BtnRoleExpCtrl'
      })
      .state('CheckBoxTree', {
        parent: 'Console',
        url: '/checkboxtree',
        templateUrl: 'partials/tree/checkbox-tree.html',
        controller: 'CheckBoxTreeCtrl'
      })
      .state('ImageUpload',{
        parent: 'Console',
        url: '/imageupload',
        templateUrl: 'partials/uploader/uploader.html',
        controller: 'ImageUploadCtrl'
    });
  }
]);

app.factory('noCacheInterceptor', function() {
  'use strict';

  return {
    request: function(config) {
      //config.url.indexOf('tpl.html') === '-1'
      //解决$templateCache的tpl.html模板URL,加上noCache之后无法取到template的问题
      if (config.method === 'GET' && config.url.indexOf('tpl.html') === -1) {
        var separator = config.url.indexOf('?') === -1 ? '?' : '&';
        config.url = config.url + separator + 'noCache=' + new Date().getTime();
      }
      return config;
    }
  };
});

app.config(function($httpProvider) {
  'use strict';
  //jshint -W089
  $httpProvider.interceptors.push('noCacheInterceptor');

  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
      var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else {
          //edit hw 2015 5-11
          // else if (value !== undefined && value !== null) {
          //jshint -W116
          query += encodeURIComponent(name) + '=' + encodeURIComponent((value == null ? '' : value)) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
