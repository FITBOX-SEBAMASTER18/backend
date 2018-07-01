const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');
const winston = require('winston');

const param = function(req,res,next){

    req.args = {model: model,
            getSelect: {}, 
            listSelect:{},
            logType: "Address",
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();
    routes.post('/user/',            controller.getAddressByUser);

    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);
    routes.post('/remove',  param,  query.remove);

    

    app.use('/address', routes);
}
