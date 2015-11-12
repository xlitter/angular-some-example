angular.module('app').controller('SettingsController', ['$router', function($router){
	'use strict';
	
	this.name = 'this is settings';
	
	console.log('join to settings');
	
	//在new router 0.5.3中无法实现父子关系路由定义,库存在bug
	// $router.config= [{
	// 	path:'/welcome',
	// 	component: {settings: 'welcome'},
	// 	as : 'welcome'
	// }];
}]);