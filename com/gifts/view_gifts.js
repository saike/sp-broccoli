'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_gifts.hbs');
const foreach = require('lodash.foreach');
const ViewGift = require('./view_gift');
const Popup = require('../popup');

require('../../less/img/l_arr.png');
require('../../less/img/l_arr_h.png');
require('../../less/img/r_arr.png');
require('../../less/img/r_arr_h.png');

class ViewGifts extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;

        this.on(ViewBase.EVENT_RENDER, ()=>{
            this._elCont = this.getEl().querySelector('.js-gifts-cont');
            this.renderGifts();
        });

        this._domEvents = {
            'click .js-show-more': (e)=>{
                e.preventDefault();
                this.getEl().classList.toggle(ViewGifts.CLASS_SHOW);
            }
        };
    }

    renderGifts () {
        let list = this._tplData['list'],
            perSlide = 6,
            slidesCount = Math.ceil(list.length/perSlide, 10),
            slides = [];

        if (!list.length) {return;}

        if (!list.length) {
            let $el = $(this.getEl());
            $el.html('<div class="tab-empty">Нет доступных подарков</div>');
            $el.find('a').hide();
            return false;
        }

        for (let i=0;i<slidesCount;i++) {
            let $el = $('<div class="bns_tab_gift_slide"></div>');
            slides.push($el);
            this._elCont.appendChild($el.get(0));
        }

        foreach(list, (item, index)=>{
            let View = new ViewGift();
            item['disable'] = false;
            item['needPoints'] = 0;
            item['pic_full'] = item.pic_full || item.thumbs.url_250x250;
            let points = Math.abs(this._tplData['points'] - item['points'])
            if (isNaN(points) || points <= 0) {
                
                item['disable'] = true;
                item['needPoints'] = points;
                item['needPointsText'] = 'балл' + ViewBase.getNumEnding(this._tplData['points'], ['', 'а', 'ов']);
            }

            item['pointsText'] = 'балл' + ViewBase.getNumEnding(this._tplData['points'], ['', 'а', 'ов']);
            View.setData(item);
            View.on(ViewGift.EVENT_GET, (data)=>{this.emit(ViewGifts.EVENT_GET, data)});

            slides[Math.floor(index/perSlide, 10)].append(View.render().getEl());
        });

        this.enable();

    }

    enable () {
        $(this.getEl()).find('.js-gifts-cont').cycle();
    }
}

ViewGifts.EVENT_GET = 'view.gifts.get';
ViewGifts.CLASS_SHOW = 'show-view-more';

module.exports = ViewGifts;