const express = require('express');

const { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');

const Category = require('../models/category');

const app = express();

// ==========================
// Show all categories
// ==========================
app.get('/category', verifyToken, (req, res) =>{
  Category.find({})
    .sort('desc')
    .populate('user', 'name email')
    .exec((err, categories) =>{
      
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        categories
      });
    });
});

// ==========================
// Show categoryfrom ID
// ==========================
app.get('/category/:id', verifyToken, (req, res) =>{

  let id = req.params.id;

  Category.findById( id, (err, categoryDB) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoryDB){
      return res.status(400).json({
        ok: false,
        message: 'id doesn\'t exists'
      });
    }

    return res.json({
      ok: true,
      category: categoryDB
    });

  });
});

// ==========================
// New category
// ==========================
app.post('/category', verifyToken, (req, res) =>{

  let body = req.body;
  let category =  new Category({
    user: req.user._id,
    desc: body.desc
  });

  category.save( (err, categoryDB) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoryDB){
      return res.status(400).json({
        ok: false,
        message: 'category wasn\'t created'
      });
    }

    return res.json({
      ok: true,
      category: categoryDB
    });

  });

});

// ==========================
// Update category
// ==========================
app.put('/category/:id', verifyToken, (req, res) =>{
  
  let id = req.params.id;
  let body = req.body;

  let descCategory = {
    desc: body.desc
  }  

  Category.findByIdAndUpdate( id, descCategory, {new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoryDB){
      return res.status(400).json({
        ok: false,
        message: 'id doesn\'t exists'
      });
    }

    return res.json({
      ok: true,
      category: categoryDB
    });

  });

});

// ==========================
// Delete category
// ==========================
app.delete('/category/:id', [ verifyToken, verifyAdmin_Role ], (req, res) =>{
  
  let id = req.params.id;

  Category.findByIdAndRemove( id, (err, categoryDB) =>{

    if( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoryDB){
      return res.status(400).json({
        ok: false,
        message: 'id doesn\'t exists'
      });
    }

    return res.json({
      ok: true,
      category: categoryDB
    });

  });

});

module.exports = app;