const express = require('express');
// ==========================
// Using bcryptjs insted of bcrypt 
// https://stackoverflow.com/questions/29320201/error-installing-bcrypt-with-npm
// ==========================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Google configuration
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];

  console.log(payload.name);
  console.log(payload.email);
  console.log(payload.picture);

  return{
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }

}


app.post('/google', async (req, res) =>{

  let token = req.body.idtoken;

  let googleUser = await verify( token )
    .catch( e => {
      return res.status(403).json({
        ok: false,
        err: e
      });
    });

  User.findOne({ email: googleUser.email }, (err, userDB) =>{

    if(err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if( userDB ){

      if(!userDB.google){
        return res.status(400).json({
          ok: false,
          message: 'Use normal authentifiction'
        });
      }else{
        let token = jwt.sign({
          user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRE });

        return res.json({
          ok: true,
          user: userDB,
          token
        });
      }
    }else{
      // New User
      let user = new User({
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: ':)'
      });
      // user.name = googleUser.name;
      // user.email = googleUser.email;
      // user.img = googleUser.img;
      // user.google = true;
      // user.password = ':)';

      user.save( (err, userDB) =>{

        if(err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        let token = jwt.sign({
          user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRE });

        return res.json({
          ok: true,
          user: userDB,
          token
        });

      });
    }

  });

  // res.json({
  //   user: googleUser
  // });

});

module.exports = app;