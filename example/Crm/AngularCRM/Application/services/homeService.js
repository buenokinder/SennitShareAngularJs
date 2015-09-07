
'use strict';


app.factory('homeService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var homeServiceFactory = {};

    var _getNoticias = function () {
        return _getSharepointGet('noticias', '?$select=Id,Title,Created,Chamada,File/ServerRelativeUrl&$expand=File/Id&$top=4');
    };
    var _getNoticiasTodas = function () {
        return _getSharepointGet('noticias', '?$select=Id,Title,Created,Chamada,File/ServerRelativeUrl&$expand=File/Id');
    };

    var _getNoticiasFilter = function (filter) {
        return _getSharepointGet('noticias', "?$select=Id,Title,Created,Chamada,CorpoHTML,File/ServerRelativeUrl&$expand=File/Id&$filter=substringof('" + filter + "', Title)");
    };
var _getContas = function () {
        return _getSharepointGet('contato', '');
    };

    var _getNoticiasById = function (Id) {
        return _getSharepointGet('noticias', "?$filter=Id eq " + Id);
    };
    
    var requestDigest;
    $http({
        method: 'POST',
        url: "../_api/contextinfo",
        headers: { "Accept": "application/json; odata=verbose" }
    }).success(function (data) {
        requestDigest = data.d.GetContextWebInformation.FormDigestValue
    });

    var _getMyProperties = function () {
     

		return $http({
            method: 'GET',
            url: serviceBase + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };

  

    
     var _getUsuario = function (Id) {
        return _getSharepointGetUser(Id,"?$select=id,Title");
     };

    
     function getQueryStringParameter(paramToRetrieve) {
         var params =
             document.URL.split("?")[1].split("&");
         for (var i = 0; i < params.length; i = i + 1) {
             var singleParam = params[i].split("=");
             if (singleParam[0] == paramToRetrieve)
                 return singleParam[1];
         }
     }
    
    var _getCotacoes = function () {
        return _getApi('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair in ("USDBRL","EURBRL")&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
    };

    var _getWeather = function (Cidade) {
        return _getApi('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + Cidade + '%2C%20sp%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
    };



    var _Menus = function () {
        return _getSharepointGet('menu', "?$select=Title,SubMenu/Title,SubMenu/Url&$expand=SubMenu");
    };

    var _getSliders = function (id) {
        return _getSharepointGet('slider', '?$select=Id,Title,Ordem,Url,File/ServerRelativeUrl&$expand=File/Id&$top=3&$orderby=Ordem');
    };




    var _getSharepointGetUser = function (id, query) {


        return $http({
            method: 'GET',
            url: serviceBase + "_api/Web/GetUserById("+ id +")" + query,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };


    var _getSharepointGet = function (lista, query) {
        var hostweburl =
     decodeURIComponent(
         getQueryStringParameter("SPHostUrl")
 );
        var appweburl =
            decodeURIComponent(
                getQueryStringParameter("SPAppWebUrl")
        );

        appweburl = appweburl.split("#");
        
        return $http({
            method: 'GET',
            url: appweburl[0] + "/_api/web/lists/GetByTitle('" + lista + "')/items" + query,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };
   
   var _getApi= function (urlApi) {
 
        return $http.get(urlApi);
    };

    

    
 
    
	   
	   homeServiceFactory.getContas = _getContas;
    homeServiceFactory.getNoticiasFilter = _getNoticiasFilter;      
    homeServiceFactory.getMyProperties = _getMyProperties;
    homeServiceFactory.getNoticiasTodas = _getNoticiasTodas ;
	homeServiceFactory.getUsuario= _getUsuario;
	

    homeServiceFactory.getCotacoes = _getCotacoes ;
	homeServiceFactory.getWeather = _getWeather;
    
    homeServiceFactory.getNoticias = _getNoticias;
    homeServiceFactory.getSliders = _getSliders;

    homeServiceFactory.getNoticiasById = _getNoticiasById;
    

    return homeServiceFactory;

}]);