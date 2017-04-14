const View = require('./view_popup');
const Ctrl = require('../base/controller');
let Instance = null;

class Popup extends Ctrl {
    constructor(){
        super();
        if (Instance != null) {
            return Instance;
        }
        this._ViewBase = new View();
        this._ViewBase.on(View.EVENT_CLOSE, ()=>{this.emit(Popup.EVENT_CLOSE)});
        this._ViewBase.on(View.EVENT_OPEN, ()=>{this.emit(Popup.EVENT_OPEN)});
        Instance = this;
    }

    setContent(View) {
        if (!View.isRendered()) {
            View.render();
        }
        this._ViewBase.setContent(View);
        return this;
    }

    setTitle(title) {
        this._ViewBase.setTitle(title);
        return this;
    }

    show(opt) {
        if (this._ViewBase) {
            this._ViewBase.show(opt);
        }
        return this;
    }

    close() {
        if (this._ViewBase) {
            this._ViewBase.close();
        }
        return this;
    }
}

Popup.EVENT_CLOSE = 'ctrl.popup.close';
Popup.EVENT_OPEN = 'ctrl.popup.open';

module.exports = Popup;