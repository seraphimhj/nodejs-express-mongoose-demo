/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , taobao_config = require('../../config/config')['taobao']
  , OAuth = require('oauth')
  , https = require('https')
  , taobaoAPI = require('../../lib/taobaoAPI')
  , querystring= require('querystring')
  // , Treasure = mongoose.model('treasure')

/**
 * Find product by id
 */


exports.show = function(req, res){
  authorizeCode = req.query.code;
  var oa = new OAuth.OAuth2(
                  taobao_config['app_key'],
                  taobao_config['app_secret'],
                  taobao_config['productOauthURL'],
                  'authorize',
                  'token');
  oa.getOAuthAccessToken(authencateCode, {
    'grant_type':'authorization_code',
    'redirect_uri': taobao_config['redirect_uri'],
  },function(err, access_token, refresh_token, results){
      console.log(access_token);
      req.session.access_token = access_token;
      req.session.taobaoAPI = new taobaoAPI(_.extend(taobao_config, 
        {
          'access_token': access_token,
        })
      );
      params = {
        method: 'taobao.user.seller.get',
        fields: 'user_id,uid,nick,sex',
      }
      req.session.taobaoAPI.baseCall(params, function (data) {
        console.log(data);
      })
  })
  // taobao.userGet({
  //   fields: 'user_id, nick, sex, buyer_credit',
  // }, function(data) {
  //   console.log(data);
  //   res.render('test', {
  //     data: data
  //   })
  // })
  // params = {
  //   method: 'taobao.user.seller.get',
  //   fields: 'user_id,uid,nick,sex',
  // }
  // req.session.taobaoAPI.baseCall(url, params, function (data) {
  //   console.log(data);
  // })
}

// https://oauth.tbsandbox.com/authorize?client_id=1021553521&response_type=code&redirect_uri=http://hongrwei.com/treasure
// https://eco.taobao.com/router/rest?access_token=6200414074d7c11a671202ZZd062c2e6f5a5e7706a4b7cf54991114&method=taobao.user.seller.get&v=2.0&fields=user_id,uid,nick,sex
// https://gw.api.tbsandbox.com/router/rest   

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


/**
 * Delete an product
 */

exports.destroy = function(req, res){
  var product = req.product
  product.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/products')
  })
}

/**
 * List of Products
 */

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
