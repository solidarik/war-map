let config = require('config');
let mongoose = require('mongoose');
let User = require('../models/user');
let MapObject = require('../models/mapObject');
let socketIO = require('socket.io');

function socket(server) {

  let io = socketIO(server);

  io.on('connection', (socket) => {
    //console.log('a user connected');
    
    getDbObjects((res) => {        
        socket.emit('srvMapObjects', JSON.stringify({mapObjects: res}));
    });

    socket.on('disconnect', () => {
        //console.log('user disconnected');
    });

    socket.on('clNewMapObject', (msg) => {
        let data = JSON.parse(msg);
        let mapObject = new MapObject({kind: data.kind, coords: data.coords, uid: data.uid, country: data.country});
        mapObject.save((err) => {
            if (!err) {
                getDbObjects( (res) => {
                    socket.broadcast.emit('srvMapObjects', JSON.stringify({mapObjects: res}));
                });
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

    socket.on('clChangeFeatures', (msg) => {
        let data = JSON.parse(msg);
        if (0 == data.length) return;

        data.forEach( (mo) => {
            //MapObject.findOne({uid: data.uid}, (err, doc) => {
            //    doc.coords = data.coords;                
            //    doc.save(); 
            // });
            MapObject.update({uid: mo.uid}, mo, function(err, raw) {
                if (err) {
                  console.error("Failed update feature: " + err);
                }
                getDbOneObject( mo.uid, (res) => {
                    socket.broadcast.emit('srvMapObjects', JSON.stringify({mapObjects: res}));
                });
              });
        });
        
    });

    socket.on('clChangeObject', (msg) => {
        let data = JSON.parse(msg);
            
        MapObject.update({uid: data.uid}, data, function(err, raw) {
            if (err) {
                console.error("Failed update object: " + err);
            }
            getDbOneObject( data.uid, (res) => {
                socket.broadcast.emit('srvMapObjects', JSON.stringify({mapObjects: res}));
            });
        });        
    });
    
    socket.on('clDeleteObject', (msg) => {
        let data = JSON.parse(msg);
        
        MapObject.deleteOne({uid: data.uid}, function(err) {
            if (err) {
                console.error("Failed delete object: " + err);
                return;
            }
            socket.emit('srvDeleteObjects', JSON.stringify({uidAr: [data.uid]}));            
        });        
    });
    
  });
}

function getDbObjects(cb) {

    MapObject.find({}, (err, mapObjects) => {
        if (err) {
            console.log(err);
            return;
         }

        let mapObjectsToClient = [];
        mapObjects.forEach(mo => {
            mapObjectsToClient.push({uid: mo.uid, kind: mo.kind, coords: mo.coords, name: mo.name, country: mo.country});
        });

        cb(mapObjectsToClient);
    });
}

function getDbOneObject(uid, cb) {
    MapObject.find({uid: uid}, (err, mapObjects) => {
        if (err) {
            console.log(err);
            return;
         }

        let mapObjectsToClient = [];
        mapObjects.forEach(mo => {
            mapObjectsToClient.push({uid: mo.uid, kind: mo.kind, coords: mo.coords, name: mo.name, country: mo.country});
        });

        cb(mapObjectsToClient);
    });
}

module.exports = socket;
