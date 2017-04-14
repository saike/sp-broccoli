const Ctrl = require('../base/controller');
const ViewPerson = require('./view_person');
const ModelPerson = require('./model_person');
// const ViewHistory = require('./view_history');
const Popup = require('../popup');
const translate = require('./translate');
const ViewFormEdit = require('./view_form_edit');
const ViewPurchaseDetail = require('./view_purchase_detail');

class Person extends Ctrl {
    constructor(app){
        super();

        this._Popup = new Popup();

        // this._ViewHistory = new ViewHistory();
        this._ViewFormEdit = new ViewFormEdit();
        this._ViewFormEdit.on(ViewFormEdit.EVENT_EDIT, (data)=>{
            this._ViewFormEdit.lockBtnSave(true);
            this._ModelPerson.save(data);
        });
        this._ViewFormEdit.on(ViewFormEdit.EVENT_POPUP_CLOSE, (data)=>{this._Popup.close();});
        this._ViewPurchaseDetail = new ViewPurchaseDetail();

        this._ModelPerson = new ModelPerson();

        this._ViewPerson = new ViewPerson({
            model: this._ModelPerson
        });
        this._ViewPerson.enableBinding();

        this._ViewPerson.on(ViewPerson.EVENT_PERSON_HISTORY, this.showPopupHistory.bind(this));
        this._ViewPerson.on(ViewPerson.EVENT_PERSON_EDIT, this.showPopupEdit.bind(this));
        this._ViewPerson.on(ViewPerson.EVENT_PURCHASE_DETAIL, this._showPopupPurchaseDetail.bind(this));

        this._ViewBase = this._ViewPerson;

        this._ModelPerson.on(ModelPerson.EVENT_LOGGED, ()=>{this.emit(Person.EVENT_API_LOGGED);});
        this._ModelPerson.on(ModelPerson.EVENT_FETCH, ()=>{this.emit(Person.EVENT_FETCH);});

        this._ModelPerson.on(ModelPerson.EVENT_SAVED,()=>{
            this._Popup.close();
            this.emit(Person.EVENT_SAVED);
        });

        this._ModelPerson.on(ModelPerson.EVENT_ERROR_SAVE,(res)=>{
            this._ViewFormEdit.viewMessage(res.message);
        });
    }

    showPopupHistory() {
        this._ViewHistory
            .setData({
                history: this._ModelPerson.get('history'),
                pointsValue: this._ModelPerson.get('pointsValue')
            })
            .render();

        this._ViewHistory.on(ViewHistory.EVENT_POPUP_CLOSE, (e)=>{this._Popup.close();});

        this._Popup.setTitle(translate['history of accounting']);
        this._Popup.setContent(this._ViewHistory);
        this._Popup.show();
    }

    start () {
        if (window._sp_options && window._sp_options.authHash) {
            this._ModelPerson.login({
                authHash: window._sp_options.authHash,
                remote: false
            });
        }
        this.emit(Ctrl.EVENT_COM_START);
    }

    getPoints () {
        return this._ModelPerson.get('pointsConf');
    }

    getHistory () {
        return this._ModelPerson.get('history');
    }

    getEmail () {
        return this._ModelPerson.get('email');
    }

    fetch () {
        this._ModelPerson.fetch();
    }

    showPopupEdit() {
        this._ViewFormEdit.setData(this._ModelPerson.get()).render();

        this._Popup
            .setTitle(translate['fill profile'])
            .setContent(this._ViewFormEdit);

        this._ViewFormEdit.enable();
        this._Popup.show();
    }

    _showPopupPurchaseDetail(index) {
        this._ViewPurchaseDetail.setData(this._ModelPerson.get('history')[index]).render();
        this._ViewPurchaseDetail.on(ViewPurchaseDetail.EVENT_POPUP_CLOSE, ()=>{this._Popup.close();});

        this._Popup
            .setTitle(translate['order_detail'] + this._ModelPerson.get('history')[index]['order_num'])
            .setContent(this._ViewPurchaseDetail);

        this._Popup.show();
    }
}

Person.EVENT_API_LOGGED = 'ctrl.person.api-logged';
Person.EVENT_SAVED = 'ctrl.person.saved';
Person.EVENT_FETCH = 'ctrl.person.fetch';

module.exports = Person;