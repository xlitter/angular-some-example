/*global angular*/
(function () {
  'use strict';

  var app = angular.module('app', ['ngSanitize', 'ngNewRouter']);

  app.constant('baseUrl', '');

  app.run(function ($router) {
    $router.config([
      {
        path: '/',
        redirectTo: '/console'
      },
      {
        path: '/console',
        // component: {main: 'console',right:'settings'},
        component: 'console',
        as : 'console'
      },
      {
        path: '/settings',
        component: 'settings'
      },{
        path: '/welcome',
        component: 'welcome'
      }
    ]);
  });

})();