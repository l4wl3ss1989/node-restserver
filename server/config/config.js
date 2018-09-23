// ==========================
// PORT
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// Enviroment
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Data Base
// ==========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/coffee'
}else{
  urlDB = 'mongodb://coffee-user:456ytr@ds113003.mlab.com:13003/coffee';
}

process.env.ULR_DB = urlDB;

