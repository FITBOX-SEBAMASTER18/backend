const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');
const winston = require('winston');

const param = function(req,res,next){

    req.args = {model: model,
            getSelect: {}, 
            listSelect:{},
            logType: "Cart",
            populateQuery: "meals"
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();

    routes.get('/userCart',        controller.myCart);
    routes.post('/purchase', controller.purchaseCart)
    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.post('/remove',  param,  query.remove);
    routes.post('/addToCart',       controller.addToCart);
    routes.post('/removeFromCart',  controller.removeFromCart);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);


    

    app.use('/cart', routes);
}
