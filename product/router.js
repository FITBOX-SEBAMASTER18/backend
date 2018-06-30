const express = require('express');

const UserRouter	= require('./pages/User/router');
const MealRouter  = require('./pages/Meal/router');
const CartRouter  = require('./pages/Cart/router');
const AddressRouter  = require('./pages/Address/router');
const MenuRouter  = require('./pages/Menu/router');
const OrderRouter  = require('./pages/Order/router');




module.exports = function(app) {
  
  UserRouter(app);
  MealRouter(app);
  CartRouter(app);
  AddressRouter(app);
}
