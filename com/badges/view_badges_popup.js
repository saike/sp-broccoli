'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_badges_popup.hbs');
const ViewBages = require('./view_badges');

class ViewPopupBadge extends ViewBase {

  constructor(arg) {
    super(arg);
    this._template = template;
    this._domEvents = {
      'click .js-badge': this._selectBadge,
      'click .bns_achiv_show_more': this._showMore,
      'click .js-move-to-tasks': this._moveToTasks
    }
  }

  _showMore(e) {
    e.preventDefault();
    e.target.parentNode.querySelector('.bns_oa_desc_text').classList.toggle('act');

    if (e.target.parentNode.querySelector('.bns_oa_desc_text').classList.contains('act')) {
      e.target.textContent = 'Скрыть описание';
    } else {
      e.target.textContent = 'Полное описание';
    }
  }

  _selectBadge(e) {
    e.preventDefault();
    this.selectBadge(e.target.parentNode);
  }

  selectBadge(badge) {
    let cont = this.getEl().querySelector('.bns_ovar_achiv_left');
    let selected = cont.querySelector('.js-badge.act');
    let id = badge.getAttribute('data-id');
    let rightBlock = this.getEl().querySelector('.bns_over_achiv_right');

    this._selectedBadge = id;

    if (selected) {
      selected.classList.remove('act');
    }

    rightBlock.querySelector('.bns_oa_desc_head img').src = this._tplData.entriesById[id].icon;
    rightBlock.querySelector('.bns_oa_desc_head strong').textContent = this._tplData.entriesById[id].name;
    rightBlock.querySelector('.bns_oa_desc_text').textContent = this._tplData.entriesById[id].desc;
    rightBlock.classList.add('act');

    badge.classList.add('act');

    this._enableShareBadge(id);
  }

  _prepareTplData() {
    super._prepareTplData();
    let entries = [], entriesById = {}, top = 20, leftPos = [23, 127, 232, 127], leftPosIndex = 3, received = 0;

    if (this._tplData.list) {
      let li = this._tplData.list.length, item, d = {};

      for (let i = 0; i < li; i++) {
        item = this._tplData.list[i];
        d = {
          left: leftPos[leftPosIndex] + 'px',
          top: top + 'px',
          icon: item.thumbs.url_100x100,
          index: entries.length,
          isReceived: !!item.is_received,
          name: item.name,
          desc: item.descr,
          id: item.id
        };

        if (item.is_received) {
          received++;
        }

        entries.push(d);

        entriesById[item.id] = d;

        top += 60;

        leftPosIndex++;
        if (leftPosIndex >= leftPos.length) {
          leftPosIndex = 0;
        }

        this._tplData['entries'] = entries;
        this._tplData['entriesById'] = entriesById;
      }

      let railways = [], w = {}, rwSize = [[16, 176, 'way1'], [128, 17, 'way2'], [5, 17, 'way3'], [93, 175, 'way4']], // [topShift,left]
        posIndex = 0, n = 1, rTop = -11;

      this._tplData['count'] = '';

      switch (received) {
        case 0:
          this._tplData['text_achiv'] = 'нет достижений';
          break;
        case 1:
          this._tplData['text_achiv'] = 'одно достижение';
          break;
        case 2:
        case 3:
        case 4:
          this._tplData['count'] = received;
          this._tplData['text_achiv'] = 'достижения';
          break;
        default:
          this._tplData['text_achiv'] = 'достижений';
          this._tplData['count'] = received;
      }

      for (let r = 0; r < received; r++) {

        if (n > 4) {
          n = 1;
        }

        w = {
          img: 'img/r' + n + '.png', left: rwSize[posIndex][1] + 'px', top: rTop + 'px', class: rwSize[posIndex][2]
        };

        n++;
        rTop += rwSize[posIndex][0];
        posIndex++;

        if (posIndex > 3) {
          posIndex = 0
        }

        railways.push(w);
      }

      this._tplData['railways'] = railways;
    }


    return this._tplData;
  }

  _enableShareBadge(e) {
    let cont = document.querySelector('.bns_achiv_social'), els = cont.querySelectorAll('a'), i = 0, l = els.length, f = false;

    let index = this._tplData.entriesById[this._selectedBadge].index;
    cont.style.display = 'block';

    for (; i < l; i++) {
      if (this._tplData.list[index].actions && this._tplData.list[index].actions[els[i].getAttribute('data-action')]) {
        SAILPLAY.actions.parse(els[i].children[0], this._tplData.list[index].actions[els[i].getAttribute('data-action')]);
        f = true;
      }
    }
    if (!f) {
      cont.style.display = 'none';
    }
  }

  _moveToTasks(e) {
    console.log(e);
    e.preventDefault();
    console.log(ViewBages.EVENT_MOVE_TO_TASKS);
    this.emit(ViewBages.EVENT_MOVE_TO_TASKS);
  }
}

module.exports = ViewPopupBadge;