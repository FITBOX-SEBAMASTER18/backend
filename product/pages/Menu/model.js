const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const MenuSchema = new Schema({
  startDate:        {type: Date},
  endDate:          {type: Date},
  meals:            [{type: mongoose.SchemaTypes.ObjectId, ref: 'Meal'}],
  properties:       {type: Properties}
});

MenuSchema.index({startDate: 1, endDate: 1})

MenuSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  return false;
  };

  MenuSchema.statics.parseJSON = function(body, user) {

    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
      startDate:    body.startDate   || Date().getDate(),
      endDate:      body.endDate   || Date().getDate() + 7,
      meals:        body.meals || [],
      properties:   properties
    };

    if(body.properties) object.properties = properties;

    object.properties.owner = user._id;
    object = new this(object);
    console.log(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.startDate) || isEmpty(object.endDate) || isEmpty(object.meals) 
  || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Menu', MenuSchema);