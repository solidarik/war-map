export default class ServerProtocol {
    constructor() {
        let protocol = new Map();
        this.protocol = protocol;
    }

    getProtocol(app) {
        return this.protocol;
    }

    addHandler(name, func) {
        this.protocol.set(func, name);
    }
}