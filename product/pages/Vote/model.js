const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const VoteSchema = new Schema({
    meal:    {type: mongoose.SchemaTypes.ObjectId, ref: 'Meal'},
    user:    {type: mongoose.SchemaTypes.ObjectId, ref: 'User', unique: true}
});

VoteSchema.methods.canAccess = function(user, readOnly) {
    if(!this.properties.active())
      return false;
  
    if(Auth.canAccess(this.properties, user, readOnly))
      return true;
  
    return false;
};
  
VoteSchema.statics.parseJSON = function (body, user) {

    let properties = {};
    if (body.readVisibility) properties.readVisibility = body.properties.readVisibility;
    if (body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
        meal: body.meal || null,
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
    return !(isEmpty(object.user) || isEmpty(object.meal))
};

module.exports = mongoose.model('Vote', VoteSchema);