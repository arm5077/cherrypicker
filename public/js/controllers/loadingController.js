angular.module("app")
.controller("loadingController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.tasks = ["Finding your location..."]
	$scope.treeIcons = [];
		
	setTimeout(function(){
		$scope.$apply(function(){
			$scope.tasks.push("This is taking a long time! Make sure <a href='https://support.apple.com/en-us/HT203033' target='none'>location services</a> are enabled.");	
		})
	}, 10000)	
	
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
					
					// If there are no nearby trees, get random
					if( $scope.$parent.trees[0].distance >= .1 ){
						$http.get("/api/random").then(function(data){
							$scope.$parent.trees = (data.data);
							setTimeout(function(){
								window.location.hash="/map/random";
							}, 1000)
							
						});
					}
					else {
						setTimeout(function(){
							window.location.hash="/list";
						}, 1000)
					}	
					
					
				})
			})
		});
	}
	else {
		$scope.tasks.push("Looks like your GPS isn't working? Make sure <a href='https://support.apple.com/en-us/HT203033' target='none'>location services</a> are allowed.");	
	}
}]);