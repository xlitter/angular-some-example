angular.module('app').factory('Constants', [function () {
  return {
    checkRegs: {
      REG_FLOAT_NUM:/^\d+(\.\d+)?$/
    },
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
    },
    cardCities: {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
  };
}]);
