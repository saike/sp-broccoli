'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_badges_new_popup.hbs');

require('../../less/img/congrat.png');

class ViewPopupBadge extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;
    }
}

module.exports = ViewPopupBadge;