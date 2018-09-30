const express = require('express');

const fs = require('fs');
const path = require('path');

const { verifyTokenImage } = require('../middlewares/authentication');

let app = express();

app.get('/image/:type/:img', verifyTokenImage, (req, res) =>{

  let type = req.params.type;
  let img = req.params.img;

  let pathImg = path.resolve( __dirname, `../../uploads/${ type }/${ img }` );
  let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

  if(fs.existsSync( pathImg )){
    res.sendFile( pathImg );
  }else{
    res.sendFile( noImagePath );
  }

});

module.exports = app;