class MapObject {
    constructor(uid, coords, kind) {
        this.uid = uid;
        this.coords = coords;
        this.kind = kind;
    }

    static create(uid, coords, kind) {
        return new MapObject(uid, coords, kind);
    }

    assign(obj) {
        this.uid = obj.uid;
        this.coords = obj.coords;
        this.kind = obj.kind;
    }

    equals(obj) {
        return (this.coords.equals(obj.coords) && this.kind == obj.kind);
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

        socket.on("srvMapObjects", (data) => {                    
            let json = JSON.parse(data);
            this._renewObjects(json.mapObjects);
            // json.mapObjects.forEach( (mo) => {                        
            //     this.objects.push( new MapObject(mo.uid, mo.coords, mo.kind) );
            // });
            //cb(json);            
        }, this);

        this.socket = socket;
        this.objects = [];
        this.addObjectFn = undefined;
        this.changeObjectFn = undefined;
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
        }        
    }

    addFeature(mo) {
        let msg = JSON.stringify(mo);
        this.objects.push( new MapObject(mo.uid, mo.coords, mo.kind) );                
        this.socket.emit('clNewMapObject', msg);
    }

    changeFeatures(moArray) {
        let changes = this._getChanges(moArray);
        console.log("mapInfo -> changeFeature -> changes " + changes); 
        
        this._renewObjects(changes);

        let msg = JSON.stringify(changes);
        this.socket.emit('clChangeFeatures', msg);
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
        moArray.forEach((newest) => {   
            let older = this._getObjectByUid(newest.uid);
            if (older && !newest.coords.equals(older.coords))
                    onlyChanges.push( newest );                
            }                     
        );
        return onlyChanges;
    }

    _renewObjects(changes) {
        for(let i = 0; i < changes.length; i++) {
            let ch = changes[i];
            let obj = this._getObjectByUid(ch.uid);
            if (!obj) {
                this.objects.push(new MapObject(ch.uid, ch.coords, ch.kind));
                this.addObjectFn(ch);
            } else {
                if (!obj.equals(ch)) {
                    obj.assign(ch);
                    this.changeObjectFn(obj);
                }
            }
        };
    }

    clearDb() {
        this.socket.emit('clClearDb', 'clear');
    }
}