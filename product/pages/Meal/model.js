const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const MealSchema = new Schema({
  name:           {type: String, required: true},
  description:    {type: String},
  amount:         {type: Number},
  ingredients:    {type: [String]},
  calories:       {type: Number},
  fat:            {type: Number},
  protein:        {type: Number},
  carbohydrates:  {type: Number},
  price:          {type: Number},
  image:          {type: String},
  filters:        {type: [String]},
  properties:     {type: Properties}
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
      name:           body.name   || "",
      description:    body.description || "",
      amount:         body.amount   || 0,
      ingredients:    body.ingredients   || [],
      calories:       body.calories   || 0,
      fat:            body.fat   || 0,
      protein:        body.protein   || 0,
      carbohydrates:  body.carbohydrates   || 0,
      price:          body.price   || 0,
      image:          body.image || null,
      filters:        body.filters || null,
      properties:     properties
    };

    if(body.properties) object.properties = properties;

    object.properties.owner = user._id;
    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

MealSchema.methods.setBy = function(body) {

    let object = {
      name:           body.name   || this.name,
      description:    body.description || this.description,
      amount:         body.amount   || this.amount,
      ingredients:    body.ingredients   || this.ingredients,
      calories:       body.calories   || this.calories,
      fat:            body.fat   || this.fat,
      protein:        body.protein   || this.protein,
      carbohydrates:  body.carbohydrates   || this.carbohydrates,
      price:          body.price   || this.price,
      image:          body.image || this.image,
      filters:        body.filters || this.filters
    };

    object = this.set(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.name) ||  !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Meal', MealSchema);