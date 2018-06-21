const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const MealSchema = new Schema({
  name:    {type: String, required: true},
  amount:  {type: Number},
  ingredient: [{type:String}],
  calories:     {type: Number},
  price:   {type:Number},
  properties:   {type: Properties}
});

MealSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  return false;
  };

MealSchema.statics.parseJSON = function(body, user) {

    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
      name:   body.name   || "",
      amount:  body.amount   || 0,
      ingredient: body.ingredient   || "",
      calories:     body.calories   || 0,
      price:    body.price   || 0,
      properties: properties
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

module.exports = mongoose.model('Meal', MealSchema);