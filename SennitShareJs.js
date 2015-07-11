'use strict';
angular.module("sennitShareJs", []).constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
}).factory('sennitRestApi', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

     function getQueryStringParameter(paramToRetrieve) {
         var params =
             document.URL.split("?")[1].split("&");
         for (var i = 0; i < params.length; i = i + 1) {
             var singleParam = params[i].split("=");
             if (singleParam[0] == paramToRetrieve)
                 return singleParam[1];
         }
     }

     var serviceBase =
                 decodeURIComponent(
                     getQueryStringParameter("SPAppWebUrl")
             ).split("#")[0];


    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var sennitRestApiFactory = {};

    var _requestDigest;
    $http({
        method: 'POST',
        url: serviceBase + "/_api/contextinfo",
        headers: { "Accept": "application/json; odata=verbose" }
    }).success(function (data) {
        _requestDigest = data.d.GetContextWebInformation.FormDigestValue
    });

  
    
    var _getSharepointGetUser = function (id, query) {


        return $http({
            method: 'GET',
            url: serviceBase + "_api/Web/GetUserById("+ id +")" + query,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };

    var _getSharepointListById = function (lista, id, query) {
        
        return $http({
            method: 'GET',
            url: serviceBase + "/_api/web/lists/GetByTitle('" + lista + "')/items("+ id +")/" + query,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };

    var _getSharepointList = function (lista, query) {
        
        return $http({
            method: 'GET',
            url: serviceBase + "/_api/web/lists/GetByTitle('" + lista + "')/items" + query,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };
   

    var _getMyProperties = function () {


        return $http({
            method: 'GET',
            url: serviceBase + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };


    
 
    sennitRestApiFactory.getMyProperties = _getMyProperties;
    sennitRestApiFactory.getSharepointGetUser = _getSharepointGetUser;
    sennitRestApiFactory.getSharepointList = _getSharepointList;
    sennitRestApiFactory.getSharepointListById = _getSharepointListById;
    sennitRestApiFactory.requestDigest = _requestDigest;
    
    return sennitRestApiFactory;

}]);