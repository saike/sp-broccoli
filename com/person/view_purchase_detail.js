'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_purchase_detail.hbs');
const foreach = require('lodash.foreach');
const moment = require('moment');

class ViewPurchaseDetail extends ViewBase {
    constructor() {
        super();
        this._template = template;

        this._domEvents = {
            'click .js-popup-close': (e)=>{
                e.preventDefault();
                this.emit(ViewPurchaseDetail.EVENT_POPUP_CLOSE);
            }
        }
    }

    _prepareTplData() {
        super._prepareTplData();
        return this._tplData;
    }
}

ViewPurchaseDetail.EVENT_POPUP_CLOSE = 'view.purchase-detail.popup-close';

module.exports = ViewPurchaseDetail;