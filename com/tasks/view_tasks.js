'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_tasks.hbs');
const foreach = require('lodash.foreach');
const ViewTask = require('./view_task');
const Model = require('../base/model');

require('../../less/img/q1.png');
require('../../less/img/q1_h.png');

require('../../less/img/q2.png');
require('../../less/img/q2_h.png');

require('../../less/img/q3.png');
require('../../less/img/q3_h.png');

class ViewTasks extends ViewBase {
    constructor(arg){
        super(arg);
        this._template = template;

        this._elTaskCont = null;

        this.on(ViewBase.EVENT_RENDER, ()=>{
            this._elTaskCont = this.getEl().querySelector('.js-tasks-cont');
        });

        this._domEvents = {
          'click .js-show-more': (e)=>{
              e.preventDefault();
              this.getEl().classList.toggle(ViewTasks.CLASS_SHOW);
            }
        };
    }

    enableBinding() {
        if (this._tplModel) {
            this._tplModel.on(Model.EVENT_CHANGE, this.renderTasks.bind(this));
        }
    }

    _prepareTaskData(action) {
        let map = {
            "system": {
                "inviteFriend":{
                    "name": "Пригласить друга",
                    'icon': 'img/q3.png',
                    'iconHover': 'img/q3_h.png',
                },

                "emailBinding":{
                    "name": "Привязать почту",
                    'icon': 'img/q2.png',
                    'iconHover': 'img/q2_h.png',
                },
                'poll': {
                    "name": action.description,
                    'icon': 'img/q2.png',
                    'iconHover': 'img/q2_h.png',
                }
            },

            "social": {
                "vk": {
                    "desc": {
                        "like": "Вступить в группу",
                        "partner_page": "Рассказать о вебсайте",
                        "purchase": "Рассказать о покупке"
                    },
                    "icon": "img/q1.png",
                    'iconHover': 'img/q1_h.png',
                    'addClass': 'bns_more_point_item_vk'
                },
                "fb": {
                    "desc": {
                        "like": "Вступить в группу",
                        "partner_page": "Рассказать о вебсайте",
                        "purchase": "Рассказать о покупке"
                    },
                    'icon': 'img/q1.png',
                    'iconHover': 'img/q1_h.png',
                    'addClass': "bns_more_point_item_fb"
                },
                "gp": {
                    "desc": {
                        "like": "Вступить в группу",
                        "partner_page": "Рассказать о вебсайте",
                        "purchase": "Рассказать о покупке"
                    },
                    'icon': 'img/q1.png',
                    'iconHover': 'img/q1_h.png',
                    'addClass': 'bns_more_point_item_gp'
                },
                "ok": {
                    "desc": {
                        "like": "Вступить в группу",
                        "partner_page": "Рассказать о вебсайте",
                        "purchase": "Рассказать о покупке"
                    },
                    "icon": "img/q1.png",
                    'iconHover': 'img/q1_h.png',
                    'addClass': "bns_more_point_item_ok"
                },
                "tw": {
                    "desc": {
                        "like": "Вступить в группу",
                        "partner_page": "Рассказать о вебсайте",
                        "purchase": "Рассказать о покупке"
                    },
                    'icon': 'img/q1.png',
                    'iconHover': 'img/q1_h.png',
                    'addClass': 'bns_more_point_item_tw'
                }
            }
        };

        let mapSocialBtnClasses = {
            'ok': {
                text: 'Однокласники',
                class: 'social-likes__button_odnoklassniki'
            },
            'vk': {
                text: 'Вконтакте',
                class: 'social-likes__button_vk'
            },
            'gp': {
                class: 'social-likes__button_gp',
                text: 'Google+'
            },
            'tw': {
                class: 'social-likes__button_tw',
                text: 'Twitter'
            },
            'fb': {
                class: 'social-likes__button_fb',
                text: 'Facebook'
            }
        };

        let data = {
            actionId: action._actionId,
            points: action['points'],
            icon: '',
            text: '',
            index: action.index,
            addClass: ''
        };
        if (map.social[action.socialType]) {
            data['icon'] = map.social[action.socialType].icon;
            data['iconHover'] = map.social[action.socialType].iconHover;
            data['text'] = map.social[action.socialType].desc[action.action] + ' в ' + mapSocialBtnClasses[action.socialType].text;
            data['socialBtn'] = mapSocialBtnClasses[action.socialType].class;
            data['socialBtnText'] = mapSocialBtnClasses[action.socialType].text;
        };

        if (map.system[action.type]) {
            data['text'] = map.system[action.type].name;
            data['icon'] = map.system[action.type].icon;
            data['iconHover'] = map.system[action.type].iconHover;
            data['socialBtn'] = 'social-button_other';
            data['socialBtnText'] = 'Выполнить';
        }

        return data;
    }

    renderTasks() {
        let actions = this._tplModel.get('actions');
        if (!this.getEl() || !actions.length) return;

        this.getEl().removeAttribute('style');
        this._elTaskCont.textContent = '';

        if (actions.length) {
            let VTask = new ViewTask();
            VTask.setData({rule: true}).render();
            this._elTaskCont.appendChild(VTask.getEl());
        }

        foreach(actions, (action, index)=>{
            let VTask = new ViewTask();
            VTask.setData(this._prepareTaskData(Object.assign(action, {index}))).render();

            VTask.on(ViewTask.EVENT_RUN_TASK, (data)=>{
                this.emit(ViewTasks.EVENT_RUN_TASK, this._tplModel.get('origin')[data['index']]);
            });

            this._elTaskCont.appendChild(VTask.getEl());

            if (!!this._tplModel.get('origin')[index]) {
                if (this._tplModel.get('origin')[index].type !== 'poll') {
                    SAILPLAY.actions.parse(VTask.getEl().querySelector('.js-run-task-wrap'), this._tplModel.get('origin')[index]);
                }
            }
        });

        this.enable();
    }


    enable () {
        $(this.getEl()).find('.js-gifts-cont').cycle();
    }
}
ViewTasks.EVENT_RUN_TASK = 'view.tasks.task.run';
ViewTasks.CLASS_SHOW = 'show-view-more';

module.exports = ViewTasks;