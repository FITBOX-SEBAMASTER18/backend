const Cart = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;
const Meal = require("../Meal/model");
const Order = require("../Order/model");

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

exports.purchaseCart = function(req, res, next) {
	let cartId = req.body.cartId;
	Cart.findById(cartId).populate([{ path: 'meals', select: '' }]).then(function(data,err){
		let totalPrice = 0;
		data.meals.forEach(function(meal){
			totalPrice += meal.price;
		});
		let order = Order.parseJSON({ user: data.user, meals: data.meals, price: totalPrice });
		if (order != null){
			order.save();
			return respondQuery(res,err,order,"Cart","Purchased");
		}
		else {
			return respondBadRequest(res);
		}
	});
}

exports.myCart = function (req, res, next) {
    var userId = req.user._id;
    Cart.findOne({user: userId}).populate("meals").then(function(data, err) {
        respondQuery(res,err,data,"Cart","Found")
    });
};