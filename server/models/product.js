const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let productSchema = new Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  unitPrice: {
    type: Number, 
    required: [true, 'Unit price is required']
  },
  desc: {
    type: String,
    required: false
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category' 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

});

//productSchema.plugin( uniqueValidator, { message: '{PATH} must be unique' } );

module.exports = mongoose.model( 'Product', productSchema );