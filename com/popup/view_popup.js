'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_popup.hbs');

require('../../less/img/close.png');

class ViewPopup extends ViewBase {
    constructor(){
        super();
        this._template = template;
        this._blockContent = null;
        this._blockTitle = null;

        this.on(ViewBase.EVENT_RENDER, function () {
            this._blockContent = this.getEl().querySelector('.js-content');
            this._blockTitle = this.getEl().querySelector('.js-title');
        }, this);

        this._domEvents = {
            'click .bns_close' : (e)=>{e.preventDefault(); this.close();},
            'click' : '_close'
        };
    }

    setContent(View) {
        this._blockContent.textContent = '';
        this._blockContent.appendChild(View.getEl());
        return this;
    }

    show(opt) {
        opt = opt || {};
        var pos = (opt && opt.top || 0);

        opt.class = opt.class || '';

        let inner = this.getEl().querySelector('.js-inner');
        inner.style.top = pos+'px';
        document.body.classList.add('no_scrol');

        if (!!opt.class) {
            this.getEl().classList.add(opt.class);
            this.on(ViewPopup.EVENT_CLOSE, ()=>{
                this.getEl().classList.remove(opt.class);
            });
        }

        inner.style.width = '460px';
        if (opt && opt.width) {
            inner.style.width = opt.width+'px';
        }

        $(this.getEl()).fadeIn();
        this.emit(ViewPopup.EVENT_OPEN);
        return this;
    }

    _close(e) {
        if ($(e.target).closest('.js-content').length == 0) {
            e.preventDefault();
            this.close();
        }
    }

    close() {
        $(this.getEl()).fadeOut();
        this.emit(ViewPopup.EVENT_CLOSE);
        document.body.classList.remove('no_scrol');
        return this;
    }

    setTitle(title) {
        if (!this.isRendered()) {
            this._tplData['title'] = title;
        } else {
            this._blockTitle.textContent = title;
        }
        return this;
    }
}

ViewPopup.EVENT_CLOSE = 'view.popup.close';
ViewPopup.EVENT_OPEN = 'view.popup.open';

module.exports = ViewPopup;