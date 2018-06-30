const MealMenu = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.getTodaysMenu = function (req, res, next) {
    let today = Date.now();
    MealMenu.findOne({startDate: {$lte: today}, endDate: {$gt: today}}).populate("meals").then( function (err, data) {
        return respondQuery(res, err, data, 'Menu', 'Found');
    });
};