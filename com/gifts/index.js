const Ctrl = require('../base/controller');
const ViewGifts = require('./view_gifts');
const ModelGifts = require('./model_gifts');
const foreach = require('lodash.foreach');
const ViewPopupGetGift = require('./view_popup_gift_get');
const Popup = require('../popup');

class Gifts extends Ctrl {
    constructor(app) {
        super(app);
        this._ModelGifts = new ModelGifts();
        this._ViewBase = new ViewGifts({
            model: this._ModelGifts
        });
        this._ViewBase.enableBinding();
        this._ModelGifts.on(ModelGifts.EVENT_FETCH, ()=>{
            this.emit(Gifts.EVENT_FETCH);
        });

        this._ViewBase.on(ViewGifts.EVENT_GET, this._showPopupGetGift.bind(this));
    }

     start() {
         this._ModelGifts.set({
             points: this._App.getComponent('Person').getPoints()
         });

         this._ModelGifts.fetch();
    }

    _buyGift(data) {
        this._ModelGifts.on(ModelGifts.EVENT_PURCHASE, (resp)=>{
            this.emit(Gifts.EVENT_BUY, data, resp);
        });
        this._ModelGifts.purchase(data);
    }

    _showPopupGetGift (data) {
        let VPopup = new ViewPopupGetGift(),
            Pop = new Popup();

        VPopup
            .on(ViewPopupGetGift.EVENT_POPUP_CLOSE, ()=>{Pop.close()})
            .on(ViewPopupGetGift.EVENT_BUY_CONFIRM, (data)=>{
                this._ModelGifts.on(ModelGifts.EVENT_PURCHASE, (resp)=>{
                    Pop.setTitle('Получение подарка');
                    this.emit(Gifts.EVENT_BUY);
                    VPopup.showSuccessMess();
                });
                this._ModelGifts.purchase(data);
            })
            .setData(data)
            .render();

        Pop
            .setContent(VPopup)
            .setTitle('Давайте посмотрим на ваш будущий подарок')
            .show();
    }

    _filterAvail(item) {
        if (item.points > this._ModelGifts.get('points')) {
            return false;
        }
        return true;
    }

    getAvailableGifts() {
        return this._ModelGifts.get('list').filter(this._filterAvail.bind(this)).length;
    }

    getProgress () {
        let list = this._ModelGifts.get('list').filter(this._filterAvail.bind(this));

        if (!list.length) {
            return;
        }

        let def = 0;

        let giftsPoints =
            this
                ._ModelGifts
                .get('list')
                .reduce((sum, current)=>{
            return sum + current.points;
        }, def);

        let progress =  this._App.getComponent('Person').getPoints() / giftsPoints * 100;
        
        progress = progress > 100 ? 100 : progress;

        return progress;
    }
}

Gifts.EVENT_BUY = 'ctrl.gifts.buy';
Gifts.EVENT_FETCH = 'ctrl.gifts.fetch';

module.exports = Gifts;