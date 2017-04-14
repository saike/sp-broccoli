const Model = require('../base/model');
const API = require('../base/api');

class ModelBadges extends Model {
    _defaults() {
        return {
            list: [],
            level: 0
        };
    }

    _parse(resp) {
        var list = resp.multilevel_badges[resp.multilevel_badges.length-1],
            level = resp.multilevel_badges.length;

        return {
            list: list,
            level: level
        };
    }

    fetch () {
        API
            .getBadges()
            .then((resp)=>{
                this.set(resp, {parse: true});
                this.emit(Model.EVENT_FETCH, resp);
            });
    }
}
Object.assign(ModelBadges, Model);

module.exports = ModelBadges;