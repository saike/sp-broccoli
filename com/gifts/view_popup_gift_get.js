'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_popup_gift_get.hbs');

require('./style.less');

class ViewPopupGiftBuy extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;

        this._domEvents = {
            'click .js-confirm': (e) => {
                e.preventDefault();
                this.emit(ViewPopupGiftBuy.EVENT_BUY_CONFIRM, this._tplData);
            },
            'click .js-popup-close': (e) => {
                e.preventDefault();
                this.emit(ViewPopupGiftBuy.EVENT_POPUP_CLOSE);
            },
            'click .js-prevent': (e) => {
                e.preventDefault();
            }
        };
    }

    showSuccessMess () {
        this.getEl().classList.add(ViewPopupGiftBuy.CLASS_STEP_ACTIVE_2);
    }

}

ViewPopupGiftBuy.EVENT_BUY_CONFIRM = 'view.popup-gift-get.get-confirm';
ViewPopupGiftBuy.EVENT_POPUP_CLOSE = 'view.popup-gift-get.popup-close';

ViewPopupGiftBuy.CLASS_STEP_ACTIVE_2 = 'step-active-2';

module.exports = ViewPopupGiftBuy;