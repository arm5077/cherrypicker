angular.module("app")
.controller("treeController", ["$scope", "$http", "$sce", "$routeParams", function($scope, $http, $sce, $routeParams){

	$http.get("api/trees/" + $routeParams.id).then(function(tree){
		$scope.tree = tree.data[0];
		
		var map = new google.maps.Map(document.getElementById('mapContainer'), {
			center: {lat: $scope.tree.y, lng: $scope.tree.x},
			zoom: 16,
			disableDefaultUI: true
		});
		
		var marker = new google.maps.Marker({
			position: {lat: $scope.tree.y, lng: $scope.tree.x},
			labelClass: "treeFont",
			map: map,
			icon: '/assets/tree_marker.png'
		});

		
		
	});

}]);