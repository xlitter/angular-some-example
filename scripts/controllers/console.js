angular.module('app').controller('ConsoleCtrl', ['$rootScope', '$scope', '$state',
  function($rootScope, $scope, $state) {
    'use strict';

    var vm = $scope,
      globals = {
        //菜单与路由映射关系
        stateAndMenus: {}
      },
      formData = vm.formData = {},
      menus = vm.menus = [{
        name: '权限',
        clazz: 'fa fa-circle-o',
        children: [{
          name: '按钮权限',
          clazz: 'fa fa-circle-o',
          state: 'BtnRole',
          relation: [],
          o: 0
        }],
        o: 0
      }, {
        name: '树',
        clazz: 'fa fa-circle-o',
        children: [{
          name: '选择框树形控件',
          clazz: 'fa fa-circle-o',
          state: 'CheckBoxTree',
          relation: [],
          o: 0
        }],
        o: 0
      }, {
        name: '图片上传',
        clazz: 'fa fa-circle-o',
        children: [{
          name: '图片上传',
          clazz: 'fa fa-circle-o',
          state: 'ImageUpload',
          relation: [],
          o: 0
        }, {
          name: '图片上传2',
          clazz: 'fa fa-circle-o',
          state: 'ImageUpload2',
          relation: [],
          o: 0
        }],
        o: 0
      }, {
        name: '文本编辑器',
        clazz: 'fa fa-circle-o',
        children: [{
          name: '文本编辑器',
          clazz: 'fa fa-circle-o',
          state: 'Ueditor',
          relation: [],
          o: 0
        }],
        o: 0
      }];

    /////////////functions///////////////
    //添加菜单层级与父元素
    function reCfgMenus(menus, parent, level) {
      menus.forEach(function(v) {
        var child = v.children;
        if (angular.isArray(child)) {
          reCfgMenus(child, v, level + 1);
        }
        v.parent = parent;
        v.level = level;
      });
    }

    //router state与菜单映射关系
    function bulidStateAndMenuInfo(menus, result) {
      result = result || {};
      menus.forEach(function(v) {
        //如出现重复state则  throw error
        if (result[v.state]) {
          throw new Error(v.state + ' state is already exists');
        }

        if (typeof v.state === 'string') {
          result[v.state] = v;
        }

        //关系
        if (angular.isArray(v.relation)) {
          v.relation.forEach(function(item) {
            result[item] = v;
          })
        }

        if (Array.isArray(v.children)) {
          bulidStateAndMenuInfo(v.children, result);
        }
      });
    }

    function selectedMenu(stateName) {
      var menu;
      formData.selectedMenu1 = null;
      formData.selectedMenu2 = null;
      formData.selectedMenu3 = null;

      if (stateName) {
        menu = globals.stateAndMenus[stateName];
        while (menu) {
          formData['selectedMenu' + menu.level] = menu;
          menu = menu.parent;
        }
      }
    }

    function locateMenu(state) {
      selectedMenu(state.name);
    }

    function init() {
      reCfgMenus(menus, null, 1);
      bulidStateAndMenuInfo(menus, globals.stateAndMenus);
      locateMenu($state.current);
    }

    ////////////////$scope functions/////////////////
    vm.selectMenu = function(e, menuItem) {
      e.preventDefault();
      e.stopPropagation();
      var stateName = menuItem.state;
      if (stateName) {
        //当使用reload:true时会重新生成一个scope,init方法都会再次执行
        $state.go(menuItem.state);
      } else {
        if (formData['selectedMenu' + menuItem.level] === menuItem) {
          formData['selectedMenu' + menuItem.level] = null;
        } else {
          formData['selectedMenu' + menuItem.level] = menuItem;
        }

        while (menuItem.parent) {
          menuItem = menuItem.parent;
          formData['selectedMenu' + menuItem.level] = menuItem;
        }
      }
    };

    ///////////////////watches//////////////////////////////

    ///////////////////Events///////////////////
    $scope.$on('router:state:change', function(event, toState) {
      event.preventDefault();
      locateMenu(toState);
    });

    init();
    return vm;
  }
]);
