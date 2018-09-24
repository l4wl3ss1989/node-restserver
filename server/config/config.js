// ==========================
// PORT
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// Enviroment
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Seed Authentification
// ==========================
process.env.SEED = process.env.SEED || 'seed-development-coffee';

// ==========================
// Token Expire
// ==========================
// 60 seconds
// 60 minuts
// 24 hours
// 30 days
process.env.TOKEN_EXPIRE = 60 * 60 * 24 * 30;

// ==========================
// Data Base
// ==========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/coffee'
}else{
  urlDB = process.env.MONGO_URI;
}

process.env.ULR_DB = urlDB;

