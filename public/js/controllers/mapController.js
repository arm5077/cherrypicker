angular.module("app")
.controller("mapController", ["$scope", "$http", "$sce", "$routeParams", function($scope, $http, $sce, $routeParams){	

	if( $scope.$parent.trees.length <= 0 )
		window.location.hash = "loading";
	else {
		var map = null;
		map = new google.maps.Map(document.getElementById('mapContainer'), {
			center: {lat: $scope.position.latitude, lng: $scope.position.longitude},
			zoom: 12
		});

		var bounds = new google.maps.LatLngBounds();
		$scope.$parent.trees.forEach(function(tree){
			var marker = new google.maps.Marker({
				position: {lat: +tree.y, lng: +tree.x},
				labelClass: "treeFont",
				map: map,
				icon: '/assets/tree_marker.png'
			});
			bounds.extend(marker.getPosition())

			marker.addListener('click', function() {
				window.location.hash = "/tree/" + tree.id;
			});

		});

		var marker = new google.maps.Marker({
			position: {lat: $scope.position.latitude, lng: $scope.position.longitude},
			labelClass: "treeFont",
			map: map,
			icon: '/assets/house_marker.png'
		});



		map.fitBounds(bounds);
	
		if( $routeParams.random ){
			$scope.errorMessage = "You're too far from a cherry tree! I gave you a smattering of trees instead."
		}
	
	}

}]);