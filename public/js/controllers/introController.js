angular.module("app")
.controller("introController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.timeUntilBloom = function(){
		// Bloom range, from the National Park Service
		var bloomRange = {
			start: moment("2017-03-19T00:00:00-0400"), 
			end: moment("2017-03-22T23:59:59-0400")
		};
		
		// It's before peak bloom, return the amount of time left;
		if( moment().isBefore(bloomRange.start) )
			return "Peak bloom is <strong>" + Math.ceil(moment(bloomRange.start).diff(moment()) / 1000 / 60 / 60 / 24) + " days</strong> away";
			
		// If it's in the middle of peak bloom
		else if( moment().isBetween(bloomRange.start, bloomRange.end) )
			return "You've got <strong>" + Math.ceil(moment(bloomRange.end).diff(moment()) / 1000 / 60 / 60 / 24) + " days</strong> of peak bloom left";
		
		else return "Peak bloom is over";
		
		
	}
	
}]);