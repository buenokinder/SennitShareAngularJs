
var app = angular.module('SennitApp', ['ngRoute', 'ngLoadingSpinner', 'ui.bootstrap', 'sennit.sharejs-serices', 'sennit.sharejs-ui']);

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


app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.when("/home", {
        title: 'Inicio',
        controller: "homeController",
        templateUrl: "../Application/views/home.html"
    });

    $routeProvider.when("/Contas", {
        title: 'Inicio',
        templateUrl: "../Application/views/contas/index.html"
    }).when('/Contas/new', {
        title: 'contas',
        templateUrl: '../Application/views/contas/new.html'
    }).when("/Contas/:id", {
        title: 'contas',
        templateUrl: "../Application/views/contas/show.html"
    });;


    $routeProvider.when("/Contatos", {
        title: 'Inicio',
        templateUrl: "../Application/views/contatos/indexContatos.html"
    }).when('/Contatos/new', {
        title: 'Contatos',
        templateUrl: '../Application/views/contatos/newContatos.html'
    }).when("/Contatos/:id", {
        title: 'Contatos',
        templateUrl: "../Application/views/contatos/showContatos.html"
    });;


    $routeProvider.when("/Oportunidade", {
        title: 'Inicio',
        templateUrl: "../Application/views/oportunidade/indexOportunidade.html"
    }).when('/Oportunidade/new', {
        title: 'Oportunidade',
        templateUrl: '../Application/views/oportunidade/newOportunidade.html'
    }).when("/Oportunidade/:id", {
        title: 'Oportunidade',
        templateUrl: "../Application/views/oportunidade/showOportunidade.html"
    });;

    $routeProvider.when("/Proposta", {
        title: 'Inicio',
        templateUrl: "../Application/views/proposta/indexProposta.html"
    }).when('/Proposta/new', {
        title: 'Proposta',
        templateUrl: '../Application/views/proposta/newProposta.html'
    }).when("/Proposta/:id", {
        title: 'Proposta',
        templateUrl: "../Application/views/proposta/showProposta.html"
    });;



    $routeProvider.otherwise({ redirectTo: "/home" });

}]);

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});


