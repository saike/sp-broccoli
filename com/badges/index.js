const Ctrl = require('../base/controller');
const ViewBadges = require('./view_badges');
const ModelBadges = require('./model_badges');
const ViewPopupBadges = require('./view_badges_popup');
const ViewPopupBadgesNew = require('./view_badges_new_popup');
const ViewBase = require('../../com/base/view');
const Popup = require('../popup');

class Badges extends Ctrl {
    constructor(app) {
        super();

        this._ModelBadges = new ModelBadges();
        this._ModelBadges.on(ModelBadges.EVENT_FETCH, ()=>{
            this.emit(Badges.EVENT_FETCH);
            this._ViewBadges.updateProgress();
        });

        this._ViewBadges = new ViewBadges({
            model: this._ModelBadges
        });

        this._ViewBadges.enableBinding();
        this._ViewBase = this._ViewBadges;

        this._ViewBadges.on(ViewBadges.EVENT_POPUP_BADGES, (data)=>{
            this.showPopupBadges(data);
        });

        this._ViewPopupBadges = new ViewPopupBadges({
            model: this._ModelBadges
        });

        this._Popup = new Popup();

        this.on(ViewBase.EVENT_MOUNT, this._ViewBase.updateProgress.bind(this._ViewBase));
        this._ViewPopupBadges.on(ViewPopupBadges.EVENT_MOVE_TO_TASKS, ()=>{
            this._Popup.close();
            let $el = $('a[href="#qust"]');
            $el.click();
            setTimeout(()=>{
                $('html, body').animate({
                    scrollTop: $el.offset().top
                }, 2000);
            }, 500);
        });
    }

    showPopupBadges(data) {
        if (!data.is_received) return;
        let PView = this._ViewPopupBadges;

        if (data.index == 1) {
            PView = new ViewPopupBadgesNew();
        }

        PView
            .setData(data)
            .render();

        this._Popup.setContent(PView);
        this._Popup.show();
    }

    start() {
        this._ModelBadges.fetch();
    }

    getBadges() {
        return this._ModelBadges.get('list');
    }
}

Badges.EVENT_FETCH = 'ctrl.badges.fetch';

module.exports = Badges;