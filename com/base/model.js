'use stict';

/**
 * Dependencies
 */
const Events = require('events');
const isString = require('lodash.isstring');
const isObject = require('lodash.isobject');
const foreach = require('lodash.foreach');
const isequal = require('lodash.isequal');

class Model extends Events {

    constructor(attr, options) {
        super();
        options = Object.assign({}, options);
        this.name = null;
        this._ATTRIBUTE_ID ='id';
        this._id = null;
        this._attributes = this._defaults();
        this.set(attr || {}, options || {});
    }

    _setId(attrName, value, options) {
        if (attrName == this._ATTRIBUTE_ID) {
            if (this.getId() !== null && !options.idOverwrite) {
                return false;
            }
            this._id = value;
        }
    }

    getId() {
        return this._id;
    }

    set(attr, val, options) {
        var eventType, prev;

        if (isObject(attr)) {
            options = Object.assign({}, val);

            if (options.parse) {
                attr = this._parse(attr);
            }

            foreach(attr, (curval, key) => {
                this.set(key, curval, options);
            }, this);

        } else if (isString(attr)) {
            options = Object.assign({}, options);
            eventType = Model.EVENT_CHANGE;

            if (this.exists(attr)) {
                prev = this.get(attr);
            } else {
                prev = null;
                eventType = Model.EVENT_ADD;
            }

            this._setId(attr, val, options);
            if (!options.updateEmpty && (!val)) {
                return false;
            }
            this._attributes[attr] = val;

            if (!options.silent) {
                if (isObject(prev) && isObject(val)) {
                    if (isequal(prev, val)) {
                        return true;
                    }
                } else {
                    if (prev == val) {
                        return true;
                    }
                }
                    this.emit(
                        eventType,
                        {
                            key: attr,
                            prev: prev,
                            new: val
                        }
                    );
                }
            }
        return this;
    }

    clear() {
        this._attributes = {};
        this._id = null;
        this.emit(Model.EVENT_CLEAR);
        return this;
    }

    get(attr) {
        if (attr) {
            return this._attributes[attr];
        }
        return this._attributes;
    }

    exists(attr) {
        return this._attributes.hasOwnProperty(attr);
    }

    unset(name, options) {
        var t = {},
            prev = this.get(name);

        options = options || {};
        this.foreach(function(val, key) {
            if (key != name) {
                t[key] = val;
            }
        });
        this._attributes = t;

        if (!options.silent) {
            this.emit(Model.EVENT_UNSET, {
                key: name,
                prev: prev,
                new: null
            });
        }
        return this;
    }

    _parse(resp) {
        return resp;
    }

    _defaults() {
        return {};
    }

    foreach(fn) {
        foreach(this._attributes, fn.bind(this));
    }

    toJSON() {
        return JSON.stringify(this._attributes);
    }
};

Model.EVENT_ADD = 'model.add';
Model.EVENT_CHANGE = 'model.change';
Model.EVENT_UNSET = 'model.unset';
Model.EVENT_CLEAR = 'model.clear';
Model.EVENT_FETCH = 'model.fetch';

module.exports = Model;