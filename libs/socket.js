let config = require('config');
let mongoose = require('mongoose');
let User = require('../models/user');
let Feature = require('../models/feature');
let socketIO = require('socket.io');

function socket(server) {

  let io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    Feature.find({}, (err, features) => {
        if (err) {
            console.log(err);
            return;
        }

        let ftToCl = [];
        features.forEach(ft => {
            ftToCl.push({kind: ft.kind, coords: ft.coords});
        });

        socket.emit('srvFeatures', JSON.stringify({features: ftToCl}));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('clAddFeature', (msg) => {
        let ft = JSON.parse(msg);
        console.log('feature: ' + JSON.parse(msg));
        let feature = new Feature({kind: ft.type, coords: ft.coords});
        feature.save((err) => {
            if (!err) {
                console.log("success");
                console.log(JSON.stringify(feature));
            } else {
                console.error("error: " + err);
            }
        });
    });

    socket.on('clClearDb', (msg) => {
        Feature.remove({}, (err) => {
            if (!err)
                socket.emit('srvClearDb', 'cleared');
        });    
    });

    
  });
}

module.exports = socket;
