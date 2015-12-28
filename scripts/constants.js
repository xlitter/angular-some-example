angular.module('app').factory('Constants', [function () {
  return {
    imageClasses: [{
      code: '0',
      tag: 'sys',
      name: '系统',
    }, {
        code: '1',
        tag: 'custom',
        name: '自有'
      }],
    networkClasses: [{
      code: '0',
      name: '默认网络'
    }],
    loginModes: [{
      code: '0',
      name: 'SSH密匙'
    }, {
        code: '1',
        name: '设置密码'
      }],
    payModes: [{
      code: '0',
      name: '年付'
    }, {
        code: '1',
        name: '月付'
      }, {
        code: '2',
        name: '小时付'
      }],
    category: {
      linux: {
        name: 'root',
        capacity: '20'
      },
      window: {
        name: 'administrator',
        capacity: '50'
      }
    },
    validateLimit: {
      //年付
      0: { min: 1, max: 10 },
      //月付
      1: { min: 1, max: 11 },
      //小时付
      2: { min: 1, max: 168 }
    }
  };
}]);
