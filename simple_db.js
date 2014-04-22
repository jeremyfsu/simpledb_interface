function SimpleDB(accessKeyId, secretKey, domain) {
  this.endpoint = 'https://sdb.amazonaws.com',
  this.domain = domain;
  this.accessKeyId = accessKeyId;
  this.secretKey = secretKey;
  this.host = this.endpoint.replace(/.*:\/\//, "");
  this.version = "2009-04-15";
}

SimpleDB.prototype.sign = function(params) {
  var payload = null;
  var displayUri = this.endpoint;
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

SimpleDB.prototype.save = function(item, data) {
  var params = {};

  params["ItemName"] = item;
  params["Attribute.1.Name"] = "data";
  params["Attribute.1.Value"] = data;
  params["Attribute.1.Replace"] = "true";
  params["DomainName"] = this.domain;
  params.Action = "PutAttributes";
  params.Version = this.version;

  return this.sign(params);
}

SimpleDB.prototype.get = function(item) {
  var params = {};

  params["ItemName"] = item;
  params["AttributeName.1"] = "data";
  params["DomainName"] = this.domain;
  params.Action = "GetAttributes";
  params.Version = this.version;

  return this.sign(params);
}

SimpleDB.prototype.del = function(item) {}
