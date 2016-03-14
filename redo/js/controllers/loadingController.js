angular.module("app")
.controller("loadingController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.tasks = ["Finding your location..."]
	$scope.treeIcons = [];
		
	setTimeout(function(){
		$scope.tasks.push("This is taking a long time! Something might be wrong.");	
	}, 15000)	
	
	// Locate user
	if( navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			console.log(position);
			$scope.$apply(function(){ 
				$scope.$parent.position = position.coords;
				$scope.tasks.push("Got your position! Looking for trees...");
				
				// Query trees
				$http.get("/api/nearest/" + position.coords.longitude + "/" + position.coords.latitude).then(function(data){
					$scope.tasks.push("Found some trees!")
					$scope.$parent.trees = (data.data);
					setTimeout(function(){
						window.location.hash="/list";
					}, 500)
				})
			})
		});
	}
	else {
		$scope.tasks.push("Looks like your GPS isn't working? Try refreshing!");	
	}
}]);