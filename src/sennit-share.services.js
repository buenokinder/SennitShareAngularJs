
angular.module('sennit.sharejs-serices', [])
  .factory('sennitRestApi', ['$http', function ($http) {


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




      var sennitRestApiFactory = {};

      var _requestDigest;
      $http({
          method: 'POST',
          url: serviceBase + "/_api/contextinfo",
          headers: { "Accept": "application/json; odata=verbose" }
      }).success(function (data) {
          _requestDigest = data.d.GetContextWebInformation.FormDigestValue
      });

      // datetime format 2000-MM-DD
      var _getMonthBirthDayRange = function (firstday, lastday ) {

          return $http({
              method: 'GET',
              url: serviceBase + "/_api/search/query?querytext='*'&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&selectproperties='PreferredName,AccountName,Birthday'&RefinementFilters='Birthday:range(datetime("+ startday +"),datetime(" + lastday + "))'",
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };


      

      var _getSharepointListItemCount = function (lista, query) {

          return $http({
              method: 'GET',
              url: serviceBase + "/_api/web/lists/GetByTitle('" + lista + "')/itemcount" + query,
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };

     var _getMyGroups = function () {


          return $http({
              method: 'GET',
              url: serviceBase + "/_api/web/currentuser/?$expand=groups",
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };


      var _getSharepointGetUser = function (id, query) {


          return $http({
              method: 'GET',
              url: serviceBase + "/_api/Web/GetUserById(" + id + ")" + query,
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };

      var _getSharepointListById = function (lista, id, query) {

          return $http({
              method: 'GET',
              url: serviceBase + "/_api/web/lists/GetByTitle('" + lista + "')/items(" + id + ")/" + query,
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };

      var _getSharepointList = function (lista, query) {

          return $http({
              method: 'GET',
              url: serviceBase + "/_vti_bin/ListData.svc/" + lista  + query,
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


      var _addSharepointListItem = function (list, data) {

          var restQueryUrl = "../_api/web/lists/getByTitle('" + list + "')/items";

          var shareData = {
              __metadata: { "type": "SP.Data." + list + "ListItem" },

          };
          
          for (var key in data) {
              shareData[key] = data[key];
          }


          var requestBody = JSON.stringify(shareData);

          return $http({
              method: 'POST',
              url: restQueryUrl,
              contentType: "application/json;odata=verbose",
              data: requestBody,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": _requestDigest,
                  "content-type": "application/json;odata=verbose"
              }
          });
      };



      var _deleteSharepointListItem = function (id, list) {
          var restQueryUrl = "../_api/web/lists/getByTitle('" + list +"')/items(" + id + ")";
          return $http({
              method: 'DELETE',
              url: restQueryUrl,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": _requestDigest,
                  "If-Match": "*"
              }
          });
      };

      var _updateSharepointListItem = function (id, list, data) {
          var restQueryUrl = "../_api/web/lists/getByTitle('" + list + "')/items(" + id + ")";

          var shareData = {
              __metadata: { "type": "SP.Data." + list + "ListItem" },

          };

          for (var key in data) {
              shareData[key] = data[key];
          }


          var requestBody = JSON.stringify(shareData);

          return $http({
              method: 'POST',
              url: restQueryUrl,
              contentType: "application/json;odata=verbose",
              data: requestBody,
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": _requestDigest,
                  "content-type": "application/json;odata=verbose",
                  "If-Match": etag,
                  "X-HTTP-METHOD": "PATCH"
              }
          });
      }

      var _sendMail= function (from, to, body, subject) {
          var restQueryUrl = "../_api/SP.Utilities.Utility.SendEmail";

          return $http({
              method: 'POST',
              url: restQueryUrl,
              contentType: "application/json;odata=verbose",
              data: JSON.stringify({
        				'properties': {
           					 '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
           					 'From': from,
          					  'To': { 'results':  [to] },
          					  
          					  
          					  'Body': body,
         					   'Subject': subject
       					 }
  				  }
  			 ),
              headers: {
                  "Accept": "application/json; odata=verbose",
                  "X-RequestDigest": _requestDigest,
                  "content-type": "application/json;odata=verbose"
                  
	           }
          });
      }

    
        var _getCurrentUserId = function () {


          return $http({
              method: 'GET',
              url: serviceBase + "/_api/Web/CurrentUser?$select=Id",
              headers: { "Accept": "application/json; odata=verbose" }
          });
      };

      




      sennitRestApiFactory.getCurrentUserId= _getCurrentUserId;

      sennitRestApiFactory.sendMail  = _sendMail;

      sennitRestApiFactory.url = serviceBase;

      

      sennitRestApiFactory.getMyGroups = _getMyGroups;
      sennitRestApiFactory.getMonthBirthDayRange = _getMonthBirthDayRange;
      sennitRestApiFactory.getSharepointListItemCount = _getSharepointListItemCount;
      sennitRestApiFactory.updateSharepointListItem = _updateSharepointListItem;
      sennitRestApiFactory.addSharepointListItem = _addSharepointListItem;
      sennitRestApiFactory.deleteSharepointListItem = _deleteSharepointListItem;
      sennitRestApiFactory.getMyProperties = _getMyProperties;
      sennitRestApiFactory.getSharepointGetUser = _getSharepointGetUser;
      sennitRestApiFactory.getSharepointList = _getSharepointList;
      sennitRestApiFactory.getSharepointListById = _getSharepointListById;
      sennitRestApiFactory.requestDigest = _requestDigest;

      return sennitRestApiFactory;
  }]);
