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


.controller('addtagCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		
		$scope.getTags = function() {
			var url = '/app/tags';
			$http.get(url).success(function(data, status, headers, config) {
			   $scope.tagLists = data;
			   var listNames = [];
			   for (var i = 0; i < data.length; i++) {
				   listNames[i] = { "name": data[i].name, "id": data[i].id };
			   }
			   $rootScope.listNames = listNames;
			});
		};
		/*
		$scope.getPhotos = function(){
			var url = '/app/json/photos/2.json';
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
		
		$scope.getPhotos = function(){
			var url = '/app/photos/tags/' + 'untagged';
			$http.get(url).success(function(data, status, headers, config){
				$scope.results = data;
			});
		};	
		
		$scope.writeTag = function()
		{
			console.log('writetag');
			console.log($scope.tag);
			$http.post('/app/tags', $scope.tag).success(function(data,status,headers,config){
				$scope.tag.id = data;
			})
		};
		$scope.createTag = function()
		{
			console.log('createtag');
			var newtag = {};
			newtag.name = "";
			newtag.id = 100;
			$scope.tag = newtag;
		};
		
		$scope.updateTag = function()
		{
			console.log('updatetag');
			var i;
			var k;
			for(i = 0; i < $scope.tagLists.length; i++){
				if(document.getElementById($scope.tagLists[i].name).checked){
					for(k = 0; k < $scope.results.length; k++){
						if(document.getElementById($scope.results[k].name).checked){
							console.log($scope.tagLists[i].name);
							console.log($scope.results);
							
						}
					}
				}
			}	
			
			/*
			var k;
			for(k = 0; k < $scope.results.length; k++){
				if(document.getElementById($scope.results[k].name).checked){
					console.log($scope.results[k].name);
				}
			}
			*/
		};
	}
]);
