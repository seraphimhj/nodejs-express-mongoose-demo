/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , taobao_config = require('../../config/config')['taobao']['production']
  // , taobao_config = require('../../config/config')['taobao']['sandbox']
  , OAuth = require('oauth')
  , https = require('https')
  , taobao = require('../../lib/taobaoAPI').taobaoAPI
  , tbApiGroup = require('../../lib/taobaoAPI').apiGroup
  , querystring= require('querystring');
                                                        
var taobaoAPI = new taobao(taobao_config);
     
var oa = new OAuth.OAuth2(
    taobao_config['app_key'],
    taobao_config['app_secret'],
    taobao_config['productOauthURL'],
    'authorize',
    'token'); 

exports.show = function(req, res){
  // var requestApi = tbApiGroup.item.getInventory;
  var requestApi = tbApiGroup.user.getSeller;
  if (req.session.access_token != undefined) {
    console.log(requestApi);
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
  } else {
    authorizeCode = req.query.code;
    console.log("second if code is " + authorizeCode);
    oa.getOAuthAccessToken(authorizeCode, {
      'grant_type':'authorization_code',
      'redirect_uri': taobao_config['redirect_uri'],
    },function(err, access_token, refresh_token, results){
      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
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
    });
  }
}

// https://oauth.tbsandbox.com/authorize?client_id=1021553521&response_type=code&redirect_uri=http://hongrwei.com/treasure
// https://eco.taobao.com/router/rest?access_token=6200414074d7c11a671202ZZd062c2e6f5a5e7706a4b7cf54991114&method=taobao.user.seller.get&v=2.0&fields=user_id,uid,nick,sex
// https://gw.api.tbsandbox.com/router/rest   
// http://www.yihaodian.com/2/?tracker_u=108126376&uid=7966016&type=3
// http://www.jd.com/?utm_source=go.fanhuan.com&utm_medium=tuiguang&utm_campaign=t_6242_20130623t3MEt3ELGtBF403

exports.oauth = function(req, res){
  authorizeUrl = taobao_config['productOauthURL'] + 'authorize?';
  params = {      
    'client_id' : taobao_config['app_key'],
    'redirect_uri' : taobao_config['redirect_uri'],
    'response_type': 'code',
    'view' : 'web'
  }
  authorizeUrl += querystring.stringify(params);
  console.log(authorizeUrl)
  res.redirect(authorizeUrl)
}


exports.index = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/index', {
      title: '产品列表',
      products: products
    })
  })
}
