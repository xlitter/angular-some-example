(function () {
	angular.module('app').controller('ConsoleController', ConsoleController);

	function ConsoleController($routeParams) {
		var formData = this.formData = {};
		
		formData.name = 'Firend';
		
 	  console.log('join to console');
	}
	
	ConsoleController.$inject = ['$router', '$routeParams'];
	
 
})();