'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_task.hbs');

class ViewTask extends ViewBase {
    constructor(){
        super();
        this._template = template;
        this._domEvents = {
            'click .js-run-task': (e)=>{
                e.preventDefault();
                this.emit(ViewTask.EVENT_RUN_TASK, this._tplData);
            },
            'click .bns_more_point_item': (e)=>{
                e.preventDefault();
                e.currentTarget.classList.toggle('act');
            }
        };
    }
}
ViewTask.EVENT_RUN_TASK = 'view.task.run';

module.exports = ViewTask;