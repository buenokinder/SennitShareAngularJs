# SennitShareAngularJs
App Sharepoint using AngularJs

## Requirements

- AngularJS

## Usage



In your HTML page:
```html
    <script src="SennitShareJs/sennit-share.services.js"></script>
    <script src="SennitShareJs/sennit-share.ui.js"></script>
```

Inside of the JS File:
```javascript
var app = angular.module('SennitApp', ['sennit.sharejs-serices', 'sennit.sharejs-ui']);
```
## Grid-View Example


```html
<div  data-ng-app="SennitApp">
<grid-view fields="[{'name': 'Title' , 'value': 'Razao Social'},{'name': 'CNPJ' , 'value': 'CNPJ'},{'name': 'Complemento' , 'value': 'Complemento'}]" listaname="Contas"  pagesize="5"></grid-view>
<div>
```

![alt tag](https://raw.githubusercontent.com/buenokinder/SennitShareAngularJs/Version-2/img/gridview.PNG)

In **fields** you put array with the properties name and value, name is a orignal name in Sharepoint List and value the friendly name

In **listaname** you put you lista name, sensitive case

**pagesize** is the length of the page

## Form-View Example


```html
<div  data-ng-app="SennitApp">
<form-view fields="[{'name': 'Title' , 'value': 'Razao Social'},{'name': 'CNPJ' , 'value': 'CNPJ'},{'name': 'Complemento' , 'value': 'Complemento'}]" listaname="Contas" strupdate="false"></form-view>
<div>
```

![alt tag](https://raw.githubusercontent.com/buenokinder/SennitShareAngularJs/Version-2/img/newform.PNG)

If the propertie **strupdate** is **true** the module work with update method, UI and Services.

![alt tag](https://github.com/buenokinder/SennitShareAngularJs/blob/Version-2/img/update.PNG)


## Howto use Easly Sharepoint RestApi with sennitRestApi

## Get Sharepoint List Example

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
