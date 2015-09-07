/*
ShareCoffee.Search (c) 2014 Thorsten Hans
| dotnet-rocks.com | https://github.com/ThorstenHans/ShareCoffee.Search/ | under MIT License |
*/


(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof global !== "undefined" && global !== null ? global : window;

  if (root.ShareCoffee == null) {
    throw new Error("LoadError");
  }

  root.ShareCoffee.MaxUrlLength = 2000;

  if (root.ShareCoffee.Url == null) {
    root.ShareCoffee.Url = {};
  }

  root.ShareCoffee.Url.Query = "Search/query";

  root.ShareCoffee.Url.PostQuery = "Search/postquery";

  root.ShareCoffee.Url.Suggest = "Search/suggest";

  root.ShareCoffee.QueryProperties = (function() {
    function _Class(querytext, selectproperties, querytemplate) {
      this.querytext = querytext;
      this.selectproperties = selectproperties;
      this.querytemplate = querytemplate;
      this.validateUrl = __bind(this.validateUrl, this);
      this.getRequestProperties = __bind(this.getRequestProperties, this);
      this.getUrl = __bind(this.getUrl, this);
      if (this.querytext == null) {
        this.querytext = null;
      }
      this.isPostQuery = false;
      if (this.querytemplate == null) {
        this.querytemplate = null;
      }
      if (this.enableinterleaving == null) {
        this.enableinterleaving = null;
      }
      if (this.sourceid == null) {
        this.sourceid = null;
      }
      if (this.rankingmodelid == null) {
        this.rankingmodelid = null;
      }
      if (this.startrow == null) {
        this.startrow = null;
      }
      if (this.rowlimit == null) {
        this.rowlimit = null;
      }
      if (this.rowsperpage == null) {
        this.rowsperpage = null;
      }
      if (this.selectproperties == null) {
        this.selectproperties = null;
      }
      if (this.culture == null) {
        this.culture = null;
      }
      if (this.refiners == null) {
        this.refiners = null;
      }
      if (this.refinementfilters == null) {
        this.refinementfilters = null;
      }
      if (this.hiddenconstraints == null) {
        this.hiddenconstraints = null;
      }
      if (this.sortlist == null) {
        this.sortlist = null;
      }
      if (this.enablestemming == null) {
        this.enablestemming = null;
      }
      if (this.trimduplicates == null) {
        this.trimduplicates = null;
      }
      if (this.trimduplicatesincludeid == null) {
        this.trimduplicatesincludeid = null;
      }
      if (this.timeout == null) {
        this.timeout = null;
      }
      if (this.enablenicknames == null) {
        this.enablenicknames = null;
      }
      if (this.enablephonetic == null) {
        this.enablephonetic = null;
      }
      if (this.enablefql == null) {
        this.enablefql = null;
      }
      if (this.hithighlightedproperties == null) {
        this.hithighlightedproperties = null;
      }
      if (this.bypassresulttypes == null) {
        this.bypassresulttypes = null;
      }
      if (this.processbestbets == null) {
        this.processbestbets = null;
      }
      if (this.clienttype == null) {
        this.clienttype = null;
      }
      if (this.personalizationdata == null) {
        this.personalizationdata = null;
      }
      if (this.resultsurl == null) {
        this.resultsurl = null;
      }
      if (this.querytag == null) {
        this.querytag = null;
      }
      if (this.enablequeryrules == null) {
        this.enablequeryrules = null;
      }
      if (this.enablesorting == null) {
        this.enablesorting = null;
      }
      this.hostWebUrl = null;
      this.onSuccess = null;
      this.onError = null;
    }

    _Class.prototype.getUrl = function() {
      var getSafeStringForREST, p, propertyValue, url, urlProperties;
      urlProperties = ['querytext', 'querytemplate', 'enableinterleaving', 'sourceid', 'rankingmodelid', 'startrow', 'rowlimit', 'rowsperpage', 'selectproperties', 'culture', 'refiners', 'refinementfilters', 'hiddenconstraints', 'sortlist', 'enablestemming', 'trimduplicates', 'trimduplicatesincludeid', 'timeout', 'enablenicknames', 'enablephonetic', 'enablefql', 'hithighlightedproperties', 'bypassresulttypes', 'processbestbets', 'clienttype', 'personalizationdata', 'resultsurl', 'querytag', 'enablequeryrules', 'enablesorting'];
      getSafeStringForREST = function(input) {
        return encodeURIComponent(input.replace(/'/g, '"'));
      };
      url = "" + ShareCoffee.Url.Query + "?";
      for (p in this) {
        propertyValue = this[p];
        if (urlProperties.indexOf(p) > -1 && (propertyValue != null)) {
          if (typeof propertyValue === 'string') {
            url = "" + url + p + "='" + (getSafeStringForREST(propertyValue)) + "'&";
          } else if (typeof propertyValue === 'number' || typeof propertyValue === 'boolean') {
            url = "" + url + p + "=" + propertyValue + "&";
          }
        }
      }
      return url.substr(0, url.length - 1);
    };

    _Class.prototype.getRequestProperties = function() {
      this.validateUrl();
      return new ShareCoffee.REST.RequestProperties(this.getUrl(), null, this.hostWebUrl, null, this.onSuccess, this.onError);
    };

    _Class.prototype.validateUrl = function() {
      var url;
      url = "";
      if (this.hostWebUrl != null) {
        url = "" + (ShareCoffee.Commons.getApiRootUrl()) + "SP.AppContextSite(@target)/" + (this.getUrl()) + "?@target='" + this.hostWebUrl + "'";
      } else {
        url = "" + (ShareCoffee.Commons.getApiRootUrl()) + (this.getUrl());
      }
      if (url.length > ShareCoffee.MaxUrlLength) {
        throw new Error('URL is to long, please use a PostQuery instead of a regular GET Query');
      }
    };

    return _Class;

  })();

  root.ShareCoffee.PostQueryProperties = (function() {
    function _Class(Querytext, SelectProperties, QueryTemplate) {
      this.Querytext = Querytext;
      this.SelectProperties = SelectProperties;
      this.QueryTemplate = QueryTemplate;
      this.isPostQuery = true;
      if (this.Querytext == null) {
        this.Querytext = null;
      }
      if (this.Culture == null) {
        this.Culture = null;
      }
      if (this.EnableIterleaving == null) {
        this.EnableIterleaving = null;
      }
      if (this.EnableNicknames == null) {
        this.EnableNicknames = null;
      }
      if (this.EnablePhonetic == null) {
        this.EnablePhonetic = null;
      }
      if (this.EnableStemming == null) {
        this.EnableStemming = null;
      }
      if (this.HiddenConstraints == null) {
        this.HiddenConstraints = null;
      }
      if (this.RankingModelId == null) {
        this.RankingModelId = null;
      }
      if (this.RefinementFilters == null) {
        this.RefinementFilters = null;
      }
      if (this.Refiners == null) {
        this.Refiners = null;
      }
      if (this.RowLimit == null) {
        this.RowLimit = null;
      }
      if (this.RowsPerPage == null) {
        this.RowsPerPage = null;
      }
      if (this.SelectProperties == null) {
        this.SelectProperties = null;
      }
      if (this.SourceId == null) {
        this.SourceId = null;
      }
      if (this.StartRow == null) {
        this.StartRow = null;
      }
      if (this.Timeout == null) {
        this.Timeout = null;
      }
      if (this.TrimDuplicates == null) {
        this.TrimDuplicates = null;
      }
      if (this.EnableFQL == null) {
        this.EnableFQL = null;
      }
      if (this.BypassResultTypes == null) {
        this.BypassResultTypes = null;
      }
      if (this.ClientType == null) {
        this.ClientType = null;
      }
      if (this.HitHighlightedProperties == null) {
        this.HitHighlightedProperties = null;
      }
      if (this.ProcessBestBets == null) {
        this.ProcessBestBets = null;
      }
      if (this.QueryTag == null) {
        this.QueryTag = null;
      }
      if (this.ResultsUrl == null) {
        this.ResultsUrl = null;
      }
      if (this.TrimDuplicatesIncludeId == null) {
        this.TrimDuplicatesIncludeId = null;
      }
      if (this.BlockDedupeMode == null) {
        this.BlockDedupeMode = null;
      }
      if (this.CollapseSpecification == null) {
        this.CollapseSpecification = null;
      }
      if (this.DesiredSnippetLength == null) {
        this.DesiredSnippetLength = null;
      }
      if (this.EnableOrderingHitHighlightedProperty == null) {
        this.EnableOrderingHitHighlightedProperty = null;
      }
      if (this.EnableQueryRules == null) {
        this.EnableQueryRules = null;
      }
      if (this.EnableSorting == null) {
        this.EnableSorting = null;
      }
      if (this.GenerateBlockRankLog == null) {
        this.GenerateBlockRankLog = null;
      }
      if (this.HitHighlightedMultivaluePropertyLimit == null) {
        this.HitHighlightedMultivaluePropertyLimit = null;
      }
      if (this.ImpressionId == null) {
        this.ImpressionId = null;
      }
      if (this.MaxSnippetLength == null) {
        this.MaxSnippetLength = null;
      }
      if (this.PersonalizationData == null) {
        this.PersonalizationData = null;
      }
      if (this.ProcessPersonalFavorites == null) {
        this.ProcessPersonalFavorites = null;
      }
      if (this.Properties == null) {
        this.Properties = null;
      }
      if (this.QueryTemplate == null) {
        this.QueryTemplate = null;
      }
      if (this.ReorderingRules == null) {
        this.ReorderingRules = null;
      }
      if (this.SortList == null) {
        this.SortList = null;
      }
      if (this.SummaryLength == null) {
        this.SummaryLength = null;
      }
      if (this.TotalRowsExactMinimum == null) {
        this.TotalRowsExactMinimum = null;
      }
      if (this.UILanguage == null) {
        this.UILanguage = null;
      }
      if (this.QueryTemplatePropertiesUrl == null) {
        this.QueryTemplatePropertiesUrl = null;
      }
    }

    _Class.prototype.getRequestProperties = function() {
      var p, payload, propertyValue, urlProperties;
      payload = {
        'request': {}
      };
      urlProperties = ['Querytext', 'Culture', 'EnableIterleaving', 'EnableNicknames', 'EnablePhonetic', 'EnableStemming', 'HiddenConstraints', 'RankingModelId', 'RefinementFilters', 'Refiners', 'RowLimit', 'RowsPerPage', 'SelectProperties', 'SourceId', 'StartRow', 'Timeout', 'TrimDuplicates', 'EnableFQL', 'BypassResultTypes', 'ClientType', 'HitHighlightedProperties', 'ProcessBestBets', 'QueryTag', 'ResultsUrl', 'TrimDuplicatesIncludeId', 'BlockDedupeMode', 'CollapseSpecification', 'DesiredSnippetLength', 'EnableOrderingHitHighlightedProperty', 'EnableQueryRules', 'EnableSorting', 'GenerateBlockRankLog', 'HitHighlightedMultivaluePropertyLimit', 'ImpressionId', 'MaxSnippetLength', 'PersonalizationData', 'ProcessPersonalFavorites', 'Properties', 'QueryTemplate', 'ReorderingRules', 'SortList', 'SummaryLength', 'TotalRowsExactMinimum', 'UILanguage', 'QueryTemplatePropertiesUrl'];
      for (p in this) {
        propertyValue = this[p];
        if (urlProperties.indexOf(p) > -1 && (propertyValue != null)) {
          payload['request'][p] = this[p];
        }
      }
      return new ShareCoffee.REST.RequestProperties(ShareCoffee.Url.PostQuery, payload, this.hostWebUrl, null, this.onSuccess, this.onError);
    };

    return _Class;

  })();

  root.ShareCoffee.SuggestProperties = (function() {
    function _Class(querytext, inumberofquerysuggestions, inumberofresultsuggestions, fprequerysuggestions, fhithighlighting, fcapitalizefirstletters, showpeoplenamesuggestions, culture) {
      this.querytext = querytext;
      this.inumberofquerysuggestions = inumberofquerysuggestions;
      this.inumberofresultsuggestions = inumberofresultsuggestions;
      this.fprequerysuggestions = fprequerysuggestions;
      this.fhithighlighting = fhithighlighting;
      this.fcapitalizefirstletters = fcapitalizefirstletters;
      this.showpeoplenamesuggestions = showpeoplenamesuggestions;
      this.culture = culture;
      this.getUrl = __bind(this.getUrl, this);
      this.getRequestProperties = __bind(this.getRequestProperties, this);
      if (this.querytext == null) {
        this.querytext = null;
      }
      if (this.inumberofquerysuggestions == null) {
        this.inumberofquerysuggestions = null;
      }
      if (this.inumberofresultsuggestions == null) {
        this.inumberofresultsuggestions = null;
      }
      if (this.fprequerysuggestions == null) {
        this.fprequerysuggestions = null;
      }
      if (this.fhithighlighting == null) {
        this.fhithighlighting = null;
      }
      if (this.fcapitalizefirstletters == null) {
        this.fcapitalizefirstletters = null;
      }
      if (this.showpeoplenamesuggestions == null) {
        this.showpeoplenamesuggestions = null;
      }
      if (this.culture == null) {
        this.culture = null;
      }
      this.hostWebUrl = null;
      this.onSuccess = null;
      this.onError = null;
    }

    _Class.prototype.getRequestProperties = function() {
      return new ShareCoffee.REST.RequestProperties(this.getUrl(), null, this.hostWebUrl, null, this.onSuccess, this.onError);
    };

    _Class.prototype.getUrl = function() {
      var getSafeStringForREST, p, propertyValue, url, urlProperties;
      urlProperties = ['querytext', 'inumberofquerysuggestions', 'inumberofresultsuggestions', 'fprequerysuggestions', 'fhithighlighting', 'fcapitalizefirstletters', 'showpeoplenamesuggestions', 'culture'];
      url = "" + ShareCoffee.Url.Suggest + "?";
      getSafeStringForREST = function(input) {
        return encodeURIComponent(input.replace(/'/g, '"'));
      };
      for (p in this) {
        propertyValue = this[p];
        if (urlProperties.indexOf(p) > -1 && (propertyValue != null)) {
          if (typeof propertyValue === 'string') {
            url = "" + url + p + "='" + (getSafeStringForREST(propertyValue)) + "'&";
          } else if (typeof propertyValue === 'number' || typeof propertyValue === 'boolean') {
            url = "" + url + p + "=" + propertyValue + "&";
          }
        }
      }
      return url.substr(0, url.length - 1);
    };

    return _Class;

  })();

}).call(this);

/*
//@ sourceMappingURL=ShareCoffee.Search.js.map
*/