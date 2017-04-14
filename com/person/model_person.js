const Model = require('../base/model');
const API = require('../base/api');
const foreach = require('lodash.foreach');
const cookie = require('tiny-cookie');

class ModelPerson extends Model {
    _defaults() {
        return {
            pointsValue: 0,
            history: [],
            status: '',
            statusPic: null,
            email: null,
            address:''
        };
    }

    login(opt) {
        API
            .login(opt)
            .then((resp)=>{
                this.emit(ModelPerson.EVENT_LOGGED, resp);
                this.fetch();
            })
    }

    fetch () {
        API
            .userInfo()
            .then(
                (resp)=>{
                    if (resp.status == 'ok') {
                        Object.assign(resp, {
                            'address': cookie.get('address')
                        });
                        this.set(resp, {parse: true, updateEmpty: true, silent: true});
                        this.fetchAddHistoryInfo();
                    } else {
                        this.emit(ModelPerson.EVENT_ERROR_FETCH, resp);
                    }
                }
            );
    }

    fetchAddHistoryInfo () {
        var hist = this.get('history'),
            entry = null, entryData = null,
            mapIdIndex = {}, histEntry, el = hist.length,
            promises = [];

        for (var i=0, l=el; i<l; i++) {
            entry = hist[i];
            if (entry.id) {
                promises.push(API.getPurchaseInfo(entry.id));
            }
        }

        Promise.all(promises).then(values =>{
            foreach(values, (item, index)=>{
                hist[index]['price'] = item.purchase.price;
                hist[index]['products'] = item.cart.cart.positions.map((item, index)=>{
                    return {
                        price: item.new_price*1,
                        num: item.num*1,
                        points: item.points*1,
                        name: item.product.name,
                        sku: item.product.sku
                    };
                });
            });

            this.emit(Model.EVENT_CHANGE);
            this.emit(Model.EVENT_FETCH);
        });
    }

    logout() {
        API
            .logout()
            .then(()=>{
                this.emit(ModelPerson.EVENT_LOGOUTED);
            });
    }

    _parse(resp) {
        return {
            pointsValue: resp.user_points.confirmed,
            history: (resp.history || []),
            status: resp.user_status.name,
            statusPic: resp.user_status.pic,
            email: resp.user.email,
            name: resp.user.name,
            pic: resp.user.pic,
            pointsConf: resp.user_points.confirmed,
            pointsTotal: resp.user_points.total,
            pointsUnConf: resp.user_points.unconfirmed,
            lastName: resp.user.last_name,
            firstName: resp.user.first_name,
            phone: resp.user.phone,
            male: (resp.user.sex === 1),
            female: (resp.user.sex === 2),
            birthDate: resp.user.birth_date,
            address: resp.address
        };
    }

    save(data) {

        let sendData = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            birthDate: data.year + '-' + ((data.month.length == 1) ? '0' + data.month : data.month) + '-' + ((data.day.length == 1) ? '0' + data.day : data.day)
        };

        data['phone'] = data['phone'].replace(/\D/g, '');
        sendData['phone'] = data['phone'];

        if (this.get('phone') !== data['phone']) {
            sendData['addPhone'] = data['phone'];
        }

        if (this.get('email') !== data['email']) {
            sendData['addEmail'] = data['email'];
        }

        Promise.all([
            API.addVars({address: data['address']}),
            API.userUpdate(sendData)
        ]).then((values)=>{
            if (values[0] && values[0].status == 'ok' &&  values[1] && values[1].status == 'ok') {
                this.emit(ModelPerson.EVENT_SAVED, values[0]);
                cookie.set('address', data['address'], 'Y');
                this.fetch();
            } else {
                this.emit(ModelPerson.EVENT_ERROR_SAVE, values[0].status == 'ok' ? values[1] : values[0]);
            }
        });
    }
}

for( var key in Model) {
    if (Model.hasOwnProperty(key)) {
        ModelPerson[key] = Model[key];
    }
}

ModelPerson.EVENT_LOGGED = 'model.person.logged';
ModelPerson.EVENT_LOGOUTED = 'model.person.logouted';
ModelPerson.EVENT_SAVED = 'model.person.saved';
ModelPerson.EVENT_ERROR_SAVE = 'model.person.error-save';
ModelPerson.EVENT_ERROR_FETCH = 'model.person.error-fetch';
ModelPerson.EVENT_HISTORY_FETCHED = 'model.person.history-fetch';

module.exports = ModelPerson;