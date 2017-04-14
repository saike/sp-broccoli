'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_gift.hbs');

class ViewGift extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;

        this._domEvents = {
            'click .js-btn-get': (e)=>{
                e.preventDefault();
                this.emit(ViewGift.EVENT_GET, this._tplData);
            }
        }
    }
}

ViewGift.EVENT_GET = 'view.gift.get';

module.exports = ViewGift;