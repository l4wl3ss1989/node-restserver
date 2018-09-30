const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product')

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

  let type = req.params.type;
  let id = req.params.id;

  if (!req.files){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No selected file'
      }
    });
  }

  //validate type
  let validType = ['products', 'users'];

  if( validType.indexOf(type) < 0){

    return res.status(400).json({
      ok: false,
      err: {
        message: 'Valid types: ' + validType.join(', '),
        type
      }

    });
  }

  let file = req.files.file; //body.file

  //Valid Extensions
  let validEx = ['png', 'jpg', 'gif', 'jpeg'];
  let temp = file.name.split('.');
  let extension = temp[temp.length - 1];
  
  if( validEx.indexOf( extension ) < 0 ){

    return res.status(400).json({
      ok: false,
      err: {
        message: 'Valid extensions: ' + validEx.join(', '),
        ext: extension
      }

    });
  }

  // change file name
  let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

  file.mv(`uploads/${ type }/${ fileName }`, (err) =>{
    
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    
    if(type == 'users')
      imageUser(id, res, fileName);

    if(type == 'products')
      imageProduct(id, res, fileName);

    // res.json({
    //   ok: true,
    //   message: 'File uploaded!' 
    // });

  });
  
});

function imageUser(id, res, fileName){

  User.findById(id, (err, userDB) =>{

    if(err){
      deleteFile(fileName, 'users');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!userDB){
      deleteFile(fileName, 'users');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User doesn\'t exists'
        }
      });
    }

    deleteFile(userDB.img, 'users');

    userDB.img = fileName;

    userDB.save( (err, userSaved) =>{

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        user: userSaved,
        img: fileName
      });

    });

  });

}

function imageProduct(id, res, fileName){

  Product.findById(id, (err, productDB) =>{

    if(err){
      deleteFile(fileName, 'products');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productDB){
      deleteFile(fileName, 'products');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Product doesn\'t exists'
        }
      });
    }

    deleteFile(productDB.img, 'products');

    productDB.img = fileName;

    productDB.save( (err, productSaved) =>{

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        product: productSaved,
        img: fileName
      });

    });

  });

}

function deleteFile(imgName, type){

  let pathImg = path.resolve( __dirname, `../../uploads/${ type }/${ imgName }` );

  if( fs.existsSync(pathImg) ){
    fs.unlinkSync(pathImg);
  }
}

module.exports = app;