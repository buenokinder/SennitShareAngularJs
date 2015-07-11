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

Inside of the JS File:
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


## Add Item in Sharepoint List Example


```javascript                                                   
app.factory('employerService', ['$http', 'sennitRestApi', function ($http, sennitRestApi) {

    var employerServiceFactory = {};
	
  

    var _addEmployer = function (data) {
        return sennitRestApi.addSharepointListItem('employer', data);

    };

   employerServiceFactory.addEmployer = _addEmployer;
    
    return employerServiceFactory;

}]);
```

```javascript
'use strict';
app.controller('employerController', ['$scope', 'employerService',  function ($scope, employerService) {

    $scope.employers = ([]);
	$scope.Title = "";
	$scope.JobDescription = "";
		
    $scope.addCustomer = function () {
		$scope.employers.Title = $scope.Title;
		$scope.employers.JobDescription = $scope.JobDescription;
		employerService.addEmployer($scope.employers)
			.success(function (data) {
				$location.path("/");
			}
		);
	}
	 
    
}]);
```