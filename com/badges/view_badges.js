'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_badges.hbs');

class ViewBadges extends ViewBase {
    constructor(arg) {
        super(arg);
        this._template = template;
        this._domEvents = {
            'click .js-badges-item-popup': this._showPopupBadges
        }
    }

    _prepareTplData () {
        super._prepareTplData();
        let res = 0;
        if (this._tplData.list) {
            for (let i=0, li = this._tplData.list.length;i<li;i++) {
                let item = this._tplData.list[i];
                console.log(item)                
                if (item.is_received) {
                    res++;
                }
            }

            this._tplData.list.map((item, index)=>{
                item['index'] = index+1;
                item['points'] = item.rules[0] && item.rules[0].value_to_success;
                item['pointsText'] = 'балл' + ViewBase.getNumEnding(item['points'], ['', 'а', 'ов']);
                return item;
            });

            this._tplData['count'] = res;
        }

        return this._tplData;
    }

    updateProgress () {
        if (!$('#path').length) return;

        let map = [0,-.1,-0.18,-.3, -.4, -.6, -.7, -.82, -1];

        setTimeout(()=>{
            var bar = new ProgressBar.Path('#path', {
                easing: 'easeInOut',
                duration: 3000
            });
            bar.set(0);

            bar.animate(map[this._tplData['count']]);

            window.bar = bar;
        }, 1000);
    }

    _showPopupBadges(e) {
        e.preventDefault();
        var i = $(e.target).closest('.js-badges-item-popup').data('index');
        this.emit(ViewBadges.EVENT_POPUP_BADGES, this._tplData.list[i]);
    }
}

ViewBadges.EVENT_POPUP_BADGES = 'view.badges.popup-badges';
ViewBadges.EVENT_MOVE_TO_TASKS = 'view.badges.move-to-task';


module.exports = ViewBadges;