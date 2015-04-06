app = angular.module("treeApp", ['ngAnimate', 'ngTouch', 'swipe']);

var directionsService = new google.maps.DirectionsService();

app.controller("treeController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	window.scroll(0,0);
	
	$scope.flipped = false;
	$scope.onStage = "search";
	$scope.accuracy = "";
	$scope.console = console;

	$scope.renderHTML = function(html){
		return $sce.trustAsHtml(html);
	};

	$scope.getTree = function(){
		console.log("asking for tree");
		$scope.flipped = true;
		if( navigator.geolocation){
			navigator.geolocation.watchPosition(function(position){
				console.log(position);
				if(position.coords.accuracy < $scope.accuracy || $scope.accuracy = ""){
					$scope.accuracy = position.coords.accuracy;
					
					$http.get("nearest/" + position.coords.longitude + "/" + position.coords.latitude)
						.success(function(data, status, headers, config){
							console.log("got response");
							$scope.loaded = true;
							$scope.result = data[0];
							$scope.result.distance = getDistance(data[0].x, data[0].y, position.coords.longitude, position.coords.latitude) + " " + getDirection(data[0].x, data[0].y, -122.6819,45.5200);
							$scope.flipped = false;

							var request = {
								origin: position.coords.latitude + "," + position.coords.longitude,
								destination: data[0].y + "," + data[0].x,
								travelMode: google.maps.TravelMode.WALKING
							}

							directionsService.route(request, function(result, status) {
								if (status == google.maps.DirectionsStatus.OK) {
									$scope.route = result.routes[0];
									console.log($scope.route);
								} else {
									console.log(status)
								}
				  			});
						})
						.error(function(err){
							console.log(err);
						});
				}
			}, function(error){
				console.log(error);
			});
		}
		else {
			alert("You don't have the ability to geolocate :-(");
		}
		
	}
	
}]);

// Thanks to http://www.movable-type.co.uk/scripts/latlong.html for this function
function getDistance(lon1, lat1, lon2, lat2){
	var φ1 = lat1.toRadians(), φ2 = lat2.toRadians(), Δλ = (lon2-lon1).toRadians(), R = 20925524.9; // gives d in feet
	return d = Math.round(Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R);
}

function getDirection(lon1, lat1, lon2, lat2){
	direction = "";
	//direction += (lat2-lat1 >= 0) ? "N" : "S";
	//direction += (lon2-lon1 >= 0) ? "E" : "W";
	return direction;
}

if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}



app.directive("centerX", function(){
	return function(scope, element, attr){
		setInterval(resize, 100);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				left: Math.floor((element.parent()[0].offsetWidth - element[0].offsetWidth) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

app.directive("centerY", function(){
	return function(scope, element, attr){
		setInterval(resize, 100);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				top: Math.floor((element.parent()[0].offsetHeight - element[0].offsetHeight) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

app.directive("onTop", function(){
	return function(scope, element, attr){
		target = $("#" + $(element[0]).attr("above"));
		setInterval(function(){resize( $("#" + $(element[0]).attr("above")) )}, 100);
		angular.element(window).on("resize", resize( $("#" + $(element[0]).attr("above")) ));
		function resize(target){
			element.css({
				top: Math.floor( target.position().top - $(element[0]).outerHeight() - ($(element[0]).attr("margin-bottom") || 0) ) + "px",
				left: Math.floor( target.position().left + (target.outerWidth() - $(element[0]).outerWidth() ) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

app.directive("onBottom", function(){
	return function(scope, element, attr){
		target = $("#" + $(element).attr("below"));
		setInterval(function(){ resize($("#" + $(element[0]).attr("below"))) }, 100);
		angular.element(window).on("resize", function(){ resize($("#" + $(element[0]).attr("below"))) });
		function resize(target){
			element.css({
				top: Math.floor( target.position().top + target.outerHeight() + parseInt($(element[0]).attr("margin-top") || 0) ) + "px",
				left: Math.floor( target.position().left + (target.outerWidth() - $(element[0]).outerWidth() ) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

