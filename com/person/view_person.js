'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_person.hbs');
const moment = require('moment');

class ViewPerson extends ViewBase {
    constructor(opt){
        super(opt);
        this._template = template;
        this._domEvents = {
            'click .js-open-popup-history': this._openHistory,
            'click .js-open-popup-edit': this._openEditPerson,
            'click .js-detail': this._openPurchaseDetail
        }
    }

    _openHistory(e){
        e.preventDefault();
        this.emit(ViewPerson.EVENT_PERSON_HISTORY);
    }

    _prepareTplData() {
        super._prepareTplData();

        moment.locale('ru');

        let purchases = this._tplData['history'].filter(function (item) {
            return item.action == 'purchase';
        });

        this._tplData['lastPurchase'] = false;
        if (purchases.length) {
            this._tplData['lastPurchase'] = true;
            this._tplData['lastPurchaseEntries'] = purchases.slice(0,2).map((item, index)=>{

                item.purchaseDate = moment(item.purchase_date).format('DD.MM.YYYY');
                item.price = item.price;
                item.orderNum = item.order_num;
                item.pointsDelta = item.points_delta;
                item.pointsDeltaText = 'балл' + ViewBase.getNumEnding(item.points_delta, ['', 'а', 'ов']);
                item.ind = index;
                if (!item.products) {
                    item.products = [];
                }
                item.products.map((item)=>{
                    item.price = item.price + 'Р';
                    item.pointsText = 'балл' + ViewBase.getNumEnding(item.points, ['', 'а', 'ов'])
                });
                return item;
            });
        }
        
        this._tplData['lastOrderPoints'] = 0;
        this._tplData['lastOrderNum'] = 0;
        this._tplData['lastOrderDate'] = null;

        if (!!purchases[purchases.length-1]) {
            this._tplData['lastOrderPoints'] = purchases[purchases.length-1].points_delta;
            this._tplData['lastOrderNum'] = purchases[purchases.length-1].order_num;
            this._tplData['lastOrderDate'] = moment(purchases[purchases.length-1].action_date).format('DD.MM.YYYY');
        }

        this._tplData['pointsText'] = 'балл' + ViewBase.getNumEnding(this._tplData['pointsTotal'], ['', 'а', 'ов']);
        this._tplData['pointsUnConfText'] = 'балл' + ViewBase.getNumEnding(this._tplData['pointsUnConf'], ['', 'а', 'ов']);
        this._tplData['pointsConfText'] = 'балл' + ViewBase.getNumEnding(this._tplData['pointsConf'], ['', 'а', 'ов']);

        return this._tplData;
    }

    _openEditPerson(e){
        e.preventDefault();
        this.emit(ViewPerson.EVENT_PERSON_EDIT);
    }

    _openPurchaseDetail (e) {
        e.preventDefault();
        this.emit(ViewPerson.EVENT_PURCHASE_DETAIL, e.target.getAttribute('data-index')*1);
    }
}

ViewPerson.EVENT_PERSON_EDIT = 'view.person.edit';
ViewPerson.EVENT_PERSON_HISTORY = 'view.person.history';
ViewPerson.EVENT_PERSON_HOW_GET_POINTS = 'view.person.how-get-points';
ViewPerson.EVENT_PERSON_LOGOUT = 'view.person.logout';
ViewPerson.EVENT_PURCHASE_DETAIL = 'view.person.purchase-detail';

module.exports = ViewPerson;