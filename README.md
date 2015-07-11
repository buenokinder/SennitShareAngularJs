# SennitShareAngularJs
Sharepoint + Angular Js Framework

Get Sharepoint List Example


var app = angular.module('SennitApp', ['sennit.sharejs']);


                                                   
app.factory('employerService', ['$http', 'sennitRestApi', function ($http, sennitRestApi) {

    var employerServiceFactory = {};
	
    var _getEmployers = function () {      
        return sennitRestApi.getSharepointList('employer', '');
    };

    var getgetEmployers = function (id) {
        
        return sennitRestApi.getSharepointListById('employer', id, '?$´select=ID,Title');

    };

   employerServiceFactory.getEmployers = _getEmployers;
    
    return employerServiceFactory;

}]);


'use strict';
app.controller('employerController', ['$scope', 'employerService',  function ($scope, employerService) {

    $scope.employers = ([]);
 
    employerService.getEmployers().then(function (results) {
        
        $scope.employers = angular.fromJson(results.data.d.results);
        
    }, function (error) {
        
    });
    
}]);