class MapObject {
    constructor(uid, coords, kind, name, country) {
        this.uid = uid;
        this.coords = coords;
        this.kind = kind;
        this.name = name;
        this.country = country;
    }

    static create(uid, coords, kind, name, country) {
        return new MapObject(uid, coords, kind, name, country);
    }

    assign(obj) {
        this.uid = obj.uid;
        this.coords = obj.coords;
        this.kind = obj.kind;
        this.name = obj.name;
        this.country = obj.country;
    }

    equals(obj) {
        return (this.coords.equals(obj.coords) && this.kind == obj.kind && this.name == obj.name && this.country == obj.country);
    }
}

class MapInfo {
    constructor() {
        let socket = io();

        socket.on('error', function(message) {
            console.error(message);            
        });

        socket.on('logout', function(data) {
            socket.disconnect();
            window.location.reload();
        });         

        socket.on('srvMapObjects', (data) => {                    
            let json = JSON.parse(data);
            this._renewObjects(json.mapObjects, 'fromServer');
            // json.mapObjects.forEach( (mo) => {                        
            //     this.objects.push( new MapObject(mo.uid, mo.coords, mo.kind) );
            // });
            //cb(json);            
        }, this);

        socket.on('srvDeleteObject', (data) => {
            let json = JSON.parse(data);
            data.forEach( (uid) => {
                //todo MapObject.
            });
        });

        this.socket = socket;
        this.objects = [];
        this.addObjectFn = () => {};
        this.changeObjectFn = () => {};
        this.getKindTroopsFn = () => {};
    }

    static create() {
        return new MapInfo();
    }

    on(event, cb) {        
        switch(event) {
            /*case("getObjectsFromServer"): 
                this.socket.on("srvMapObjects", (data) => {                    
                    let json = JSON.parse(data);
                    this._renewObjects(json);
                    // json.mapObjects.forEach( (mo) => {                        
                    //     this.objects.push( new MapObject(mo.uid, mo.coords, mo.kind) );
                    // });
                    //cb(json);            
                }, this);
            break;*/
            case("clearDb"):
                this.socket.on("srvClearDb", (data) => {                    
                    cb();
                });   
            break;
            case("addObject"):
                this.addObjectFn = cb;
            break;     
            case("changeObject"):
                this.changeObjectFn = cb;
            break;
            case("getKindTroops"):
                this.getKindTroopsFn = cb;
            break;
        }        
    }

    addFeature(mo) {
        let msg = JSON.stringify(mo);
        this.objects.push( new MapObject(mo.uid, mo.coords, mo.kind, mo.country) );                
        this.socket.emit('clNewMapObject', msg);        
    }

    changeFeatures(moArray) {
        let changes = this._getChanges(moArray);
        console.log("mapInfo -> changeFeature -> changes " + changes); 
        
        this._renewObjects(changes, 'fromClient');

        let msg = JSON.stringify(changes);
        this.socket.emit('clChangeFeatures', msg);
    }

    changeObjectFromClient(obj) {        
        let objPos = this.getObjectPosition(obj.uid);
        this.objects[objPos].name = obj.name;
        this.objects[objPos].country = obj.country;

        this.changeObjectFn(this.objects[objPos]);

        let msg = JSON.stringify(this.objects[objPos]);
        this.socket.emit('clChangeObject', msg);
        
    }

    deleteFromClient(obj) {
        let objPos = this.getObjectPosition(obj.uid);
        if (!objPos) return;

        let msg = JSON.stringify(this.objects[objPos]);
        this.socket.emit('clDeleteObject', msg);
    }

    getCount() {
        return this.objects.length;
    }

    getObjectPosition(uid) {
        for (let i = 0; i < this.objects.length; i++) {
            let obj = this.objects[i];            
            if (uid == obj.uid) return i;
        }
        return undefined;
    }

    getFirstObject() {
        if (0 == this.objects.length) {
            return undefined;
        }

        return this.objects[0];
    }

    getPrevObject(uid) {
        var res = -1;
        for (let i = 0; i < this.objects.length; i++) {
            let obj = this.objects[i];            
            if (uid == obj.uid) {
                res = i - 1;                
                return (0 > res) ? this.getFirstObject() : this.objects[res];
            }
        }
        return undefined;
    }

    getNextObject(uid) {
        var res = -1;
        for (let i = 0; i < this.objects.length; i++) {
            let obj = this.objects[i];            
            if (uid == obj.uid) {
                res = i + 1;                
                return (res == this.objects.length) ? this.objects[res - 1]: this.objects[res];
            }
        }
        return undefined;
    }
    
    _getObjectByUid(uid) {
        for (let i = 0; i < this.objects.length; i++) {
            let obj = this.objects[i];            
            if (uid == obj.uid) return obj;                        
        }
        return null;
    }

    _getChanges(moArray) {
        let onlyChanges = [];        
        for (let i = 0; i < moArray.length; i++) {
            let newest = moArray[i];   
            let older = this._getObjectByUid(newest.uid);
            if (older) {
                if (!newest.coords.equals(older.coords))
                    onlyChanges.push( newest );                
            } else {
                onlyChanges.push( newest );
            }
        };
        return onlyChanges;
    }

    _renewObjects(changes, fromServer) {
        let toAddObjects = [];
        for(let i = 0; i < changes.length; i++) {
            let ch = changes[i];
            let obj = this._getObjectByUid(ch.uid);
            if (!obj) {
                this.objects.push(new MapObject(ch.uid, ch.coords, ch.kind, ch.name, ch.country));
                toAddObjects.push(ch);                
            } else {
                if (!obj.equals(ch)) {
                    obj.assign(ch);
                    if (fromServer == 'fromServer')
                        this.changeObjectFn(obj);
                }
            }
        };
        this.addObjectFn(toAddObjects);
    }

    clearDb() {
        this.socket.emit('clClearDb', 'clear');
    }
}