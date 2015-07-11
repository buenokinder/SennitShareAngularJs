# SennitShareAngularJs
App Sharepoint using AngularJs

## Requirements

- AngularJS

## Usage

## Get Sharepoint List Example

In your HTML page:
```html
<script src="SennitShareJs.js"></script>
```

```javascript
var app = angular.module('SennitApp', ['sennit.sharejs']);
```

```javascript                                                   
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
```

```javascript
'use strict';
app.controller('employerController', ['$scope', 'employerService',  function ($scope, employerService) {

    $scope.employers = ([]);
 
    employerService.getEmployers().then(function (results) {
        
        $scope.employers = angular.fromJson(results.data.d.results);
        
    }, function (error) {
        
    });
    
}]);
```