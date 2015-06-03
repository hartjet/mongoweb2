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
				$scope.tagLists.push($scope.tag);
				$scope.createTag();
			});
		};
		$scope.createTag = function()
		{
			console.log('createtag');
			var newtag = {};
			newtag.name = "";
			newtag.user = [$rootScope.user];
			newtag.id = 100;
			$scope.tag = newtag;
		};
		
		$scope.updateTag = function()
		{
			console.log('updatetag');
			var i;
			var k;
			var tagArr = [];
			var picArr = [];
			for(i = 0; i < $scope.tagLists.length; i++){
				if(document.getElementById($scope.tagLists[i].name).checked){
					tagArr.push($scope.tagLists[i].name);
				}
			}
			console.log(tagArr);
			if(tagArr.length > 0){
				for(k = 0; k < $scope.results.length; k++){
					var lol = document.getElementById($scope.results[k].location);
					if(lol == null){
						console.log("lol is null");
						console.log($scope.results[k].location);
						console.log(document);
					} else {
						console.log(lol);
					if(lol.checked){
						picArr.push($scope.results[k]._id);
						var update = {};
						update.id = $scope.results[k]._id;
						update.tags = tagArr;
						update.tagName = "untagged";
						update.photoId = $scope.results[k].id;
						console.log("controller: ");
						console.log(update);
						console.log(" end controller");
						
						$http.put('/app/photos/tags/', update).success(function(data,status,headers,config){})
						
						$http.put('/app/deletedefaultTag/', update).success(function(data,status,headers,config){})
					}
					}
				}
				console.log(picArr);
			} else {
				
				/*var j;
				for(j = 0; j < $scope.results.length; j++){
					var update = {};
					update.id = $scope.results[j]._id;
				
				console.log("No tags selected");
				$http.put('/app/photos/defaultTag/', update).success(function(data,status,headers,config){})
				}
				*/
			}
		};
	}
]);
