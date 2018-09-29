const express = require('express');
const _= require('underscore');
const { verifyToken } = require('../middlewares/authentication');

const app = express();

const Product = require('../models/product');

// ==========================
// Show all products
// ==========================
app.get('/products', verifyToken, (req, res) =>{
  // get all products
  // populate: user category
  // pager

  let begin = req.query.begin || 0;
  begin = Number(begin);

  let limit = req.query.limit || 5;
  limit = Number(limit);

  Product.find( {available: true}, 'name unitPrice desc' )
    .skip(begin)
    .limit(limit)
    .sort('name')
    .populate('user', 'name email')
    .populate('category', 'desc')
    .exec((err, products) =>{
      
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        products
      });

    });

});

// ==========================
// Get product by ID
// ==========================
app.get('/products/:id', verifyToken, (req, res) =>{
  // populate: user category
  let id = req.params.id;

  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'desc')
    .exec((err, productFound) =>{
      
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if(!productFound){
        return res.status(400).json({
          ok: false,
          message: 'id doesn\'t exists'
        });
      }

      return res.json({
        ok: true,
        productFound
      });

    });
});

// ==========================
// Get product by ID
// ==========================
app.get('/products/search/:term', verifyToken, (req, res) =>{

  let term = req.params.term;

  let regex = new RegExp(term, 'i');

  Product.find({ name: regex, available: true})
    .populate('category', 'desc')
    .exec( (err, products) =>{

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        products
      });

    });

});

// ========================== 
// New product
// ==========================
app.post('/products', verifyToken, (req, res) =>{
  // save user
  // save category listed
  let body = req.body
  let product = new Product({
    user: req.user._id,
    category: body.category,
    name: body.name,
    unitPrice: body.unitPrice,
    desc: body.desc
  });

  product.save( (err, productDB) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productDB){
      return res.status(400).json({
        ok: false,
        message: 'Product wasn\'t created'
      });
    }

    return res.status(201).json({
      ok: true,
      product: productDB,
      message: 'Product created'
    });

  });
  
});

// ==========================
// Update product
// ==========================
app.put('/products/:id', verifyToken, (req, res) =>{
  // save user
  // save category listed
  let id = req.params.id;
  let user = req.user._id;
  let body = _.pick( req.body, ['category', 'name', 'unitPrice', 'desc'] );
  body["user"] = user;

  Product.findByIdAndUpdate( id, body, {new: true}, (err, productDB) => {

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productDB){
      return res.status(400).json({
        ok: false,
        message: 'id doesn\'t exists'
      });
    }

    //manualy update user, should find a better way
    /*
      console.log(user);
      productDB.user = user;

      productDB.save( (err, productSaved) =>{

        if( err ){
          return res.status(500).json({
            ok: false,
            err
          });
        }

        return res.json({
          ok: true,
          category: productSaved
        });

      }); 
    */   

    return res.json({
      ok: true,
      category: productDB
    });

  });

});


// ==========================
// Delete product
// ==========================
app.delete('/products/:id', verifyToken, (req, res) =>{
  // available false
  let id = req.params.id;
  let user = req.user._id;
  let unavailable = {
    user,
    available: false
  }

  Product.findByIdAndUpdate( id, unavailable, {new: true}, (err, productDeleted) =>{

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(!productDB){
      return res.status(400).json({
        ok: false,
        product: 'id doesn\'t exists',
        message: 'Product deleted'
      });
    }

    return res.json({
      ok: true,
      user: productDeleted
    });

  });
  
});


module.exports = app;