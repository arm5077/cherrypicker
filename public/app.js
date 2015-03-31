app = angular.module("treeApp", ['ngAnimate', 'ngTouch']);

app.controller("treeController", ["$scope", "$http", function($scope, $http){

	$scope.flipped = false;
	$scope.console = console;

	$scope.getTree = function(){
		console.log("asking for tree");
		$scope.flipped = true;
		if( navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				console.log(position);
				$http.get("/nearest/" + position.coords.longitude + "/" + position.coords.latitude)
					.success(function(data, status, headers, config){
						console.log("got response");
						$scope.loaded = true;
						$scope.result = {};
						$scope.result.distance = getDistance(data[0].x, data[0].y, position.coords.longitude, position.coords.latitude) + " " + getDirection(data[0].x, data[0].y, -122.6819,45.5200);
						$scope.flipped = false;
					})
					.error(function(err){
						console.log(err);
					});
			}, function(error){
				console.log(error);
			});
		}
		else {
			console.log("You don't have the ability to geolocate :-(");
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
	direction += (lat2-lat1 >= 0) ? "N" : "S";
	direction += (lon2-lon1 >= 0) ? "E" : "W";
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
		setInterval(resize, 100);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				top: ( $("#centered").offset().top - $(element[0]).outerHeight() - $(element[0]).attr("margin-bottom") ) + "px",
				left: ( $("#centered").offset().left + ($("#centered").outerWidth() - $(element[0]).outerWidth() ) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

app.directive("onBottom", function(){
	return function(scope, element, attr){
		setInterval(resize, 100);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				top: Math.floor( $("#centered").offset().top + $("#centered").outerHeight() + parseInt($(element[0]).attr("margin-top") || 0) ) + "px",
				left: Math.floor( $("#centered").offset().left + ($("#centered").outerWidth() - $(element[0]).outerWidth() ) / 2 ) + "px",
				position: "absolute"
			});
		}
	}
});

