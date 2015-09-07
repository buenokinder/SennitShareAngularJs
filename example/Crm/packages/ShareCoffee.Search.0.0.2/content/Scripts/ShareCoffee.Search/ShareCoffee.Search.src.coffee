###
ShareCoffee.Search (c) 2014 Thorsten Hans
| dotnet-rocks.com | https://github.com/ThorstenHans/ShareCoffee.Search/ | under MIT License |
###

root = global ? window

if not root.ShareCoffee?
  throw new Error("LoadError")

# based on RFC2616 - HTTP specs
root.ShareCoffee.MaxUrlLength = 2000

root.ShareCoffee.Url = {} unless root.ShareCoffee.Url?
root.ShareCoffee.Url.Query = "Search/query"
root.ShareCoffee.Url.PostQuery = "Search/postquery"
root.ShareCoffee.Url.Suggest = "Search/suggest"

root.ShareCoffee.QueryProperties = class

  constructor: (@querytext, @selectproperties, @querytemplate) ->
    @querytext = null unless @querytext?
    @isPostQuery = false
    @querytemplate = null unless @querytemplate?
    @enableinterleaving = null unless @enableinterleaving?
    @sourceid = null unless @sourceid?
    @rankingmodelid = null unless @rankingmodelid?
    @startrow = null unless @startrow?
    @rowlimit = null unless @rowlimit?
    @rowsperpage = null unless @rowsperpage?
    @selectproperties = null unless @selectproperties?
    @culture = null unless @culture?
    @refiners = null unless @refiners?
    @refinementfilters = null unless @refinementfilters?
    @hiddenconstraints = null unless @hiddenconstraints?
    @sortlist = null unless @sortlist?
    @enablestemming = null unless @enablestemming?
    @trimduplicates = null unless @trimduplicates?
    @trimduplicatesincludeid = null unless @trimduplicatesincludeid?
    @timeout = null unless @timeout?
    @enablenicknames = null unless @enablenicknames?
    @enablephonetic = null unless @enablephonetic?
    @enablefql = null unless @enablefql?
    @hithighlightedproperties = null unless @hithighlightedproperties?
    @bypassresulttypes = null unless @bypassresulttypes?
    @processbestbets = null  unless @processbestbets?
    @clienttype = null unless @clienttype?
    @personalizationdata = null unless @personalizationdata?
    @resultsurl = null unless @resultsurl?
    @querytag = null unless @querytag?
    @enablequeryrules = null unless @enablequeryrules?
    @enablesorting = null unless @enablesorting?
    @hostWebUrl = null
    @onSuccess = null
    @onError = null

  getUrl: () =>
    urlProperties = ['querytext', 'querytemplate', 'enableinterleaving', 'sourceid', 'rankingmodelid', 'startrow', 'rowlimit', 'rowsperpage', 'selectproperties',
    'culture', 'refiners', 'refinementfilters', 'hiddenconstraints', 'sortlist', 'enablestemming', 'trimduplicates', 'trimduplicatesincludeid',
    'timeout', 'enablenicknames', 'enablephonetic', 'enablefql', 'hithighlightedproperties', 'bypassresulttypes',
    'processbestbets', 'clienttype', 'personalizationdata', 'resultsurl', 'querytag', 'enablequeryrules', 'enablesorting']

    getSafeStringForREST = (input) ->
      encodeURIComponent input.replace(/'/g, '"')

    url = "#{ShareCoffee.Url.Query}?"

    for p of @
      propertyValue = @[p]
      if urlProperties.indexOf(p) > -1 and propertyValue?
        if typeof(propertyValue) is 'string'
          url = "#{url}#{p}='#{getSafeStringForREST(propertyValue)}'&"
        else if typeof(propertyValue) is 'number' or typeof(propertyValue) is 'boolean'
          url = "#{url}#{p}=#{propertyValue}&"

    url.substr 0, url.length-1

  getRequestProperties: () =>
    @validateUrl()
    new ShareCoffee.REST.RequestProperties @getUrl(), null, @hostWebUrl, null, @onSuccess, @onError

  validateUrl: () =>
    url = ""
    if @hostWebUrl?
      url = "#{ShareCoffee.Commons.getApiRootUrl()}SP.AppContextSite(@target)/#{@getUrl()}?@target='#{@hostWebUrl}'"
    else
      url = "#{ShareCoffee.Commons.getApiRootUrl()}#{@getUrl()}"

    if url.length > ShareCoffee.MaxUrlLength
      throw new Error 'URL is to long, please use a PostQuery instead of a regular GET Query'

root.ShareCoffee.PostQueryProperties = class

  constructor: (@Querytext, @SelectProperties, @QueryTemplate) ->
    @isPostQuery = true
    @Querytext = null unless @Querytext?
    @Culture = null unless @Culture?
    @EnableIterleaving = null unless @EnableIterleaving?
    @EnableNicknames = null unless @EnableNicknames?
    @EnablePhonetic = null unless @EnablePhonetic?
    @EnableStemming = null unless @EnableStemming?
    @HiddenConstraints = null unless @HiddenConstraints?
    @RankingModelId = null unless @RankingModelId?
    @RefinementFilters = null unless @RefinementFilters?
    @Refiners = null unless @Refiners?
    @RowLimit = null unless @RowLimit?
    @RowsPerPage = null unless @RowsPerPage?
    @SelectProperties = null unless @SelectProperties?
    @SourceId = null unless @SourceId?
    @StartRow = null unless @StartRow?
    @Timeout = null unless @Timeout?
    @TrimDuplicates = null unless @TrimDuplicates?
    @EnableFQL = null unless @EnableFQL?
    @BypassResultTypes = null unless @BypassResultTypes?
    @ClientType = null unless @ClientType?
    @HitHighlightedProperties = null unless @HitHighlightedProperties?
    @ProcessBestBets = null unless @ProcessBestBets?
    @QueryTag = null unless @QueryTag?
    @ResultsUrl = null unless @ResultsUrl?
    @TrimDuplicatesIncludeId = null unless @TrimDuplicatesIncludeId?
    @BlockDedupeMode = null unless @BlockDedupeMode?
    @CollapseSpecification = null unless @CollapseSpecification?
    @DesiredSnippetLength = null unless @DesiredSnippetLength?
    @EnableOrderingHitHighlightedProperty = null unless @EnableOrderingHitHighlightedProperty?
    @EnableQueryRules = null unless @EnableQueryRules?
    @EnableSorting = null unless @EnableSorting?
    @GenerateBlockRankLog = null unless @GenerateBlockRankLog?
    @HitHighlightedMultivaluePropertyLimit = null unless @HitHighlightedMultivaluePropertyLimit?
    @ImpressionId = null unless @ImpressionId?
    @MaxSnippetLength = null unless @MaxSnippetLength?
    @PersonalizationData = null unless @PersonalizationData?
    @ProcessPersonalFavorites = null unless @ProcessPersonalFavorites?
    @Properties = null unless @Properties?
    @QueryTemplate = null unless @QueryTemplate?
    @ReorderingRules = null unless @ReorderingRules?
    @SortList = null unless @SortList?
    @SummaryLength = null unless @SummaryLength?
    @TotalRowsExactMinimum = null unless @TotalRowsExactMinimum?
    @UILanguage = null unless @UILanguage?
    @QueryTemplatePropertiesUrl = null unless @QueryTemplatePropertiesUrl?



  getRequestProperties: () ->
    payload = {
      'request': {
      }
    }
    urlProperties = ['Querytext','Culture','EnableIterleaving','EnableNicknames','EnablePhonetic','EnableStemming','HiddenConstraints','RankingModelId','RefinementFilters','Refiners','RowLimit','RowsPerPage','SelectProperties','SourceId','StartRow','Timeout', 'TrimDuplicates','EnableFQL','BypassResultTypes','ClientType','HitHighlightedProperties','ProcessBestBets','QueryTag','ResultsUrl',
      'TrimDuplicatesIncludeId','BlockDedupeMode','CollapseSpecification','DesiredSnippetLength','EnableOrderingHitHighlightedProperty','EnableQueryRules','EnableSorting','GenerateBlockRankLog',
      'HitHighlightedMultivaluePropertyLimit','ImpressionId','MaxSnippetLength','PersonalizationData','ProcessPersonalFavorites',
      'Properties','QueryTemplate','ReorderingRules','SortList','SummaryLength','TotalRowsExactMinimum','UILanguage','QueryTemplatePropertiesUrl']

    for p of @
      propertyValue = @[p]
      if urlProperties.indexOf(p) > -1 and propertyValue?
        payload['request'][p] = @[p]

    new ShareCoffee.REST.RequestProperties ShareCoffee.Url.PostQuery, payload, @hostWebUrl, null, @onSuccess, @onError

root.ShareCoffee.SuggestProperties = class

  constructor: (@querytext, @inumberofquerysuggestions, @inumberofresultsuggestions, @fprequerysuggestions, @fhithighlighting, @fcapitalizefirstletters, @showpeoplenamesuggestions, @culture) ->
    @querytext = null unless @querytext?
    @inumberofquerysuggestions = null unless @inumberofquerysuggestions?
    @inumberofresultsuggestions = null unless @inumberofresultsuggestions?
    @fprequerysuggestions = null unless @fprequerysuggestions?
    @fhithighlighting = null unless @fhithighlighting?
    @fcapitalizefirstletters = null unless @fcapitalizefirstletters?
    @showpeoplenamesuggestions = null unless @showpeoplenamesuggestions?
    @culture = null unless @culture?
    @hostWebUrl = null
    @onSuccess = null
    @onError = null

  getRequestProperties: () =>
    new ShareCoffee.REST.RequestProperties @getUrl(), null, @hostWebUrl, null, @onSuccess, @onError

  getUrl: () =>
    urlProperties = ['querytext', 'inumberofquerysuggestions', 'inumberofresultsuggestions', 'fprequerysuggestions', 'fhithighlighting', 'fcapitalizefirstletters', 'showpeoplenamesuggestions', 'culture']
    url = "#{ShareCoffee.Url.Suggest}?"
    getSafeStringForREST = (input) ->
      encodeURIComponent input.replace(/'/g, '"')
    for p of @
      propertyValue = @[p]
      if urlProperties.indexOf(p) > -1 and propertyValue?
        if typeof(propertyValue) is 'string'
          url = "#{url}#{p}='#{getSafeStringForREST(propertyValue)}'&"
        else if typeof(propertyValue) is 'number' or typeof(propertyValue) is 'boolean'
          url = "#{url}#{p}=#{propertyValue}&"

    url.substr 0, url.length-1

