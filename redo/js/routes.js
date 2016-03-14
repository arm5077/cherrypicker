angular.module("app").config(function($routeProvider){
	$routeProvider.when("/intro", {
		templateUrl: "templates/pages/intro/",
		controller: "introController"
	})
	.when("/loading", {
		templateUrl: "templates/pages/loading/",
		controller: "loadingController"
	})
	.when("/list", {
		templateUrl: "templates/pages/list/",
		controller: "listController"
	})
	.when("/map", {
		templateUrl: "templates/pages/map/",
		controller: "mapController"
	})
	.when("/tree/:id", {
		templateUrl: "templates/pages/tree/",
		controller: "treeController"
	})
	.when("/info", {
		templateUrl: "templates/pages/info/",
		controller: "infoController"
	})
	.otherwise({
		templateUrl: "templates/pages/intro/",
		controller: "introController"
	})
});