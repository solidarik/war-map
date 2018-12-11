class ClientProtocol {
    constructor() {
        let socket = io();

        this.lang = 'rus';
        this.dict = new Map(); //key - hash (tobject), value {объект}
        socket.emit('clGetDictEngRus', '', (msg) => {
            let data = JSON.parse(msg);
            data.res.forEach( (item) => {
                let obj = {eng: item.eng, rus: item.rus};
                this.dict.set(item.id, obj);
            });
        });


        socket.on('error', function(message) {
            console.error(message);
        });

        socket.on('logout', function(data) {
            socket.disconnect();
            window.location.reload();
        });

        this.socket = socket;
    }

    getSocket() {
        return this.socket;
    }

    setCurrentLanguage(lang) {
        this.lang = lang;
    }

    getDictName(id) {
        if (!this.dict.has(id)) return;
        let obj = this.dict.get(id);
        if (!obj) return;
        return obj[this.lang];
    }

    static create() {
        return new ClientProtocol();
    }
}