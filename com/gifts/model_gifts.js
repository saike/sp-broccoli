const Model = require('../base/model');
const API = require('../base/api');

class ModelGifts extends Model {

    constructor (arg) {
        super(arg);
    }

    _defaults() {
        return {
            list: []
        };
    }

    _parse(resp) {
        let l = [],
            j=0, lj=resp.length;

        for (;j<lj;j++) {
            l.push(Object.assign(resp[j], {
                index: j,
                img: resp[j].thumbs.url_100x100
            }));
        }

        return {
            list: l
        }
    }

    fetch() {
        API.getGifts()
        .then((resp)=>{
            this.set(resp, {parse: true, silent: true});
            this.emit(Model.EVENT_CHANGE);
            this.emit(Model.EVENT_FETCH);
        });
    }

    purchase(data) {
        API
            .purchaseGifts(data)
            .then((resp)=>{
                this.emit(ModelGifts.EVENT_PURCHASE);
            });
    }
}

Object.assign(ModelGifts, Model);
ModelGifts.EVENT_PURCHASE = 'model.gifts.purchase';

module.exports = ModelGifts;