const express = require('express');

const userRouter          = require('./pages/User/router');
const MealRouter  = require('./pages/Meal/router');



module.exports = function(app) {
  userRouter(app);
  MealRouter(app);
}
