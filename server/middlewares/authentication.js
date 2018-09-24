const jwt = require('jsonwebtoken');

// ==========================
// Verify Token 
// ==========================
let verifyToken = ( req, res, next ) => {
  //next => continue program execution
  let token = req.get('token');

  jwt.verify( token, process.env.SEED, (err, decoded) =>{

    if(err){

      return res.status(401).json({
        ok: false,
        err        
        // err: {
        //   message: 'Token not valid'
        // }
      });

    }

    req.user = decoded.user;
    next();

  });

  // res.json({
  //   token
  // });

  // console.log(token);  

};

// ==========================
// Verify Admin Role 
// ==========================
let verifyAdmin_Role = ( req, res, next ) => {

  let user = req.user;

  if(user.role === 'ADMIN_ROLE'){
    next();    
  }else{
    return res.status(401).json({
        ok: false,
        err: {
          message: 'Unauthorized user'
        }
      }); 
  }

  

};


module.exports = {
  verifyToken,
  verifyAdmin_Role
}