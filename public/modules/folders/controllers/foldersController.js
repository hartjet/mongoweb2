'use strict';

/**
 * @ngdoc show folders
 * @name Photo app
 * @description
 * # Photo app
 *
 * Main module of the application.
 */
 angular
.module('photoApp')
.controller('foldersCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		$scope.getFolders = function() {
			//var url = '/app/json/folders.json';
			var url = '/app/tags';
			$http.get(url).success(function(data, status, headers, config) {
			   $scope.results = data;
			   //console.log($scope.results);
			   var listNames = [];
			   for (var i = 0; i < data.length; i++) {
				   listNames[i] = { "name": data[i].name, "id": data[i].id };
			   }
			   $rootScope.listNames = listNames;
			});
		};
	}
]);