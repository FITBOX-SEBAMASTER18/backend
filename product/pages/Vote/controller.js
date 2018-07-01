const Vote = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.myVote = function(req, res, next){
    var userId = req.user._id;
    Cart.findOne({user: userId}).populate("meal").then(function(data, err) {
        respondQuery(res,err,data,"Vote","Found")
    });
}

exports.currentResults = function(req, res, next){
    Vote.aggregate({ $group: { _id: '$meal', total_products: { $sum: 1 } } }).exec(function(err, data) {
        // Don't forget your error handling
        // The callback with your transactions
        // Assuming you are having a Tag model
        if(!err){
            Vote.populate(data, {path: 'meal'}, function(err, data) {
                respondQuery(res,err,data,"Result","Found")
            });
        }else{
            respondQuery(res,err,data,"Result","Found")
        }
    });;
}