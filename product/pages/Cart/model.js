const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const CartSchema = new Schema({
  meals:            [{type: mongoose.SchemaTypes.ObjectId, ref: 'Meal'}],
  user:             {type: mongoose.SchemaTypes.ObjectId, ref: 'User', unique: true},
  properties:       {type: Properties}
});

CartSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  return false;
};

CartSchema.statics.parseJSON = function(body, user) {

    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = 5;
    if(body.writeVisibility) properties.writeVisibility = 5; // Owner visibility id

    let object = {
      meals:        body.meals || [],
      user:         body.user || null,
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
  return !(isEmpty(object.name) || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Cart', CartSchema);