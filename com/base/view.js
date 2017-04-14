'use strict';


/**
 * Dependencies
 */
const Events = require('events');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const foreach = require('lodash.foreach');
const dom = require('dom-easy');
const Model = require('../base/model');

class View extends Events {

    constructor(options) {
        super();
        options = Object.assign({}, options);
        this._el = null;
        this._domEvents = null;
        this._delegatedFunc = [];
        this._enable = true;
        this._tplData = options.data || {};
        this._template = null;
        this._html = null;
        this._rendered = false;
        if (options.model) {
            this._tplModel = options.model;
        }
    }

    enable() {
        this._enable = true;
        this.emit(View.EVENT_ENABLE, this);
    }

    disable() {
        this._enable = false;
        this.emit(View.EVENT_DISABLE, this);
    }

    _listenerSelector(func, selector, e) {
        if (e.target.matches(selector) || dom(e.target).parent(selector)) {
            if (this._enable) {
                func.call(this, e);
            }
        }
    }

    _listener(func, e) {
        if (this._enable) {
            func.call(this, e);
        }
    }

    // Object event,
    // key - EventName|capturing[true|false] selector[id|class|tag|document|window]
    // value - functionName or anonim function

    _delegateEvents() {
        foreach(this._domEvents, (func, eventSelector)=>{
            var match = eventSelector.match(/^([^\s|]+)[|]?([^|\s]*)?\s*(.*)$/),
                eventName = match[1],
                capturing = (match[2] === 'true') ? true : false,
                selector = match[3],
                listener, el;

            func = typeof func == 'function' ? func : this[func];

            if (!selector || selector == 'document' || selector == 'window') {
                listener = this._listener.bind(this, func);
            } else {
                listener = this._listenerSelector.bind(this, func, selector);
            }

            if (selector == 'document') {
                document.addEventListener(eventName, listener, capturing);
                el = document;
            } else if (selector == 'window') {
                window.addEventListener(eventName, listener, capturing);
                el = window;
            } else {
                this._el.addEventListener(eventName, listener, capturing);
                el = this._el;
            }

            this._delegatedFunc.push({eventName: eventName, func: listener, el: el});

        });
    }

    _unDelegateEvents() {
        foreach(this._delegatedFunc, function (obj) {
            obj.el.removeEventListener(obj.eventName, obj.func);
        });
        this._delegatedFunc = [];
        this._delegatedFunc.length = 0;
    }

    getEl() {
        return this._el;
    }

    _setEl() {
        var tmpDiv = document.createElement('DIV'),
            newEL;

        this._unDelegateEvents();
        tmpDiv.innerHTML = this._html;
        if (tmpDiv.children.length > 1) {
            newEL = tmpDiv;
        } else {
            newEL = tmpDiv.children[0];
        }
        if (this._el === null) {
            this._el = newEL;
        } else {
            if (this._el.parentNode !== null) {
                this._el.parentNode.replaceChild(newEL, this._el);
            }
            this._el = newEL;
        }
        this._delegateEvents();
    }

    getHtml() {
        return this._html;
    }

    getTemplate() {
        return this._template;
    }

    detach(options) {
        options = Object.assign({}, options);
        if (this._el.parentNode) {
            this._unDelegateEvents();
            this._el.parentNode.removeChild(this._el);
            if (!options.silent) {
                this.emit(View.EVENT_DETACH, this);
            }
        } else {
            throw new Error('can`t detach element');
        }
        return this;
    }

    render(options) {
        options = Object.assign({}, options);
        this._html = this._template(this._prepareTplData());
        this._rendered = true;
        if (!options.noEl) {
            this._setEl();
        }

        if (!options.silent) {
            this.emit(View.EVENT_RENDER, this);
        }

        return this;
    }

    isRendered() {
        return this._rendered;
    }

    _prepareTplData() {
        if (this._tplModel) {
            this._tplData = Object.assign({},this._tplData, this._tplModel.get());
        }

        return this._tplData;
    }

    enableBinding() {
        if (this._tplModel) {
            this._tplModel.on(Model.EVENT_CHANGE, this.render.bind(this));
        }
    }

    setData(data) {
        this._tplData = data;
        return this;
    }
}
View.EVENT_ENABLE = 'view.enable';
View.EVENT_DISABLE = 'view.disable';
View.EVENT_READY = 'view.ready';
View.EVENT_RENDER = 'view.render';
View.EVENT_DETACH = 'view.detach';
View.EVENT_MOUNT = 'view.mount';

View.getNumEnding = function(iNumber, aEndings)
{
    var sEnding, i;
    var iNumber = iNumber % 100;
    if (iNumber>=11 && iNumber<=19) {
        sEnding=aEndings[2];
    }
    else {
        i = iNumber % 10;
        switch (i)
        {
            case (1): sEnding = aEndings[0]; break;
            case (2):
            case (3):
            case (4): sEnding = aEndings[1]; break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}

module.exports = View;
