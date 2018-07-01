const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const AddressSchema = new Schema({
    address:    {type: String, required: true},
    label:      {type: String, required: true},
    user:       {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
});

AddressSchema.methods.canAccess = function(user, readOnly) {
    if(!this.properties.active())
      return false;
  
    if(Auth.canAccess(this.properties, user, readOnly))
      return true;
  
    return false;
};
  
AddressSchema.statics.parseJSON = function (body, user) {

    let properties = {};
    if (body.readVisibility) properties.readVisibility = body.properties.readVisibility;
    if (body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
        address: body.address || "",
        label: body.label || 0,
        user: user._id || null,
        properties: properties
    };

    if (body.properties) object.properties = properties;

    object.properties.owner = user._id;
    object = new this(object);
    if (repOK(object))
        return object;
    else
        return null;
};

const repOK = function (object) {
    return !(isEmpty(object.user) || isEmpty(object.address) || isEmpty(object.label))
};

module.exports = mongoose.model('Address', AddressSchema);