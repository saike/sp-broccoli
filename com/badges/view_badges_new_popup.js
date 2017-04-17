'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_badges_new_popup.hbs');
const ViewBages = require('./view_badges');

require('../../less/img/congrat.png');

class ViewPopupBadge extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;
        this._domEvents = {
          'click .js-move-to-tasks': this._moveToTasks
        }
    }

  _moveToTasks(e) {
    console.log(e);
    e.preventDefault();
    console.log(ViewBages.EVENT_MOVE_TO_TASKS);
    this.emit(ViewBages.EVENT_MOVE_TO_TASKS);
  }
}

// ViewPopupBadge.EVENT_MOVE_TO_TASKS = 'view.badges.move-to-task';

module.exports = ViewPopupBadge;