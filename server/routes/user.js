const express = require('express');
const bcrypt = require('bcryptjs');
const _= require('underscore');
const User = require('../models/user');
const app = express();

app.get('/user', function (req, res) {

  let begin = req.query.begin || 0;
  begin = Number(begin);

  let limit = req.query.limit || 5
  limit = Number(limit);

  User.find({status: true}, 'name email role status google img')
    .skip(begin)
    .limit(limit)
    .exec((err, users) =>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      User.count({status: true}, (err, count) =>{
        return res.json({
          ok: true,
          total: count,
          users
        });
      });

    });

});

app.post('/user', function (req, res) {

  let saltRounds = 10;
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, saltRounds),
    role: body.role
  });

  user.save( (err, userDB) => {

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      user: userDB
    });
    
    // userDB.password = null;
  });

  // if(body.name === undefined){
  //   res.status(400).json({
  //     ok: false,
  //     messaje: 'name required.'
  //   });
  // }else{
  //   res.json({
  //     user: body
  //   });
  // }
  
});

app.put('/user/:id', function (req, res) {

  let id = req.params.id;
  let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'staus'] );

  // delete body.password;
  // delete body.google;

  User.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB) => {

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      user: userDB
    });    

  });

});

app.delete('/user/:id', function (req, res) {
  
  let id = req.params.id;
  let changeStatus = {
    status: false
  }

  User.findByIdAndUpdate( id, changeStatus, { new: true }, (err, userDeleted) =>{

    if( err ){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      user: userDeleted
    });

  });

  // User.findByIdAndRemove(id, (err, userDeleted) =>{

  //   if(err){
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }else{

  //     if(!userDeleted){
  //         res.json({
  //           ok: true,
  //           err: {
  //             messaje: 'User not found'
  //           }
  //         });
  //     }else{
  //       res.json({
  //         ok: true,
  //         user: userDeleted
  //       });
  //     }
      
  //   }

  // });

});

module.exports = app;