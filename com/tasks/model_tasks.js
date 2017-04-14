const Model = require('../base/model');
const config = require('../../config');
const foreach = require('lodash.foreach');
const API = require('../base/api');

class ModelTasks extends Model {

    constructor (arg) {
        super(arg);
    }

    _defaults() {
        return {
            actions: [],
            origin: {}
        };
    }

    _parse(resp) {
        return {
            actions: resp.actions.concat(resp.actionsCustom),
            origin: resp.actions.concat(resp.actionsCustom)
        };
    }

    fetch() {
        API.getTasks(true)
            .then((resp)=>{
                this.set(resp, {parse: true, silent: true});
                this.emit(Model.EVENT_CHANGE);
            });
    }

    executeTask(data) {
        API
            .executeTask(data)
            .then((resp)=>{
                this.emit(ModelTasks.EVENT_TASK_RUNNED, resp);
                this.fetch();
            });
    }

    saveTaskProfile () {
        API
            .addTags([ModelTasks.TAG_PROFILE_EDITED])
            .then(()=>{
                this.fetch();
            });
    }

    isProfileEdited() {
        for (let i in this.get('origin')) {
            if (this.get('origin').hasOwnProperty(i)) {
                if (this.get('origin')[i].type == ModelTasks.TAG_PROFILE_EDITED) {
                    return true;
                }
            }
        }
        return false;
    }
}

ModelTasks.EVENT_TASK_RUNNED = 'model.tasks.runned';
ModelTasks.TAG_PROFILE_EDITED = 'Клиент заполнил профиль';

module.exports = ModelTasks;