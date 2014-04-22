var SimpleDB = {
  $endpoint: 'https://sdb.amazonaws.com',

  init: function(accessKeyId, secretKey, domain) {
    this.domain = domain;
    this.accessKeyId = accessKeyId;
    this.secretKey = secretKey;
    this.host = $endpoint.replace(/.*:\/\//, "");
    this.version = "2009-04-15";
  },

  save: function(item, data) {
    var params = {};

    params["ItemName"] = item;
    params["Attribute.1.Name"] = "data";
    params["Attribute.1.Value"] = data;
    params["Attribute.1.Replace"] = "true";
    params["DomainName"] = this.domain;
    params.Action = "PutAttributes";
    params.Version = this.version;

    return sign(params);
  },

  get: function(item) {
    var params = {};

    params["ItemName"] = item;
    params["AttributeName.1"] = "data";
    params["DomainName"] = this.domain;
    params.Action = "GetAttributes";
    params.Version = this.version;
    
    return sign(params);
  },

  del: function(item) {
  },

  sign: function(params) {
    var payload = null;
    var displayUri = $endpoint;
    var signer = new AWSV2Signer(this.accessKeyId, this.secretKey);
    params = signer.sign(params, new Date(), {
      "verb": "GET",
      "host": this.host,
      "uriPath": "/"
    });
    
    var encodedParams = [];
    for (var key in params) {
      if (params[key] !== null) {
        encodedParams.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
      } 
      else {
        encodedParams.push(encodeURIComponent(key));
      }
    }

    payload = encodedParams.join("&");
    displayUri += "?" + payload;

    return displayUri;

  }
};
SimpleDB.init();
