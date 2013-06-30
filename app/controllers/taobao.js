/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
 //  , taobao_config = require('../../config/config')['taobao']['production']
  , taobao_config = require('../../config/config')['taobao']['sandbox']
  , OAuth = require('oauth')
  , https = require('https')
  , taobao = require('../../lib/taobaoAPI').taobaoAPI
  , tbApiGroup = require('../../lib/taobaoAPI').apiGroup
  , querystring= require('querystring');
                                                        
var taobaoAPI = new taobao(taobao_config);

exports.oauth = function(req, res){
  authorizeUrl = taobaoAPI.getAuthorizeUrl();
  res.redirect(authorizeUrl)
}

// middleware
exports.getAccessToken = function(req, res, next){
  if (req.session.access_token != undefined) {
    next();
  } else {
    authorizeCode = req.query.code;
    taobaoAPI.getOAuthAccessToken(authorizeCode, 
        function(err, access_token, refresh_token, results){
      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      next();
    });
  }
}

exports.products = function(req, res){
  // var requestApi = tbApiGroup.item.getInventory;
  var requestApi = tbApiGroup.item.getOnsale;
  params = {
    method: requestApi.method,
    fields: requestApi.required.fields, 
    access_token: req.session.access_token,
  };
  taobaoAPI.baseCall(params, function (data) {
    item_list = data["items_onsale_get_response"]["items"]["item"]
    console.log(item_list);
    return res.render('taobao/products',
      {
        // products: JSON.stringify(data),
        // products: JSON.stringify(item_list),
        products: item_list,
      });
  });
}

exports.index = function(req, res){
  // var requestApi = tbApiGroup.item.getOnsale;
  var requestApi = tbApiGroup.user.getSeller;
  params = {
    method: requestApi.method,
    fields: requestApi.required.fields, 
    access_token: req.session.access_token,
  };
  taobaoAPI.baseCall(params, function (data) {
    console.log(data);
    return res.render('test',
      {
        data: JSON.stringify(data),
      });
  });
}
