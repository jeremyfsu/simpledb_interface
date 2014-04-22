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
    var payload = null;
    var displayUri = $endpoint;

    params["Attribute.1.Name"] = item;
    params["Attribute.1.Value"] = data;
    params["Attribute.1.Replace"] = "true";
    params.Action = "PutAttributes";
    params.Version = this.version;
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

  },

  get: function(item) {
  },

  del: function(item) {
  }
};
SimpleDB.init();
