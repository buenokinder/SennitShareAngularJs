/*
ShareCoffee.UserProfiles (c) 2014 Thorsten Hans
| dotnet-rocks.com | https://github.com/ThorstenHans/ShareCoffee.UserProfiles/ | under MIT License |
*/


(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  root = typeof global !== "undefined" && global !== null ? global : window;

  if ((root.ShareCoffee == null) || (root.ShareCoffee.REST == null)) {
    throw new Error("LoadError");
  }

  if (root.ShareCoffee.Url == null) {
    root.ShareCoffee.Url = {};
  }

  root.ShareCoffee.Url.SetMyProfilePicture = "SP.UserProfiles.PeopleManager/SetMyProfilePicture";

  root.ShareCoffee.Url.GetMyProperties = "SP.UserProfiles.PeopleManager/GetMyProperties";

  root.ShareCoffee.Url.GetProperties = "SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=";

  root.ShareCoffee.Url.GetUserProfileProperty = "SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v, propertyName=@p)?@v=&@p=";

  root.ShareCoffee.ProfilePictureProperties = (function() {
    function _Class(profilePicture, onSuccess, onError) {
      this.profilePicture = profilePicture;
      this.onSuccess = onSuccess;
      this.onError = onError;
      this.getRequestProperties = __bind(this.getRequestProperties, this);
      if (this.profilePicture == null) {
        this.profilePicture = null;
      }
      if (this.onSuccess == null) {
        this.onSuccess = null;
      }
      if (this.onError == null) {
        this.onError = null;
      }
      this.url = ShareCoffee.Url.SetMyProfilePicture;
    }

    _Class.prototype.getRequestProperties = function() {
      var payload;
      payload = this.profilePicture;
      return new ShareCoffee.REST.RequestProperties(this.url, payload, null, null, this.onSuccess, this.onError);
    };

    return _Class;

  })();

  root.ShareCoffee.UserProfileProperties = (function() {
    function _Class() {
      var accountName, onError, onSuccess, propertyNames, url;
      url = arguments[0], accountName = arguments[1], onSuccess = arguments[2], onError = arguments[3], propertyNames = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
      this.url = url;
      this.accountName = accountName != null ? accountName : null;
      this.onSuccess = onSuccess != null ? onSuccess : null;
      this.onError = onError != null ? onError : null;
      this.propertyNames = propertyNames;
      this.getRequestProperties = __bind(this.getRequestProperties, this);
      this.getUrl = __bind(this.getUrl, this);
      if (this.accountName == null) {
        this.accountName = null;
      }
      if (this.propertyNames == null) {
        this.propertyNames = null;
      }
      if (this.onSuccess == null) {
        this.onSuccess = null;
      }
      if (this.onError == null) {
        this.onError = null;
      }
      if (this.url == null) {
        this.url = null;
      }
    }

    _Class.prototype.getUrl = function() {
      var p, props, url, _i, _len, _ref;
      url = this.url;
      if (url.indexOf("@v") > -1) {
        if (this.accountName == null) {
          throw new Error('AccountName not specified');
        }
        url = url.replace('@v=', "@v='" + (encodeURIComponent(this.accountName)) + "'");
      }
      if (url.indexOf("@p") > -1) {
        props = "PreferredName";
        if ((this.propertyNames == null) || this.propertyNames.length === 0) {
          throw new Error('PropertyName not specified');
        }
        if (this.propertyNames.length > 0) {
          props = this.propertyNames[0];
        }
        url = url.replace('@p=', "@p='" + props + "'");
      }
      if (url.indexOf(ShareCoffee.Url.GetMyProperties) > -1 && this.propertyNames.length > 0) {
        if ((this.propertyNames == null) || this.propertyNames.length === 0) {
          throw new Error('PropertyNames not specified');
        }
        props = "";
        _ref = this.propertyNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          props += "" + p + ",";
        }
        props = props.substr(0, props.length - 1);
        url = "" + url + "?$select=" + props;
      }
      return url;
    };

    _Class.prototype.getRequestProperties = function() {
      return new ShareCoffee.REST.RequestProperties(this.getUrl(), null, null, null, this.onSuccess, this.onError);
    };

    return _Class;

  })();

}).call(this);

/*
//@ sourceMappingURL=ShareCoffee.UserProfiles.js.map
*/