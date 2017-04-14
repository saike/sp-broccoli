'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_poll.hbs');

class ViewFrame extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;
    }
}

module.exports = ViewFrame;