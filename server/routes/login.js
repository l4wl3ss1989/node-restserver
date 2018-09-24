const express = require('express');
// ==========================
// Using bcryptjs insted of bcrypt 
// https://stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm
// ==========================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) =>{

  let body = req.body;

  User.findOne({ email: body.email}, (err, userDB)=>{

    if(err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if( !userDB ) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "User or password incorrect"
        }
      }); 
    }
    console.log(bcrypt.compareSync( body.password, userDB.password ));
    if( !bcrypt.compareSync( body.password, userDB.password ) ){
      return res.status(500).json({
        ok: false,
        err: {
          message: "User or password incorrect"
        }
      });
    }

    let token = jwt.sign({
      user: userDB
    }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRE }); //ss/mm/hh/dd

    res.json({
      ok: true,
      user: userDB,
      token
    });

  });

});




module.exports = app;