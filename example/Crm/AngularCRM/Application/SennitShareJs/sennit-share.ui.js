

angular.module('sennit.sharejs-ui', ['sennit.sharejs-serices']).directive('gridView', ['sennitRestApi', '$compile', function (sennitRestApi, $compile) {
    return {
        restrict: 'E',
        scope: {
            fields: '=',
            listaname: '@',
            adicionar: '@',
            view: '@',
            pagesize: '='

        }, link: function ($scope, $element, attrs) {
            var HtmlFormBody = "<div class='container' ng-init='init()'><div class='row'><div class='col-md-4'>&nbsp;</div></div><div class='row'><div class='col-md-4'><a href='#/{{listaname}}/new' class='btn btn-default'>Add New</a></div></div><div class='row'><div class='col-md-4'>&nbsp;</div></div>";
            HtmlFormBody += "<div class='row'><div class='table-responsive'><table class='table table-bordered table-hover'><thead class='thead-carrefour'><tr>";
            HtmlFormBody += "<th style='width: 30px;'><input type='checkbox' value='true' data-bind='checked: selectAll' /></th><th ng-repeat='field in fields' class='text-center' id='Sistema.Id' style='cursor:pointer'>{{field.value}}</th><th>Ações</th></tr></thead>";
            HtmlFormBody += "<tbody><tr ng-repeat='datum in data' ng-click='ViewItem(datum)' style='cursor:pointer'><td><input type='checkbox' /></td><td ng-repeat='field in fields' ng-style=&quot;{ 'text-align': field.align}&quot;>";
            HtmlFormBody += "<span ng-repeat='(key, value) in datum ' ng-show='(key==field.name)'>{{value}}</span></td><td class='col-lg-3 col-md-4 col-sm-5 text-center'><a href='#/{{listaname}}/{{datum.ID}}' class='btn btn-primary btn-sm'><i class='fa fa-pencil' aria-hidden='true'></i></a>";
            HtmlFormBody += "<button type='button' class='btn btn-default btn-sm' ng-click='delete(datum.ID)' aria-label='Left Align'><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr></tbody>";
            HtmlFormBody += "<tfoot><tr><td colspan='6' class='row'><div><ul class='pagination'><li><a href='#'>«</a></li><li ng-repeat='page in TotalPages' ng-class=&quot;{'active': page == ActualPage }&quot;><a href='' ng-click='Pagina(page)'>{{page}}</a></li><li><a href='#'>»</a></li></ul>";
            HtmlFormBody += "</div></td></tr></tfoot></table></div></div></div>";
            console.log(HtmlFormBody);

            $element.replaceWith($compile(HtmlFormBody)($scope));

        },
        controller: function ($scope, $element, $http, sennitRestApi) {
            $scope.data = ([]);
            $scope.ActualPage = 1;
            $scope.skip = 0;
            $scope.TotalItens = 0;
            $scope.TotalPages = ([]);

            $scope.init = function () {


                $scope.refreshPage();
            };

            $scope.Pagina = function (page) {
                $scope.skip = ((page - 1) * $scope.pagesize);
                $scope.ActualPage = page;
                $scope.refreshPage();
            };

            $scope.refreshPage = function () {

                sennitRestApi.getSharepointListItemCount($scope.listaname, '').then(function (results) {
                    $scope.TotalItens = results.data.d.ItemCount;
                    var range = [];
                    var total = ($scope.TotalItens / $scope.pagesize);
                    for (var i = 0; i < total; i++) {
                        range.push(i + 1);
                    }
                    $scope.TotalPages = range;
                });

                var query;
                for (var key in $scope.fields) {
                    if (query)
                        query += $scope.fields[key].name + ',';
                    else
                        query = $scope.fields[key].name + ',';
                }

                if ($scope.fields.length)
                    query = query.substring(0, query.length - 1);

                sennitRestApi.getSharepointList($scope.listaname, "?$select=ID," + query + "&$orderby=ID&$skip=" + $scope.skip + "&$top=" + $scope.pagesize).then(function (results) {
                    $scope.data = angular.fromJson(results.data.d);
                });

            }


            $scope.delete = function (id) {
                sennitRestApi.deleteSharepointListItem(id, $scope.listaname);
            };
        }

    }
}]).directive('formView', ['sennitRestApi', '$compile', function (sennitRestApi, $compile) {
    return {
        restrict: 'E',
        scope: {
            fields: '=',
            listaname: '@',
            strupdate: '@'

        }, link: function ($scope, $element, attrs) {
            var HtmlFormBody = "<div class='row' ng-init='init()' ><div class='col-md-12'><div class='row'><div class='col-sm-10 '>";
            console.log($scope.strupdate);
            if ($scope.strupdate == 'false')
                HtmlFormBody += "";
            else
                HtmlFormBody += "";

            for (var key in $scope.fields) {
                HtmlFormBody += "<div class='form-group'><label for='" + $scope.fields[key].name + "'>" + $scope.fields[key].value + "</label><input type='text'  class='form-control'  ng-model='data." + $scope.fields[key].name + "'></input></div>";
            }
            if ($scope.strupdate == 'false')
                HtmlFormBody += "<button type='button' class='btn btn-default' ng-click='add()'>Add</button>";
            else
                HtmlFormBody += "<button type='button' class='btn btn-default' ng-click='update()'>Update</button>";


            HtmlFormBody += "</div></div></div></div>";


            $element.replaceWith($compile(HtmlFormBody)($scope));

        },
        controller: function ($scope, $element, $http, sennitRestApi, $location, $routeParams) {
            $scope.data = ([]);
            $scope.url = ([]);

            $scope.init = function () {

                if ($scope.strupdate == 'true') {
                    return sennitRestApi.getSharepointListById($scope.listaname, $routeParams.id, '').success(function (results) {
                        $scope.contaSelected = angular.fromJson(results.data.d);
                    });
                }
            };

            $scope.add = function () {
                sennitRestApi.addSharepointListItem($scope.listaname, $scope.data).success(function (data) {


                });
            };

            $scope.update = function () {
                sennitRestApi.updateSharepointListItem($scope.data.ID, $scope.listaname, $scope.data).success(function (data) {


                });
            };
        }

    }
}]);






