'use strict';

/**
 * @ngdoc show photos
 * @name Photo app
 * @description
 * # Photo app
 *
 * Main module of the application.
 */
 angular
.module('photoApp')
.controller('addphotosCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		/*
		$scope.getPhotos = function() {
			var url = '/app/json/addphotos.json';
			$http.get(url).success(function(data, status, headers, config) {
			   $scope.results = data;
			   var listNames = [];
			   for (var i = 0; i < data.length; i++) {
				   listNames[i] = { "name": data[i].name, "id": data[i].id };
			   }
			   $rootScope.listNames = listNames;
			});
		};
		*/
	//};
		$scope.writePhoto = function(){
			console.log($scope.photo);
			$http.post('/app/addphotos/', $scope.photo).success(function(data, status, headers, config){
				$scope.photo.id = data;
			});
		};
		$scope.initNewPhoto = function(){
			var newPhoto = {};
			newPhoto.name = "";
			newPhoto.id = "";
			newPhoto.location = "";
			newPhoto.tags = ["untagged"];
			$scope.photo = newPhoto;
		};
		$scope.getPhotos = function() {
			var url = '/app/photos/tags/untagged';
			$http.get(url).success(function(data, status, headers, config) {
				$scope.results = data;					
			});

		};
	}
]);