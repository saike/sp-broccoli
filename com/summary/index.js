const Ctrl = require('../base/controller');
const View = require('./view_summary');
const ViewBase = require('../../com/base/view');
const ViewHistory = require('./view_history');
const Popup = require('../popup');

class Summary extends Ctrl {
    constructor(arg) {
        super(arg);
        this.enable();

        this._ViewBase = new View();
        this._ViewBase.on(View.EVENT_OPEN_HISTORY, this.showPopupHistory.bind(this));
        this.draw();
    }

    getRemainTasks () {
        return this._App.getComponent('Person').getHistory().filter((item)=>{
            if (item.action == 'sharing') {
                return true;
            }
            return false;
        }).length;
    }

    draw () {
        this._ViewBase.setData({
            'progress': this._App.getComponent('Gifts').getProgress(),
            'completedTasks': this.getRemainTasks(),
            'completedTasksText': 'задан' + ViewBase.getNumEnding(this.getRemainTasks(), ['ие', 'ия', 'ий']),
            'countGifts': this._App.getComponent('Gifts').getAvailableGifts(),
            'countGiftsText': 'подар' + ViewBase.getNumEnding(this._App.getComponent('Gifts').getAvailableGifts(), ['ок', 'ка', 'ков']),
            'points': this._App.getComponent('Person').getPoints(),
            'pointsText': 'балл' + ViewBase.getNumEnding(this._App.getComponent('Person').getPoints(), ['', 'а', 'ов']),
            'badges': this._App.getComponent('Badges').getBadges()
        });
        this._ViewBase.render();
    }

    enable () {
        $('.bns_tab a').click(function (e) {
            e.preventDefault();
            $('.bns_tab a').removeClass('act');
            $(this).addClass('act');
            $('.bns_tab_block').hide();
            $(''+$(this).attr('href')+'').fadeIn();
            return false;
        })
    }

    showPopupHistory() {
        let ViewHistoryIns = new ViewHistory(),
            Pop = new Popup();

        ViewHistoryIns
            .setData({
                history: this._App.getComponent('Person').getHistory(),
                points: this._App.getComponent('Person').getPoints()
            })
            .render();
        Pop.setTitle('История транзакций')
            .setContent(ViewHistoryIns)
            .show({
                class: 'bns_overlay_hist',
                width: 680
            });
    }
}

module.exports = Summary;