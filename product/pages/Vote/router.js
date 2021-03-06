const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');
const winston = require('winston');

const param = function(req,res,next){

    req.args = {model: model,
            getSelect: {}, 
            listSelect:{},
            logType: "Vote",
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();


    routes.post('/create',  param,  query.create);
    //routes.post('/edit',    param,  query.edit);
    routes.get('/myVote', controller.myVote);
    routes.get('/currentResults', controller.currentResults);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);
    routes.post('/remove',  param,  query.remove);

    

    app.use('/vote', routes);
}
