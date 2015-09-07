'use strict';
app.controller('homeController', ['$scope', 'homeService', '$http',  function ($scope, homeService, $http) {

    $scope.noticias = ([]);
    $scope.sliders = ([]);
    $scope.cotacoes = ([]);
    $scope.weather =  ([]); 
    $scope.myproperties =  ([]);
    $scope.cidade =  "Sao Paulo";
    $scope.addSlide =([]);
    //$scope.user = $spUser.current();
    

    homeService.getMyProperties().then(function (results) {
        console.log(results);
        $scope.myproperties = angular.fromJson(results.data.d);
    }, function (error) {
        
    });
    
    
    
    homeService.getCotacoes().then(function (results) {
        $scope.cotacoes = angular.fromJson(results.data.query.results.rate);
    }, function (error) {
       
    });




    homeService.getWeather($scope.cidade).then(function (results) {
   
    $scope.weather= angular.fromJson(results.data.query.results.channel.item.condition);
    }, function (error) {
        
    });





    $scope.buscaUsuario = function (idUsuario) {
		
       homeService.getUsuario(idUsuario).then(function (results) {
       	
		    $scope.aniversariantes.push(angular.fromJson(results.data.d));
		
	    }, function (error) {
    	
    	});
        
    };




$scope.weatherIcon= function (stringWeather) {
console.log(stringWeather);
if(stringWeather == 'Mostly Cloudy')
	return "wi-cloudy";
	
	if(stringWeather == 'Cloudy')
	return "wi-cloudy";


	if(stringWeather == 'Sunny')
		return "wi-day-sunny";

	if(stringWeather == 'Light Drizzle')
		return "wi-rain-mix";
		
		
			if(stringWeather == 'Fair')
		return "wi-day-sunny-overcast";




		if(stringWeather == 'Light Rain')
	return "wi-rain-mix";

		if(stringWeather == 'Partly Cloudy')
	return "wi-day-cloudy";

		
    };

    $scope.calcula = function (index) {
		if(index == 0)
			return 1;
		else
			return 0;
		
    };




}]);