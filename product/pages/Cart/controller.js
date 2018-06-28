const Cart = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.addToCart = function (req, res, next) {
	let mealId = req.body.mealId;
	let userId = req.user._id;

	Cart.findOne({ user: userId }).then(function(data, err){
		data.meals.push(mealId);
		data.save();
		return respondQuery(res,err,data,"Meal","Added");
	})
}

exports.removeFromCart = function (req, res, next) {
	let mealId = req.body.mealId;
	let userId = req.user._id;

	Cart.findOne({ user: userId }).then(function(data, err){
		data.meals.pull(mealId);
		data.save();
		return respondQuery(res,err,data,"Meal","Removed");
	})
}