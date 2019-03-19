import {EventEmitter} from './eventEmitter'
import jquery from 'jquery'

export class HistoryEventsControl extends EventEmitter {
    constructor() {
        super();

        this.listDiv = jquery("#event-list")[0];
        this.imgDiv = jquery("#event-image-div")[0];
        this.events = [];
        this.active_event = '';
        this.active_map = '';
    }

    static create() {
        return new HistoryEventsControl();
    }

    _getHtmlForEvent(event, is_active) {
        let html = '<tr data-href="' + event.id + '" class="hand-cursor' + (is_active ? ' event-active-row' : '') + '">';
        html += '<td>' + event.startDate + '</td>';
        html += '<td>' + event.endDate + '</td>';

        let name = event.name;
        if (1 < event.maps.length) {
            let delim = '&nbsp';
            for (let i = 0; i < event.maps.length; i++) {
                name += delim + '<span class="event-feature-color" data-href="' + i + '">' + (i + 1) + '</span>';
            }
        }

        html += '<td>' + name + '</td>';
        html += '</tr>';
        return html;
    }

    _resizeImage(url, fixWidth, callback) {
        var sourceImage = new Image();

        sourceImage.onload = function() {
            // Create a canvas with the desired dimensions
            var canvas = document.createElement("canvas");

            let imgWidth = this.width;
            let aspectRatio = Math.round(imgWidth / fixWidth);

            let imgHeight = this.height;
            let fixHeight = Math.round( imgHeight / aspectRatio );

            canvas.width = fixWidth;
            canvas.height = fixHeight;

            // Scale and draw the source image to the canvas
            let ctx = canvas.getContext("2d");
            ctx.globalAlpha = 0.6;
            ctx.drawImage(sourceImage, 0, 0, fixWidth, fixHeight);

            // Convert the canvas to a data URL in PNG format
            if (callback)
                callback(canvas);
        }

        return sourceImage.src = url;
    }

    _refreshEventImage(event) {
        this.imgDiv.innerHTML = '';
        if (!event.imgUrl)
            return;

        this._resizeImage(event.imgUrl, 300, (canvas) => {
            this.imgDiv.appendChild(canvas);
        });
    }

    setActiveEvent(event, map) {
        if ((event == this.active_event) && (event.maps[map] == this.active_map))
            return;

        if (event != this.active_event) {
            //soli disable minimap this._refreshEventImage(event);
        }

        this.active_event = event;
        this.active_map = event.maps[map];
        this.emit('activatedEvent', {event: this.active_event, map: this.active_map});
    }

    rowEventClick(tr, isMapEventClick = false) {
        let id = tr.attr('data-href');
        if (!id)
            return;

        tr.addClass('event-active-row').siblings().removeClass('event-active-row');
        let activeEvent = this.events.filter(event => event.id == id)[0];
        if (!isMapEventClick) {
            this.active_map = 0;
            jquery('table tr td span').removeClass('event-feature-active-color');
            if (1 < activeEvent.maps.length) {
                let firstSpan = jquery(tr[0].childNodes[2]).children('span:first');
                firstSpan.addClass('event-feature-active-color');
            }
        }
        this.setActiveEvent(activeEvent, this.active_map);
    }

    mapEventClick(a) {
        this.active_map = a.attr('data-href');

        jquery('table tr td span').removeClass('event-feature-active-color');
        a.addClass('event-feature-active-color');
        let tr = a.parent().parent();
        this.rowEventClick(tr, true);
    }

    showEvents(events) {

        this.active_map = 0;
        this.listDiv.innerHTML = '';
        this.events = events;

        if ((!events) || (0 == events.length))
            return;

        let html = `
        <table class="table table-sm table-borderless">
        <thead>
            <tr>
                <th scope="col">Начало</th>
                <th scope="col">Окончание</th>
                <th scope="col">Название cобытия</th>
            </tr>
        </thead>
        <tbody>
        `;

        let once = true;
        events.forEach( event => { html += this._getHtmlForEvent(event, once); once = false });

        html += '</tbody></table>';

        this.listDiv.innerHTML = html;

        this.emit('refreshedEventList');

        this.setActiveEvent(events[0], this.active_map);
    }
}