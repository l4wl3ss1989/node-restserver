require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
const colors = require('colors/safe');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
//Global routes configuration
app.use( require('./routes/index') );

mongoose.connect(process.env.ULR_DB, { useNewUrlParser: true }, (err, response)=>{
  
  if(err) throw colors.red(err);

  console.log(colors.green('Data Base ONLINE'));

}); 

app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));