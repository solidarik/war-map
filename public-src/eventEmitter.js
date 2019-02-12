export class EventEmitter {
    constructor() {
        this.emitEvents = {};
    }

    subscribe( eventName, fn, context = null) {
        if( !this.emitEvents[eventName] ) {
            this.emitEvents[eventName] = {};
            this.emitEvents[eventName].functions = [];
            this.emitEvents[eventName].contexts = [];
        }

        this.emitEvents[eventName].functions.push(fn);
        this.emitEvents[eventName].contexts.push(context);

        return () => {
            this.emitEvents[eventName] = this.emitEvents[eventName].filter(event => fn !== event.functions);
        }
    }

    emit(eventName, data) {
        const event = this.emitEvents[eventName];
        if (event) {
            for(let i = 0; i < event.functions.length; i++) {
                let fn = event.functions[i];
                let ctx = event.contexts[i] ? event.contexts[i] : null;
                fn.call(ctx, data);
            };
        }
    }
}