const Events = require('events');

class Controller extends Events {
    constructor (app) {
        super();
        this._App = app;
        this._ViewBase = null;
    }

    getEl () {
        return this._ViewBase.render().getEl();
    }

    getBaseView () {
        return this._ViewBase;
    }

    start () {}
}

Controller.EVENT_COM_START = 'ctrl.start';

module.exports = Controller;