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
.controller('photosCtrl', ['$scope', '$rootScope', '$http', '$route', 'myItemSvc',
	function($scope, $rootScope, $http, $route, myItem) {
		$scope.getPhotos = function() {
			$scope.tag = $route.current.params.tagName;

			var url = '/app/photos/tags/' + $scope.tag;

			$http.get(url).success(function(data, status, headers, config) {
				
				$scope.results = data;
										
			});
			//$scope.listName = myItem.getName($rootScope.PhotoNames, $scope.tag);
			//$scope.listName = tagName;
			//console.log($scope.listName);
		};
	}
]);