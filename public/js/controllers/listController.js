angular.module("app")
.controller("listController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	if( $scope.$parent.trees.length <= 0 )
		window.location.hash = "/loading";
	
}]);