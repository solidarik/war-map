let config = require('config');
let mongoose = require('mongoose');
let User = require('../models/usersModel');
let MapObject = require('../models/mapObjectsModel');
let socketIO = require('socket.io');

function serverSocket(server, protocolFunctions) {

  let io = socketIO(server);

  io.on('connection', (socket) => {

    protocolFunctions.forEach( (map) => {
        map.forEach((name, func, _) => {
            socket.on(name, (data, fn) => func(socket, data, fn));
        });
    });

    getDbObjects((res) => {
        socket.emit('srvMapObjects', JSON.stringify({mapObjects: res}));
    });

    socket.on('disconnect', () => {
        //console.log('user disconnected');
    });

    socket.on('clNewMapObject', (msg) => {
        let data = JSON.parse(msg);
        let mapObject = new MapObject({
            kind: data.kind,
            coords: data.coords,
            uid: data.uid,
            country: data.country,
            headerStr: data.headerStr,
            headerArr: data.headerArr,
            data: data.data
        });
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
        console.log(msg);

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

  return io;
}

function getDbObjects(cb) {

    MapObject.find({}, (err, mapObjects) => {
        if (err) {
            console.log(err);
            return;
         }

        sendToClient(mapObjects, cb);
    });
}

function getDbOneObject(uid, cb) {
    MapObject.find({uid: uid}, (err, mapObjects) => {
        if (err) {
            console.log(err);
            return;
         }

        sendToClient(mapObjects, cb);
    });
}

function sendToClient(mapObjects, cb) {
    let mapObjectsToClient = [];
    mapObjects.forEach(mo => {
        mapObjectsToClient.push({
            uid: mo.uid,
            kind: mo.kind,
            coords: mo.coords,
            name: mo.name,
            country: mo.country,
            headerStr: mo.headerStr,
            headerArr: mo.headerArr,
            data: mo.data,
        });
    });

    cb(mapObjectsToClient);
}

module.exports = serverSocket;
