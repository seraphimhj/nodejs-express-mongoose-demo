
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Product = mongoose.model('Product')
  , _ = require('underscore')

/**
 * Find product by id
 */

exports.product = function(req, res, next, id){
  var User = mongoose.model('User')

  Product.load(id, function (err, product) {
    if (err) return next(err)
    if (!product) return next(new Error('Failed to load product ' + id))
    req.product = product
    next()
  })
}

/**
 * View an article
 */

exports.show = function(req, res){
  var options = {
    perPage: 999,
    page: 0
  }
  Product.list(options, function(err, products) {
    if (err) return res.render('500')
    Product.count().exec(function (err, count) {
      res.render('products/show', {
        title: req.product.title,
        product: req.product,
        products: products
      })
    })
  })
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
    if (err) return res.render('500')
    Product.count().exec(function (err, count) {
      res.render('products/index', {
        title: '产品列表',
        products: products
      })
    })
  })
}

/**
 * initial products
 */

exports.initial = function(req, res){
  Product.remove().exec()

  var product = new Product({})
  product.title = "ES800AC高速全自动糊盒机"
  product.body = "ES800AC高速全自动糊盒机"
  product.tags = 
  product.image.cdnUri = "../img/products/es800ac"
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900型高速自动纸盒糊盒机"
  product.body = "ZH-900型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900"
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900B型高速自动纸盒糊盒机"
  product.body = "ZH-900B型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900b"
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900C型高速自动纸盒糊盒机"
  product.body = "ZH-900C型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900c"
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product
  return res.render('404')
}
