var querystring= require('querystring'),
    http= require('http'),
    https= require('https'),
    URL= require('url'),
    _ = require('underscore')

var cfg = {
  ProductionUrl: 'https://eco.taobao.com/router/rest',
  SandboxUrl: 'https://gw.api.tbsandbox.com/router/rest',
  sandbox: true,
  session: ''
};

exports.taobaoAPI = function(config) {
  var config = config || cfg;
  if (config['sandbox'] == true) {
    this._baseUrl = config['SandboxUrl'] || 'https://gw.api.tbsandbox.com/router/rest';
  } else {
    this._baseUrl = config['ProductionUrl'] || 'https://eco.taobao.com/router/rest';
  }
  this._accessTokenName= "access_token";
  this._access_token = config['access_token'];
  this._customHeaders = config['customHeaders'] || {};
}

/*
params:
  method: string, API接口名称, required
  format: xml(default) or json, optional
  access_token: reuqired
  v : 2.0, required
*/
exports.taobaoAPI.prototype.baseCall = function(params, callback) {
  var params = params || {};
  params['access_token'] = params['access_token'] || this._access_token;
  params['v'] = 2.0;
  params['format'] = 'json';
  var post_headers= {
       'Content-Type': 'application/x-www-form-urlencoded'
  };
  console.log(params);

  this._request("GET", this._baseUrl, post_headers, params, function(error, data, response) {
    if( error )  callback(error);
    else {
      var results;
      try {
        // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
        // responses should be in JSON
        results= JSON.parse( data );
      }
      catch(e) {
        results= querystring.parse( data );
      }
      callback(results); // callback results =-=
    }
  })
}

exports.taobaoAPI.prototype._request= function(method, url, headers, queryParams, callback) {
  var http_library= https;
  var parsedUrl= URL.parse( url, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) {
    parsedUrl.port= 443;
  }

  // As this is OAUth2, we *assume* https unless told explicitly otherwise.
  if( parsedUrl.protocol != "https:" ) {
    http_library= http;
  }

  var realHeaders= {};
  for( var key in this._customHeaders ) {
    realHeaders[key]= this._customHeaders[key];
  }
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }
  realHeaders['Host']= parsedUrl.host;

  var queryStr= querystring.stringify(queryParams);
  if( queryStr ) queryStr=  "?" + queryStr;
  var options = {
    host:parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + queryStr,
    method: method,
    headers: realHeaders
  };
  console.log(options);
  this._executeRequest( http_library, options, null, callback );
}

exports.taobaoAPI.prototype._executeRequest= function( http_library, options, post_body, callback ) {
  var callbackCalled= false;
  function passBackControl( response, result ) {
    if(!callbackCalled) {
      callbackCalled=true;
      if( response.statusCode != 200 && (response.statusCode != 301) && (response.statusCode != 302) ) {
        callback({ statusCode: response.statusCode, data: result });
      } else {
        callback(null, result, response);
      }
    }
  }

  var result= "";

  var request = http_library.request(options, function (response) {
    response.on("data", function (chunk) {
      result+= chunk
    });
    response.on("close", function (err) {
      if( allowEarlyClose ) {
        passBackControl( response, result );
      }
    });
    response.addListener("end", function () {
      passBackControl( response, result );
    });
  });
  request.on('error', function(e) {
    callbackCalled= true;
    callback(e);
  });

  if(  options.method == 'POST' && post_body ) {
     request.write(post_body);
  }
  request.end();  
}
