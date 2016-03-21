angular.module('app.security', []).factory('Security', function($q, securityQueue) {
  'use strict';

  var result = {
    showDialog: function() {
      console.log('this is dialog!');
      this.login().then(function(v) {
        securityQueue.retryAll();
      });
    },
    cancelDialog: function() {
      securityQueue.retryCancel();
    },
    login: function() {
      return $q.when('login');
    }
  };

  securityQueue.onItemAdd = function() {
    result.showDialog();
  };

  return result;
}).factory('SecurityInterceptor', ['SecurityQueue', function($q, $http, queue) {
  'use strict';
  return {
    responseError: function(response) {
      if (response.status === 401) {
        return queue.pushRetryItem('Unauthorized', function() {
          return $http(response.config);
        });
      }
      return response;
    }
  };
}]).service('SecurityQueue', function($q) {
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

});