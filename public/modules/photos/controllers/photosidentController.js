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
.service('myItemSvc', function () {
	this.getName = function(PhotoNames, id) {
		for (var i=0; i < PhotoNames.length; i++) {
			if (PhotoNames[i].id == id) {
				return PhotoNames[i].name;
			}
		}
     };
})
.controller('photosidCtrl', ['$scope', '$rootScope', '$http', '$route', 'myItemSvc',
	function($scope, $rootScope, $http, $route, myItem) {

		$scope.getPhotos = function() {
			
			$scope.tag = $route.current.params.tagName;
			$scope.photoId = $route.current.params.photoId;
			var url = '/app/photos/' + $scope.tag + '/' + $scope.photoId;

			$http.get(url).success(function(data, status, headers, config) {
				$scope.results = data;
				$scope.Tagarr = [];
				$scope.Tagarr = $scope.results[0].tags;
				console.log($scope.Tagarr);

			});
		};
		
		$scope.deleteTag = function(){
			var url2 = '/app/deletetag/';
			var i;
			
			for(i = 0; i < $scope.Tagarr.length; i++){
				if(document.getElementById($scope.Tagarr[i]).checked){
					var update = {};
					update.tagName = $scope.Tagarr[i];
					if(update.tagName == "untagged")
						break;
					update.id = $scope.results[0].id;
					update.Tagarr = $scope.Tagarr;
					console.log(update);
					console.log('tagArr' + update.Tagarr);
					$http.put(url2, update).success(function(data, status, headers, config) {});
				}
			}
			console.log('length: ' + $scope.Tagarr.length);
			/*if(count == $scope.Tagarr.length){
				var url3 = 'app/resettag/';
				$http.put(url3, update).success(function(data, status, headers, config) {});
				count = 0;
			}*/
		};
		
		
		$scope.deletePhoto = function(){
			console.log($scope.results);
			var test = '/app/deletephoto/';
			console.log(test);
			$http.put(test, $scope.results).success(function(data, status, headers, config) {});
			
		};
	}
]);