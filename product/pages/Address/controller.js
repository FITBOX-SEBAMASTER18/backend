const Address = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.getAddressByUser = function (req, res, next) {
    var userId = req.user._id;
    Address.find({user: userId}).then(function(data, err) {
        respondQuery(res,err,data,"Address","Found")
    });
};