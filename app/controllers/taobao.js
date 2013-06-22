/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , taobao = require('taobao')
  , async = require('async')
  , _ = require('underscore')
  , taobao_config = require('../../config/config')['taobao']
  , OAuth = require('oauth')
  , https= require('https')
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
                  getRequestTokenUrl,
                  'authorize',
                  'token');
  oa.getOAuthAccessToken(authencateCode, {
    'grant_type':'authorization_code',
    'redirect_uri': 'http://hongrwei.com/treasure'
  },function(access_token, refresh_token, results){
      console.log(access_token)
  })
  taobao.userGet({
    fields: 'user_id, nick, sex, buyer_credit',
  }, function(data) {
    console.log(data);
    res.render('test', {
      data: data
    })
  })

}

//  https://oauth.tbsandbox.com/authorize?client_id=1021553521&response_type=code&redirect_uri=http://hongrwei.com/treasure

exports.oauth = function(req, res){
  authorizeUrl = 'https://oauth.tbsandbox.com/authorize?';
  params = {      
    'client_id' : taobao_config['app_key'],
    'response_type': 'code',
    'redirect_uri' : 'http://hongrwei.com/treasure',
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

