const Order = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.getOrderOfUser = function (req, res, next) {
    var userId = req.body.userId;
    Order.find({user: userId}).populate("user").then(function(err, data) {
        respondQuery(res,err,data,"Orders","Found")
    });
};