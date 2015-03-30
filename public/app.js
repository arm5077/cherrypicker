app = angular.module("treeApp", ['ngAnimate', 'ngTouch']);
app.controller("treeController", ["$scope", "$http", function($scope, $http){

	$scope.flipped = false;

	
}]);


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

