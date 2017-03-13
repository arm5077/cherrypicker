angular.module("app", ['ngRoute', 'ngAnimate'])
.controller("mainController", ["$scope", "$http", "$sce", "$window", function($scope, $http, $sce, $window){
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	FastClick.attach(document.body);
	
	$scope.trees = [];
	$scope.Math = Math;
	$scope.moment = moment;
	
}])
.directive("back", function() {
	return {
		link: function(scope, element, attr) {
			element.on('click', function() {
		         history.back();
		     });
		}
	};	

})