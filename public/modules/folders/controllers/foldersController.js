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
			var url2 = '/app/photos/count/'; 
			$http.get(url).success(function(data, status, headers, config) {
			   $scope.results = data;
			   console.log(data);
			   console.log('--------');
			   console.log($scope.results[0].name);
			   var listNames = [];
			   $http.get(url2).success(function(data,status,headers,config){
				   console.log(data);
				   for(var j = 0; j < $scope.results.length; j++){
					   for(var i = 0; i < data.length; i++){
						   if($scope.results[j].name == data[i]._id.tagName){
							   $scope.results[j].numPhotos = data[i].count;
							   break;
						   }
					   }
					   if($scope.results[j].numPhotos == null){
						   $scope.results[j].numPhotos = 0;
					   }
				   }
				   //$scope.results[i].numPhotos = data;
				   //console.log($scope.results[i].numPhotos);
			   });
			   
			   
			});
		};
		
	}
]);