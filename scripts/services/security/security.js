angular.module('app.security', []).factory('Security', function(securityQueue) {
  'use strict';
  var result = {
    showDialog: function() {

    },
    cancelDialog: function() {

    },
    login: function() {

    }
  };

  return result;
}).factory('SecurityInterceptor', ['SecurityQueue', function($q, queue) {
  'use strict';
  return {
    responseError: function(response) {
      if (response.status === 401) {
        return queue.pushRetryItem('Unauthorized', function(){
        })
      }
      return response;
    }
  }

}]).service('SecurityQueue', function($q) {
  'use strict';
  var retryItems = [];
  var push = function push(item) {
    retryItems.push(item);
    this.onItemAdd();
  }.bind(this);

  //需使用的地方实现相应内容 
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

  this.hasMore = function() {
    return retryItems.length > 0;
  };

});