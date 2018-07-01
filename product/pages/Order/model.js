const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const OrderSchema = new Schema({
  price:            {type: Number},
  date:             {type: Date, default: Date.now},
  meals:            [{type: String}],
  user:             {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  properties:       {type: Properties}
});

OrderSchema.index({date: 1, state: 1, user: 1})

OrderSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  return false;
  };

  OrderSchema.statics.parseJSON = function(body, user) {

    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
      price:        body.price   || 0,
      date:         body.date   || Date.now(),
      meals:        body.meals || [],
      state:        body.state || [],
      user:         user._id || "",
      properties:   properties
    };

    if(body.properties) object.properties = properties;

    object.properties.owner = user._id;
    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.date) || isEmpty(object.meals) || isEmpty(object.user)  
  || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Order', OrderSchema);