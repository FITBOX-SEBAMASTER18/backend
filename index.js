const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Grid = require('gridfs-stream');
const winston = require('winston');
var socket = require('socket.io');

const router = require('./product/router');
const config = require('./product/config.json');
const auth   = require('./product/pages/User/Auth').auth;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


mongoose.Promise = global.Promise;
//Grid.mongo = mongoose.mongo;
const conn = mongoose.connect(config.db, { useMongoClient: true });
global.db = mongoose.connection.db;
var gfs;
mongoose.connection.once('open', function () {
  Grid.mongo = mongoose.mongo;
  global.gfs = Grid(mongoose.connection.db);
 // console.log('DB connection established! here');
   winston.log('info', 'DB connection established!');
  // all set!
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(auth);

// Logger setup
require('./configureWinston')(winston);
app.use((req, res, next) => {
   winston.info('Request received', {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip
   });
   req.rcvDate = Date.now()
   res.rcvDate = Date.now()
   next();
})
require('./registerWinstonStreams')(winston, [
   log=>{
      //if (log.level === 'error')
         //console.error('Streamed log:', log)
   },
   //...
])
router(app);

server = app.listen(config.port);
io = socket(server);


io.on('connection', (socket) => {

    socket.on('SEND_MESSAGE', function(data){

      rl.question(data.author+": "+data.message+"\n", (answer) => {
      socket.emit('RECEIVE_MESSAGE', answer);
    });
    })
});