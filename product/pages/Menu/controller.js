const MealMenu = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.getTodaysMenu = function (req, res, next) {
    today = new Date().getDate();
    MealMenu.findOne({startDate: {$lt: today}, endDate: {$gt: today}}).populate("meals").then( function (err, data) {
        return respondQuery(res, err, data, 'Menu', 'Found');
    });
};