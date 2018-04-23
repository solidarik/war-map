let config = require('config');
let mongoose = require('mongoose');
let User = require('../models/user');
let MapObject = require('../models/mapObject');
let socketIO = require('socket.io');

function socket(server) {

  let io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    MapObject.find({}, (err, mapObjects) => {
        if (err) {
            console.log(err);
            return;
        }

        let mapObjectsToClient = [];
        mapObjects.forEach(mo => {
            mapObjectsToClient.push({uid: mo.uid, kind: mo.kind, coords: mo.coords});
        });

        socket.emit('srvMapObjects', JSON.stringify({mapObjects: mapObjectsToClient}));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('clNewMapObject', (msg) => {
        let data = JSON.parse(msg);
        let mapObject = new MapObject({kind: data.type, coords: data.coords, uid: data.uid});
        mapObject.save((err) => {
            if (!err) {
                console.log("success");                
            } else {
                console.error("error: " + err);
            }
        });
    });

    socket.on('clClearDb', (msg) => {
        MapObject.remove({}, (err) => {
            if (!err)
                socket.emit('srvClearDb', 'cleared');
        });    
    });

    
  });
}

module.exports = socket;
