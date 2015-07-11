

angular.module('sennit.sharejs-ui', ['sennit.sharejs-serices']).directive('sennitShareView', ['sennitRestApi', function (sennitRestApi) {
    return {
        restrict: 'E',
        templateUrl: '../app/templates/grid-view.html',
        scope: {
            fields: "=",
            list: "=",
            adicionar: "@",
            view: "@",
            pagesize: "="

        },
        controller: function ($scope, $element, $http, sennitRestApi) {
            $scope.data = [];
            $scope.ActualPage = 1;
            $scope.skip = 0;
            $scope.TotalItens = 0;
            $scope.TotalPages = [];
            
            $scope.init = function () {
                _refreshPage();
            };
           
            $scope.Pagina = function (page) {
                $scope.skip = ((page - 1) * $scope.pagesize);
                $scope.ActualPage = page;
                _refreshPage();
            };

            function _refreshPage (){
            
                sennitRestApi.getSharepointListItemCount($scope.list, '').then(function (results) {
                    $scope.TotalItens = results.data.value;
                    var range = [];
                    var total = ($scope.TotalItens / $scope.pagesize);
                    for (var i = 0; i < total; i++) {
                        range.push(i + 1);
                    }

                    $scope.TotalPages = range;
                });

                sennitRestApi.getSharepointList($scope.list, "?$skip=" + $scope.skip + "&$top=" + $scope.pagesize).then(function (results) {
                    $scope.data = results.data.d;
                });

            }

            $scope.new = function () {
                
            };

           

            $scope.viewItem = function (item) {
               
            };




        }

    }
}]);
