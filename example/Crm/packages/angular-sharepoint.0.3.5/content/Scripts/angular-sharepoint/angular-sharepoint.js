'use strict';
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint.Core
 *
 * @description
 *
 * # ExpertsInside.SharePoint.Core
 *
 * The ExpertsInside.SharePoint.Core module contains utility services
 * used by the other modules.
 */
angular.module('ExpertsInside.SharePoint.Core', ['ng']).run([
  '$window',
  '$log',
  function ($window, $log) {
    if (angular.isUndefined($window.ShareCoffee)) {
      $log.warn('ExpertsInside.SharePoint.Core module depends on ShareCoffee. ' + 'Please include ShareCoffee.js in your document');
    }
  }
]);
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint.List
 * @requires ExpertsInside.SharePoint.Core
 *
 * @description
 *
 * # ExpertsInside.SharePoint.List
 *
 * The ExpertsInside.SharePoint.List module contains the
 * {@link ExpertsInside.SharePoint.List.$spList `$spList`} service,
 * a wrapper for the List REST API
 */
angular.module('ExpertsInside.SharePoint.List', ['ExpertsInside.SharePoint.Core']);
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint.Search
 * @requires ExpertsInside.SharePoint.Core
 *
 * @description
 *
 * # ExpertsInside.SharePoint.Search
 *
 * The ExpertsInside.SharePoint.Search module contains the
 * {@link ExpertsInside.SharePoint.Search.$spSearch `$spSearch`} service,
 * a wrapper for the Search REST API.
 *
 * Include **ShareCoffee.Search.js** when using this module !
 */
angular.module('ExpertsInside.SharePoint.Search', ['ExpertsInside.SharePoint.Core']).run([
  '$window',
  '$log',
  function ($window, $log) {
    if (angular.isUndefined($window.ShareCoffee) || angular.isUndefined($window.ShareCoffee.QueryProperties)) {
      $log.warn('ExpertsInside.SharePoint.Search module depends on ShareCoffee.Search. ' + 'Please include ShareCoffee.Search.js in your document');
    }
  }
]);
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint.User
 * @requires ExpertsInside.SharePoint.Core
 *
 * @description
 *
 * # ExpertsInside.SharePoint.User
 *
 * The ExpertsInside.SharePoint.User module contains the
 * {@link ExpertsInside.SharePoint.User.$spUser `$spUser`} service,
 * a wrapper for the User Profiles REST API
 *
 * Include **ShareCoffee.UserProfiles.js** when using this module !
 */
angular.module('ExpertsInside.SharePoint.User', ['ExpertsInside.SharePoint.Core']).run([
  '$window',
  '$log',
  function ($window, $log) {
    if (angular.isUndefined($window.ShareCoffee) || angular.isUndefined($window.ShareCoffee.UserProfileProperties)) {
      $log.warn('ExpertsInside.SharePoint.User module depends on ShareCoffee.UserProfiles. ' + 'Please include ShareCoffee.UserProfiles.js in your document');
    }
  }
]);
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint.JSOM
 *
 * @description
 *
 * # ExpertsInside.SharePoint.JSOM
 *
 * The ExpertsInside.SharePoint.User module contains the
 * {@link ExpertsInside.SharePoint.User.$spUser `$spUser`} service,
 * a wrapper for the User Profiles REST API
 *
 * Include **ShareCoffee.UserProfiles.js** when using this module !
 */
angular.module('ExpertsInside.SharePoint.JSOM', []).run([
  '$window',
  '$log',
  function ($window, $log) {
    if (angular.isUndefined($window.SP) || angular.isUndefined($window.SP.ClientContext)) {
      $log.warn('ExpertsInside.SharePoint.JSOM module depends on the SharePoint Javascript Runtime. ' + 'For more information see: http://blogs.msdn.com/b/officeapps/archive/2012/09/04/using-the-javascript-object-model-jsom-in-apps-for-sharepoint.aspx');
    }
  }
]);
/**
 * @ngdoc overview
 * @name ExpertsInside.SharePoint
 * @requires ExpertsInside.SharePoint.Core
 * @requires ExpertsInside.SharePoint.List
 * @requires ExpertsInside.SharePoint.Search
 * @requires ExpertsInside.SharePoint.User
 * @requires ExpertsInside.SharePoint.JSOM
 *
 * @description
 *
 * # ExpertsInside.SharePoint
 *
 * The complete `angular-sharepoint` experience.
 *
 */
angular.module('ExpertsInside.SharePoint', [
  'ExpertsInside.SharePoint.Core',
  'ExpertsInside.SharePoint.List',
  'ExpertsInside.SharePoint.Search',
  'ExpertsInside.SharePoint.User'
]);
/**
 * @ngdoc object
 * @name ExpertsInside.SharePoint.JSOM.$spClientContext
 *
 * @description The `$spClientContext` creates a SP.ClientContext
 *  instance and empowers it with methods that return AngularJS
 *  promises for async opertations.
 *
 *  - `$load`: Wraps the native SP.ClientContext#load method
 *    and returns a promise that resolves with the loaded object 
 *    when executeQueryAsync resolves
 *
 *  - `$executeQueryAsync`: Wraps the native SP.ClientContext#executeQueryAsync
 *    method and returns a promise that resolves after the query is executed.
 *
 * @example
 * ```js
   var ctx = $spClientContext.create();
   ctx.$load(ctx.get_web()).then(function(web) {
     $scope.webTitle = web.get_title();
   });
   ctx.$executeQueryAsync().then(function() {
     $log.debug('executeQuery done!');
   })
 * ```
 */
angular.module('ExpertsInside.SharePoint.JSOM').factory('$spClientContext', [
  '$window',
  '$q',
  function ($window, $q) {
    'use strict';
    // var $spClientContextMinErr = angular.$$minErr('$spClientContext');
    var spContext = {
        $$decorateContext: function (ctx) {
          ctx.$$empowered = true;
          ctx.$$awaitingLoads = [];
          ctx.$load = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var deferred = $q.defer();
            $window.SP.ClientContext.prototype.load.apply(ctx, arguments);
            ctx.$$awaitingLoads.push({
              deferred: deferred,
              args: args
            });
            return deferred.promise;
          };
          ctx.$executeQueryAsync = function () {
            var deferred = $q.defer();
            ctx.executeQueryAsync(function () {
              angular.forEach(ctx.$$awaitingLoads, function (load) {
                var deferredLoad = load.deferred;
                deferredLoad.resolve.apply(deferredLoad, load.args);
              });
              deferred.resolve(ctx);
              ctx.$$awaitingLoads.length = 0;
            }, function () {
              var errorArgs = arguments;
              angular.forEach(ctx.$$awaitingLoads, function (load) {
                var deferredLoad = load.deferred;
                deferredLoad.reject.apply(deferredLoad, errorArgs);
              });
              deferred.reject.apply(deferred, errorArgs);
              ctx.$$awaitingLoads.length = 0;
            });
            return deferred.promise;
          };
          return ctx;
        },
        create: function (url) {
          var ctx = new $window.SP.ClientContext(url);
          return spContext.$$decorateContext(ctx);
        },
        current: function () {
          var ctx = new $window.SP.ClientContext.get_current();
          return angular.isDefined(ctx.$$empowered) ? ctx : spContext.$$decorateContext(ctx);
        }
      };
    return spContext;
  }
]);
/**
 * @ngdoc object
 * @name ExpertsInside.SharePoint.Core.$spConvert
 *
 * @description The `$spConvert` service exposes functions
 *  that convert (arrays of) EDM datatypes to javascript
 *  values or objects and the search results containing them.
 */
angular.module('ExpertsInside.SharePoint.Core').factory('$spConvert', function () {
  'use strict';
  var assertType = function (type, obj) {
    if (!angular.isObject(obj.__metadata) || obj.__metadata.type !== type) {
      throw $spConvertMinErr('badargs', 'expected argument to be of type {0}.', type);
    }
  };
  var $spConvertMinErr = angular.$$minErr('$spConvert');
  var $spConvert = {
      spKeyValue: function (keyValue) {
        assertType('SP.KeyValue', keyValue);
        var value = keyValue.Value;
        switch (keyValue.ValueType) {
        case 'Edm.Double':
        case 'Edm.Float':
          return parseFloat(value);
        case 'Edm.Int16':
        case 'Edm.Int32':
        case 'Edm.Int64':
        case 'Edm.Byte':
          return parseInt(value, 10);
        case 'Edm.Boolean':
          return value === 'true';
        default:
          return value;
        }
      },
      spKeyValueArray: function (keyValues) {
        var result = {};
        for (var i = 0, l = keyValues.length; i < l; i += 1) {
          var keyValue = keyValues[i];
          var key = keyValue.Key;
          result[key] = $spConvert.spKeyValue(keyValue);
        }
        return result;
      },
      spSimpleDataRow: function (row) {
        assertType('SP.SimpleDataRow', row);
        var cells = row.Cells.results || [];
        return $spConvert.spKeyValueArray(cells);
      },
      spSimpleDataTable: function (table) {
        assertType('SP.SimpleDataTable', table);
        var result = [];
        var rows = table.Rows.results || [];
        for (var i = 0, l = rows.length; i < l; i += 1) {
          var row = rows[i];
          result.push($spConvert.spSimpleDataRow(row));
        }
        return result;
      },
      searchResult: function (searchResult) {
        assertType('Microsoft.Office.Server.Search.REST.SearchResult', searchResult);
        var primaryQueryResult = searchResult.PrimaryQueryResult;
        var result = {
            elapsedTime: searchResult.ElapsedTime,
            spellingSuggestion: searchResult.SpellingSuggestion,
            properties: $spConvert.spKeyValueArray(searchResult.Properties.results),
            primaryQueryResult: {
              queryId: primaryQueryResult.QueryId,
              queryRuleId: primaryQueryResult.QueryRuleId,
              relevantResults: $spConvert.spSimpleDataTable(primaryQueryResult.RelevantResults.Table),
              customResults: primaryQueryResult.CustomResults,
              refinementResults: primaryQueryResult.RefinementResults,
              specialTermResults: primaryQueryResult.SpecialTermResults
            }
          };
        return result;
      },
      suggestResult: function (suggestResult) {
        // TODO implement
        return suggestResult;
      },
      userResult: function (userResult) {
        assertType('SP.UserProfiles.PersonProperties', userResult);
        var result = {
            accountName: userResult.AccountName,
            displayName: userResult.DisplayName,
            email: userResult.Email,
            isFollowed: userResult.IsFollowed,
            personalUrl: userResult.PersonalUrl,
            pictureUrl: userResult.PictureUrl,
            profileProperties: $spConvert.spKeyValueArray(userResult.UserProfileProperties.results),
            title: userResult.Title,
            userUrl: userResult.UserUrl
          };
        return result;
      },
      capitalize: function (str) {
        if (angular.isUndefined(str) || str === null) {
          return null;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    };
  return $spConvert;
});
/**
 * @ngdoc service
 * @name ExpertsInside.SharePoint.List.$spList
 * @requires ExpertsInside.SharePoint.Core.$spRest
 * @requires ExpertsInside.SharePoint.Core.$spConvert
 *
 * @description A factory which creates a list item resource object that lets you interact with
 *   SharePoint List Items via the SharePoint REST API.
 *
 *   The returned list item object has action methods which provide high-level behaviors without
 *   the need to interact with the low level $http service.
 *
 * @param {string} title The title of the SharePoint List (case-sensitive).
 *
 * @param {Object=} listOptions Hash with custom options for this List. The following options are
 *   supported:
 *
 *   - **`readOnlyFields`** - {Array.{string}=} - Array of field names that will be excluded
 *   from the request when saving an item back to SharePoint
 *   - **`query`** - {Object=} - Default query parameter used by each action. Can be
 *   overridden per action. Prefixing them with `$` is optional. Valid keys:
 *       - **`$select`**
 *       - **`$filter`**
 *       - **`$orderby`**
 *       - **`$top`**
 *       - **`$skip`**
 *       - **`$expand`**
 *       - **`$sort`**
 *   - **`inHostWeb`** - {boolean|string} - Set the host web url for the List. When set to
 *   `true`, ShareCoffe.Commons.getHostWebUrl() will be used. 
 *
 * @return {Object} A dynamically created  class constructor for list items.
 *   See {@link ExpertsInside.SharePoint.List.$spList+ListItem $spList+ListItem} for details.
 */
angular.module('ExpertsInside.SharePoint.List').factory('$spList', [
  '$spRest',
  '$http',
  '$spConvert',
  function ($spRest, $http, $spConvert) {
    'use strict';
    var $spListMinErr = angular.$$minErr('$spList');
    function listFactory(title, listOptions) {
      if (!angular.isString(title) || title === '') {
        throw $spListMinErr('badargs', 'title must be a nen-empty string.');
      }
      if (!angular.isObject(listOptions)) {
        listOptions = {};
      }
      var normalizedTitle = $spConvert.capitalize(title.replace(/[^A-Za-z0-9 ]/g, '').replace(/\s/g, '_x0020_'));
      var className = $spConvert.capitalize(normalizedTitle.replace(/_x0020/g, '').replace(/^\d+/, ''));
      var listItemType = 'SP.Data.' + normalizedTitle + 'ListItem';
      // Constructor function for List dynamically generated List class
      /**
       * @ngdoc service
       * @name ExpertsInside.SharePoint.List.$spList+ListItem
       *
       * @description The dynamically created List Item class, created by
       *   {@link ExpertsInside.SharePoint.List.$spList $spList}. 
       *
       *   Note that all methods prefixed with a `$` are *instance* (or prototype) methods.
       *   Ngdoc doesn't seem to have out-of-box support for those.
       */
      var List = function () {
          // jshint evil:true, validthis:true
          function __List__(data) {
            this.__metadata = { type: listItemType };
            angular.extend(this, data);
          }
          var script = ' (function() {                     ' + __List__.toString() + '   return __List__;                ' + ' })();                             ';
          return eval(script.replace(/__List__/g, className));
        }();
      /**
       * @private
       * Title of the list
       */
      List.$$title = title;
      /**
       * @private
       * Allowed query parameters
       */
      List.$$queryParameterWhitelist = [
        '$select',
        '$filter',
        '$orderby',
        '$top',
        '$skip',
        '$expand',
        '$sort'
      ];
      /**
       * @private
       * Web relative list url
       */
      List.$$relativeUrl = 'web/lists/getByTitle(\'' + List.$$title + '\')';
      /**
       * @private
       * Is this List in the host web?
       */
      List.$$inHostWeb = listOptions.inHostWeb;
      /**
       * @private
       * Decorate the result with $promise and $resolved
       */
      List.$$decorateResult = function (result, httpConfig) {
        if (!angular.isArray(result) && !(result instanceof List)) {
          result = new List(result);
        }
        if (angular.isUndefined(result.$resolved)) {
          result.$resolved = false;
        }
        result.$promise = $http(httpConfig).then(function (response) {
          var data = response.data;
          if (angular.isArray(result) && angular.isArray(data)) {
            angular.forEach(data, function (item) {
              result.push(new List(item));
            });
          } else if (angular.isObject(result)) {
            if (angular.isArray(data)) {
              if (data.length === 1) {
                angular.extend(result, data[0]);
              } else {
                throw $spListMinErr('badresponse', 'Expected response to contain an array with one object but got {1}', data.length);
              }
            } else if (angular.isObject(data)) {
              angular.extend(result, data);
            }
          } else {
            throw $spListMinErr('badresponse', 'Expected response to contain an {0} but got an {1}', angular.isArray(result) ? 'array' : 'object', angular.isArray(data) ? 'array' : 'object');
          }
          var responseEtag;
          if (response.status === 204 && angular.isString(responseEtag = response.headers('ETag'))) {
            result.__metadata.etag = responseEtag;
          }
          result.$resolved = true;
          return result;
        });
        return result;
      };
      /**
       * @private
       * @description Builds the http config for the list CRUD actions
       *
       * @param {Object} list List constructor
       * @param {string} action CRUD action
       *
       * @returns {Object} http config
       */
      List.$$buildHttpConfig = function (action, options) {
        var baseUrl = List.$$relativeUrl + '/items';
        var httpConfig = { url: baseUrl };
        if (angular.isString(List.$$inHostWeb)) {
          httpConfig.hostWebUrl = List.$$inHostWeb;
        } else if (List.$$inHostWeb) {
          httpConfig.hostWebUrl = ShareCoffee.Commons.getHostWebUrl();
        }
        action = angular.isString(action) ? action.toLowerCase() : '';
        options = angular.isDefined(options) ? options : {};
        var query = angular.isDefined(options.query) ? $spRest.normalizeParams(options.query, List.$$queryParameterWhitelist) : {};
        switch (action) {
        case 'get':
          if (angular.isUndefined(options.id)) {
            throw $spListMinErr('options:get', 'options must have an id');
          }
          httpConfig.url += '(' + options.id + ')';
          httpConfig = ShareCoffee.REST.build.read['for'].angularJS(httpConfig);
          break;
        case 'query':
          httpConfig = ShareCoffee.REST.build.read['for'].angularJS(httpConfig);
          break;
        case 'create':
          if (angular.isUndefined(options.item)) {
            throw $spListMinErr('options:create', 'options must have an item');
          }
          if (angular.isUndefined(options.item.__metadata)) {
            throw $spListMinErr('options:create', 'options.item must have __metadata property');
          }
          if (angular.isDefined(query)) {
            delete query.$expand;
          }
          httpConfig.payload = options.item.$toJson();
          httpConfig = ShareCoffee.REST.build.create['for'].angularJS(httpConfig);
          break;
        case 'update':
          if (angular.isUndefined(options.item)) {
            throw $spListMinErr('options:update', 'options must have an item');
          }
          if (angular.isUndefined(options.item.__metadata)) {
            throw $spListMinErr('options:create', 'options.item must have __metadata property');
          }
          query = {};
          // does nothing or breaks things, so we ignore it
          httpConfig.url += '(' + options.item.Id + ')';
          httpConfig.payload = options.item.$toJson();
          httpConfig.eTag = !options.force && angular.isDefined(options.item.__metadata) ? options.item.__metadata.etag : null;
          httpConfig = ShareCoffee.REST.build.update['for'].angularJS(httpConfig);
          break;
        case 'delete':
          if (angular.isUndefined(options.item)) {
            throw $spListMinErr('options:delete', 'options must have an item');
          }
          if (angular.isUndefined(options.item.__metadata)) {
            throw $spListMinErr('options:delete', 'options.item must have __metadata');
          }
          httpConfig.url += '(' + options.item.Id + ')';
          httpConfig = ShareCoffee.REST.build['delete']['for'].angularJS(httpConfig);
          break;
        }
        httpConfig.url = $spRest.appendQueryParameters(httpConfig.url, query);
        httpConfig.transformResponse = $spRest.transformResponse;
        return httpConfig;
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#get
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Get a single list item by id
       *
       * @param {Number} id Id of the list item
       * @param {Object=} query Additional query properties
       *
       * @return {Object} List item instance
       */
      List.get = function (id, query) {
        if (angular.isUndefined(id) || id === null) {
          throw $spListMinErr('badargs', 'id is required.');
        }
        var result = { Id: id };
        var httpConfig = List.$$buildHttpConfig('get', {
            id: id,
            query: query
          });
        return List.$$decorateResult(result, httpConfig);
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#query
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Query for the list for items
       *
       * @param {Object=} query Query properties
       * @param {Object=} options Additional query options.
       *   Accepts the following properties:
       *   - **`singleResult`** - {boolean} - Returns and empty object instead of an array. Throws an
       *     error when more than one item is returned by the query.
       *
       * @return {Array<Object>} Array of list items
       */
      List.query = function (query, options) {
        var result = angular.isDefined(options) && options.singleResult ? {} : [];
        var httpConfig = List.$$buildHttpConfig('query', { query: angular.extend({}, List.prototype.$$queryDefaults, query) });
        return List.$$decorateResult(result, httpConfig);
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#create
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Create a new list item on the server.
       *
       * @param {Object=} item Query properties
       * @param {Object=} options Additional query properties.
       *
       * @return {Object} The decorated list item
       */
      List.create = function (item, query) {
        if (!(angular.isObject(item) && item instanceof List)) {
          throw $spListMinErr('badargs', 'item must be a List instance.');
        }
        item.__metadata = angular.extend({ type: listItemType }, item.__metadata);
        var httpConfig = List.$$buildHttpConfig('create', {
            item: item,
            query: angular.extend({}, item.$$queryDefaults, query)
          });
        return List.$$decorateResult(item, httpConfig);
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#update
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Update an existing list item on the server.
       *
       * @param {Object=} item the list item
       * @param {Object=} options Additional update properties.
       *   Accepts the following properties:
       *   - **`force`** - {boolean} - Overwrite newer versions on the server.
       *
       * @return {Object} The decorated list item
       */
      List.update = function (item, options) {
        if (!(angular.isObject(item) && item instanceof List)) {
          throw $spListMinErr('badargs', 'item must be a List instance.');
        }
        options = angular.extend({}, options, { item: item });
        var httpConfig = List.$$buildHttpConfig('update', options);
        return List.$$decorateResult(item, httpConfig);
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#save
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Update or create a list item on the server.
       *
       * @param {Object=} item the list item
       * @param {Object=} options Options passed to create or update.
       *
       * @return {Object} The decorated list item
       */
      List.save = function (item, options) {
        if (angular.isDefined(item.__metadata) && angular.isDefined(item.__metadata.id)) {
          return this.update(item, options);
        } else {
          var query = angular.isObject(options) ? options.query : undefined;
          return this.create(item, query);
        }
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#delete
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Delete a list item on the server.
       *
       * @param {Object=} item the list item
       *
       * @return {Object} The decorated list item
       */
      List.delete = function (item) {
        if (!(angular.isObject(item) && item instanceof List)) {
          throw $spListMinErr('badargs', 'item must be a List instance.');
        }
        var httpConfig = List.$$buildHttpConfig('delete', { item: item });
        return List.$$decorateResult(item, httpConfig);
      };
      /**
       * @ngdoc object
       * @name ExpertsInside.SharePoint.List.$spList#queries
       * @propertyOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Object that holds the created named queries
       */
      List.queries = {};
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#addNamedQuery
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Add a named query to the queries hash
       *
       * @param {Object} name name of the query, used as the function name
       * @param {Function} createQuery callback invoked with the arguments passed to
       *   the created named query that creates the final query object
       * @param {Object=} options Additional query options passed to List.query
       *
       * @return {Array} The query result
       */
      List.addNamedQuery = function (name, createQuery, options) {
        List.queries[name] = function () {
          var query = angular.extend({}, List.prototype.$$queryDefaults, createQuery.apply(List, arguments));
          return List.query(query, options);
        };
        return List;
      };
      /**
       * @ngdoc method
       * @name ExpertsInside.SharePoint.List.$spList#toJson
       * @methodOf ExpertsInside.SharePoint.List.$spList
       *
       * @description Create a copy of the item, remove read-only fields
       *   and stringify it.
       *
       * @param {Object} item list item
       *
       * @returns {string} JSON representation
       */
      List.toJson = function (item) {
        var copy = {};
        var blacklist = angular.extend([], item.$$readOnlyFields);
        angular.forEach(item, function (value, key) {
          if (key.indexOf('$') !== 0 && blacklist.indexOf(key) === -1) {
            copy[key] = value;
          }
        });
        return angular.toJson(copy);
      };
      List.prototype = {
        $$readOnlyFields: angular.extend([
          'AttachmentFiles',
          'Attachments',
          'Author',
          'AuthorId',
          'ContentType',
          'ContentTypeId',
          'Created',
          'Editor',
          'EditorId',
          'FieldValuesAsHtml',
          'FieldValuesAsText',
          'FieldValuesForEdit',
          'File',
          'FileSystemObjectType',
          'FirstUniqueAncestorSecurableObject',
          'Folder',
          'GUID',
          'Modified',
          'OData__UIVersionString',
          'ParentList',
          'RoleAssignments'
        ], listOptions.readOnlyFields),
        $$queryDefaults: angular.extend({}, listOptions.query),
        $save: function (options) {
          return List.save(this, options).$promise;
        },
        $delete: function () {
          return List.delete(this).$promise;
        },
        $isNew: function () {
          return angular.isUndefined(this.__metadata) || angular.isUndefined(this.__metadata.id);
        },
        $toJson: function () {
          return List.toJson(this);
        }
      };
      return List;
    }
    return listFactory;
  }
]);
/**
 * @ngdoc object
 * @name ExpertsInside.SharePoint.Core.$spPageContextInfo
 *
 * @description
 * A reference to the documents `_spPageContextInfo` object. While `_spPageContextInfo`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. When referring to it thorugh the `$spPageContextInfo` service,
 * it may be overridden, removed or mocked for testing.
 *
 * See {@link http://tjendarta.wordpress.com/2013/07/16/_sppagecontextinfo-properties-value/ _spPageContextInfo Properties}
 * for more information.
 *
 * @example
 * ```js
     function Ctrl($scope, $spPageContextInfo) {
        $scope.userName = $spPageContextInfo.userLoginName
      }
 * ```
 */
angular.module('ExpertsInside.SharePoint.Core').factory('$spPageContextInfo', [
  '$rootScope',
  '$window',
  function ($rootScope, $window) {
    'use strict';
    var $spPageContextInfo = {};
    angular.copy($window._spPageContextInfo, $spPageContextInfo);
    $rootScope.$watch(function () {
      return $window._spPageContextInfo;
    }, function (spPageContextInfo) {
      angular.copy(spPageContextInfo, $spPageContextInfo);
    }, true);
    return $spPageContextInfo;
  }
]);
/**
 * @ngdoc service
 * @name ExpertsInside.SharePoint.Core.$spRest
 *
 * @description
 * Utility functions when interacting with the SharePoint REST API
 *
 */
angular.module('ExpertsInside.SharePoint.Core').factory('$spRest', [
  '$log',
  function ($log) {
    'use strict';
    // var $spRestMinErr = angular.$$minErr('$spRest');
    /**
     * @name unique
     * @private
     *
     * Copy the array without duplicates
     *
     * @param {array} arr input array
     *
     * @returns {array} input array without duplicates
     */
    var unique = function (arr) {
      return arr.reduce(function (r, x) {
        if (r.indexOf(x) < 0) {
          r.push(x);
        }
        return r;
      }, []);
    };
    /**
     * @name getKeysSorted
     * @private
     *
     * Get all keys from the object and sort them
     *
     * @param {Object} obj input object
     *
     * @returns {Array} Sorted object keys
     */
    function getKeysSorted(obj) {
      var keys = [];
      if (angular.isUndefined(obj) || obj === null) {
        return keys;
      }
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys.sort();
    }
    var $spRest = {
        transformResponse: function (json) {
          var response = {};
          if (angular.isDefined(json) && json !== null && json !== '') {
            response = angular.fromJson(json);
          }
          if (angular.isObject(response) && angular.isDefined(response.d)) {
            response = response.d;
          }
          if (angular.isObject(response) && angular.isDefined(response.results)) {
            response = response.results;
          }
          return response;
        },
        buildQueryString: function (params) {
          var parts = [];
          var keys = getKeysSorted(params);
          angular.forEach(keys, function (key) {
            var value = params[key];
            if (value === null || angular.isUndefined(value)) {
              return;
            }
            if (angular.isArray(value)) {
              value = unique(value).join(',');
            }
            if (angular.isObject(value)) {
              value = angular.toJson(value);
            }
            parts.push(key + '=' + value);
          });
          var queryString = parts.join('&');
          return queryString;
        },
        normalizeParams: function (params, whitelist) {
          params = angular.extend({}, params);
          //make a copy
          if (angular.isDefined(params)) {
            angular.forEach(params, function (value, key) {
              if (key.indexOf('$') !== 0) {
                delete params[key];
                key = '$' + key;
                params[key] = value;
              }
              if (angular.isDefined(whitelist) && whitelist.indexOf(key) === -1) {
                $log.warn('Invalid param key detected: ' + key);
                delete params[key];
              }
            });
          }
          // cannot use angular.equals(params, {}) to check for empty object,
          // because angular.equals ignores properties prefixed with $
          if (params === null || JSON.stringify(params) === '{}') {
            params = undefined;
          }
          return params;
        },
        appendQueryParameters: function (url, params) {
          var queryString = $spRest.buildQueryString(params);
          if (queryString !== '') {
            url += (url.indexOf('?') === -1 ? '?' : '&') + queryString;
          }
          return url;
        }
      };
    return $spRest;
  }
]);
/**
 * @ngdoc service
 * @name ExpertsInside.SharePoint.Search.$spSearch
 * @requires ExpertsInside.SharePoint.Core.$spRest
 * @requires ExpertsInside.SharePoint.Core.$spConvert
 *
 * @description Query the Search via REST API
 *
 */
angular.module('ExpertsInside.SharePoint.Search').factory('$spSearch', [
  '$http',
  '$spRest',
  '$spConvert',
  function ($http, $spRest, $spConvert) {
    'use strict';
    var $spSearchMinErr = angular.$$minErr('$spSearch');
    var search = {
        $$createQueryProperties: function (searchType, properties) {
          var queryProperties;
          switch (searchType) {
          case 'postquery':
            queryProperties = new ShareCoffee.PostQueryProperties();
            break;
          case 'suggest':
            queryProperties = new ShareCoffee.SuggestProperties();
            break;
          default:
            queryProperties = new ShareCoffee.QueryProperties();
            break;
          }
          return angular.extend(queryProperties, properties);
        },
        $decorateResult: function (result, httpConfig) {
          if (angular.isUndefined(result.$resolved)) {
            result.$resolved = false;
          }
          result.$raw = null;
          result.$promise = $http(httpConfig).then(function (response) {
            var data = response.data;
            if (angular.isObject(data)) {
              if (angular.isDefined(data.query)) {
                result.$raw = data.query;
                angular.extend(result, $spConvert.searchResult(data.query));
              } else if (angular.isDefined(data.suggest)) {
                result.$raw = data.suggest;
                angular.extend(result, $spConvert.suggestResult(data.suggest));
              }
            }
            if (angular.isUndefined(result.$raw)) {
              throw $spSearchMinErr('badresponse', 'Response does not contain a valid search result.');
            }
            result.$resolved = true;
            return result;
          });
          return result;
        },
        query: function (properties) {
          properties = angular.extend({}, properties);
          var searchType = properties.searchType;
          delete properties.searchType;
          var queryProperties = search.$$createQueryProperties(searchType, properties);
          var httpConfig = ShareCoffee.REST.build.read['for'].angularJS(queryProperties);
          httpConfig.transformResponse = $spRest.transformResponse;
          var result = {};
          return search.$decorateResult(result, httpConfig);
        },
        postquery: function (properties) {
          properties = angular.extend(properties, { searchType: 'postquery' });
          return search.query(properties);
        },
        suggest: function (properties) {
          properties = angular.extend(properties, { searchType: 'suggest' });
          return search.query(properties);
        }
      };
    return search;
  }
]);
/**
 * @ngdoc service
 * @name ExpertsInside.SharePoint.User.$spUser
 * @requires ExpertsInside.SharePoint.Core.$spRest
 * @requires ExpertsInside.SharePoint.Core.$spConvert
 *
 * @description Load user information via UserProfiles REST API
 *
 */
angular.module('ExpertsInside.SharePoint.User').factory('$spUser', [
  '$http',
  '$spRest',
  '$spConvert',
  function ($http, $spRest, $spConvert) {
    'use strict';
    var $spUserMinErr = angular.$$minErr('$spUser');
    var $spUser = {
        $$decorateResult: function (result, httpConfig) {
          if (angular.isUndefined(result.$resolved)) {
            result.$resolved = false;
          }
          result.$raw = null;
          result.$promise = $http(httpConfig).then(function (response) {
            var data = response.data;
            if (angular.isDefined(data)) {
              result.$raw = data;
              angular.extend(result, $spConvert.userResult(data));
            } else {
              throw $spUserMinErr('badresponse', 'Response does not contain a valid user result.');
            }
            result.$resolved = true;
            return result;
          });
          return result;
        },
        current: function () {
          var properties = new ShareCoffee.UserProfileProperties(ShareCoffee.Url.GetMyProperties);
          var httpConfig = ShareCoffee.REST.build.read.f.angularJS(properties);
          httpConfig.transformResponse = $spRest.transformResponse;
          var result = {};
          return $spUser.$$decorateResult(result, httpConfig);
        },
        get: function (accountName) {
          var properties = new ShareCoffee.UserProfileProperties(ShareCoffee.Url.GetProperties, accountName);
          var httpConfig = ShareCoffee.REST.build.read.f.angularJS(properties);
          httpConfig.transformResponse = $spRest.transformResponse;
          var result = {};
          return $spUser.$$decorateResult(result, httpConfig);
        }
      };
    return $spUser;
  }
]);