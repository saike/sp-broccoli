'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_summary.hbs');

require('../../less/img/line_gift.png');
require('../../less/img/open.png');
require('../../less/img/gal.png');
require('../../less/img/tt_arr.png');

class ViewSummary extends ViewBase {
    constructor(arg) {
        super(arg);
        this._template = template;

        this._domEvents = {
            'click .js-open-hist': (e) => {
                e.preventDefault();
                this.emit(ViewSummary.EVENT_OPEN_HISTORY);
            },
            'click .js-move-to-tasks': (e)=>{
                e.preventDefault();
                let $el = $('a[href="#qust"]');
                if ($el.length) {
                    $el.click();
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    }, 2000);
                } else {
                    window.location.href = 'tasks.html';
                }
            }
        };
    }
}
ViewSummary.EVENT_OPEN_HISTORY = 'view.view-summary.open-hist';

module.exports = ViewSummary;