angular.module('app').controller('BtnRoleCtrl', function($scope, $state, BtnRoleService) {
    'use strict';

    var vm = $scope,
      globals = {
        iframeUrl: 'http://localhost:8380/example/index.html#/btnroleexp',
        iframe: document.querySelector('iframe'),
        checks: [],
        roles: [{
          code: 'ROLE_USER',
          name: 'abc'
        }, {
          code: 'ROLE_ADMIN',
          name: 'abc'
        }, {
          code: 'ROLE_MORE',
          name: 'abc'
        }, {
          code: 'ROLE_NOT2',
          name: 'abc'
        }]
      },
      formData = vm.formData = {
        roles: globals.roles
      };

    function triggerUserRoleChange() {
      vm.$emit('btn:role:checked:change');
    }

    function iframeReload(params) {
      var url = globals.iframeUrl,
        iframe = globals.iframe.contentDocument;
      if (params && typeof params !== 'string') {
        params = JSON.stringify(params);
      }
      iframe.location.href = url + '#' + (params || '');
      iframe.location.reload();
    }

    function iframeLoad() {
      var url = globals.iframeUrl,
        iframe = globals.iframe;

      iframe.src = url;
    }

    function check(item) {
      var checks = globals.checks,
        idx;

      if (item.checked) {
        checks.push(item);
      } else {
        idx = checks.indexOf(item);
        if (idx > -1) {
          checks.splice(idx, 1);
        }
      }

      console.log('checks', checks);
      triggerUserRoleChange();

    }

    function init() {
      iframeLoad();
    }

    /////////////////$scope functions////////////////////
    vm.check = check;


    vm.$on('btn:role:checked:change', function() {
      var checks = globals.checks;
      BtnRoleService.clear();
      BtnRoleService.setUserRoles(checks);
      iframeReload(checks);

    });

    init();

    return vm;
  })
  .controller('BtnRoleExpCtrl', function($scope) {
    'use strict';

    var vm = $scope;

    return vm;
  });
