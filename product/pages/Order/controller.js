const Order = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.getOrderOfUser = function (req, res, next) {
    var userId = req.user._id;
    Order.find({user: userId}).populate("meals").then(function(data, err) {
        respondQuery(res,err,data,"Orders","Found")
    });
};