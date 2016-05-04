angular.module('app.security', [])
  .factory('Security', function($q, SecurityQueue) {
    'use strict';

    var result = {
      showDialog: function() {
        console.log('this is dialog!');
        this.login().then(function(v) {
          // SecurityQueue.retryAll();
        });
      },
      cancelDialog: function() {
        SecurityQueue.retryCancel();
      },
      login: function() {
        //TODO:
        return $q.when('login');
      },
      init: function() {
        console.log('init');
      }
    };

    SecurityQueue.onItemAdd = function() {
      result.showDialog();
    };
    return result;

  }).factory('SecurityInterceptor', function($injector, $q, SecurityQueue) {
    'use strict';

    return {
      responseError: function(response) {

        if (response.status === 401) {
          var $http = $injector.get('$http');
          return SecurityQueue.pushRetryItem('Unauthorized', function() {
            return $http(response.config);
          });
        }
        return response;
      }
    };
  }).service('SecurityQueue', function($q) {
    'use strict';
    var retryItems = [];
    var push = function push(item) {
      retryItems.push(item);
      this.onItemAdd();
    }.bind(this);

    //abstract method需使用的地方实现相应内容 
    this.onItemAdd = function() {
      throw new Error('onItemadd function is unimplements');
    };

    this.pushRetryItem = function(reason, fn) {
      var defer = $q.defer(),
        retryItem = {
          reason: reason,
          retry: function() {
            $q.when(fn()).then(function(data) {
              defer.resolve(data);
            }, function(err) {
              defer.reject(err);
            });
          },
          cancel: function() {
            defer.reject();
          }
        }

      push(retryItem);

      return defer.promise;
    };

    this.retryAll = function() {
      retryItems.forEach(function(v) {
        v.retry();
      });
    };

    this.retryCancel = function() {
      retryItems.forEach(function(v) {
        v.cancel();
      });
    };

    this.hasMore = function() {
      return retryItems.length > 0;
    };

  }).config(function($httpProvider) {
    // $httpProvider.interceptors.push('SecurityInterceptor');
  });