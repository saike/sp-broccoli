const Ctrl = require('../base/controller');
const ViewTasks = require('./view_tasks');
const ModelTasks = require('./model_tasks');
const foreach = require('lodash.foreach');
const Popup = require('../popup');
const ViewFrame = require('./view_poll');

require('./styles.less');

class Tasks extends Ctrl {
    constructor() {
        super();

        this._ModelTasks = new ModelTasks();

        this._ViewTasks = new ViewTasks({
            model: this._ModelTasks
        });
        this._ViewTasks.enableBinding();

        this._ViewTasks.on(ViewTasks.EVENT_RUN_TASK, this._runTask.bind(this));

        this._ViewBase = this._ViewTasks;

        SAILPLAY.on('actions.perform.success', ()=>{
            this._ModelTasks.fetch();
            this.emit(Tasks.EVENT_TASK_COMPLETED);
        });

        SAILPLAY.on('actions.social.connect.complete', ()=>{
            this._ModelTasks.fetch();
            this.emit(Tasks.EVENT_TASK_COMPLETED);
        });

    }

    _runTask (data) {
        console.log(data);
        if (data.type == 'inviteFriend') {
            this._ModelTasks.executeTask(data);
            return true;
        }

        let config = window.SAILPLAY.config();
        let src = (config && ((config.DOMAIN + config.urls.actions.custom.render.replace(':action_id', data.id) + '?auth_hash=' + config.auth_hash + '&lang=' + config.lang))) || '';

        if (data.type == 'poll') {
            var Pop = new Popup();
            Pop.on(Popup.EVENT_CLOSE, ()=>{
                this._ModelTasks.fetch();
                this.emit(Tasks.EVENT_TASK_COMPLETED);
            });
            Pop
                .setContent(new ViewFrame({data: {src: src}}))
                .show();
            return true;
        }
    }

    render () {
        this._ViewTasks.renderTasks();
    }

    start() {
        this._ModelTasks.fetch();
    }

    getRemainTasks() {
        return Tasks.COUNT_TASKS - this._ModelTasks.get('actions').length;
    }
}

Tasks.EVENT_EDIT_PROFILE = 'ctrl.tasks.profile-open';
Tasks.EVENT_TASK_COMPLETED = 'ctrl.tasks.completed';

Tasks.COUNT_TASKS = 11;

module.exports = Tasks;