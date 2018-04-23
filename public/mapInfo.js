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

        this.socket = socket;
    }

    static create() {
        return new MapInfo();
    }

    on(event, cb) {
        switch(event) {
            case("getObjectsFromServer"): 
                this.socket.on("srvMapObjects", (data) => {                    
                    let json = JSON.parse(data);
                    cb(json);            
                });
            break;
            case("clearDb"):
                this.socket.on("srvClearDb", (data) => {                    
                    cb();
                });   
            break;             
        }        
    }

    addFeature(ft) {
        //if (!app.addFeatureEnabled) return; //TODO
        this.socket.emit('clNewMapObject', JSON.stringify(this._createMapObject(ft)));
    }

    clearDb() {
        this.socket.emit('clClearDb', 'clear');
    }

    _createMapObject(ft) {
        let json = {
            "type": ft.getGeometry().getType(),            
            "coords": ft.getGeometry().getCoordinates(),
            "uid": this._createUid()
        };

        console.log(JSON.stringify(json));
        return json;
    }

    _createUid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    
    _getJsonOfVectorObjects() {
        let json = {};
        if (!app.vectorSource) return json;
    
        let features = [];
        app.vectorSource.getFeatures().forEach(feature => {
            features.push(featureToJson(feature));
        });
    
        app.vectorLayer.getFeatures().on()
    
        json = {"features": features};
        return json;
    }
}