'use strict';

/**
 * Dependencies
 */
const ViewBase = require('../base/view');
const template = require('./tpl_form_edit.hbs');
const translate = require('./translate');
const foreach = require('lodash.foreach');

class ViewEditForm extends ViewBase {
    constructor(){
        super();
        this._template = template;

        this._domEvents = {
            'click .js-mess-ok': (e) => {
                e.preventDefault();
                this.hideMessage();
                this.emit(ViewEditForm.EVENT_MESS_OK);
            },
            'click .js-select': (e) => {
                var $obj = $(e.target).closest('.js-select');
                if (this.$lastObject) {
                    this.$lastObject.removeClass('act');
                    if (this.$lastObject.get(0) == $obj.get(0)) {
                        this.$lastObject = null;
                        return;
                    } else {
                        this.$lastObject = null;
                    }
                }
                this.$lastObject = $obj;
                this.$lastObject.addClass('act');
            },
            'click document': (e) => {
                if ($(e.target).closest('.js-select').get(0) !== (this.$lastObject && this.$lastObject.get(0))) {
                    if (this.$lastObject) {
                        this.$lastObject.removeClass('act');
                        this.$lastObject = null;
                    }
                }
            },
            'click .bns_select_popup': (e) => {
                if ($(e.target).is('a')) {
                    e.preventDefault();
                    var $el = $(e.target);
                    var value = $el.attr('href');
                    var text = $el.text();
                    var $cont = null;
                    if (this.$lastObject) {
                        $cont = this.$lastObject;
                        $cont.removeClass('act');
                    } else {
                        $cont = $el.closest('.js-select');
                    }
                    var $inp = $cont.find('input');
                    $inp.val(value);
                    $cont.find('> span').text(text);
                    if (!$inp.is('[name=day]')) {
                        this._updateMonthDays();
                    }
                }
            },
            'click .js-save': this._edit,
            'click .js-popup-close': (e)=>{
                e.preventDefault();
                this.emit(ViewEditForm.EVENT_POPUP_CLOSE);
            }
        };


    }

    enable() {

        $(this.getEl()).find("#phone").mask("+7 999 999 99 99");

        this._updateMonthDays();
    }

    _edit(e){
        e.preventDefault();
        var fields = this._getFieldsValue();
        if (this._validate(fields)) {
            this.emit(ViewEditForm.EVENT_EDIT, fields);
        }
    }

    lockBtnSave (state) {
        if (state) {
            this.getEl().querySelector('.js-save').disabled = true;
        } else {
            this.getEl().querySelector('.js-save').disabled = false;
        }
    }

    _validate(fields) {
        var i = 0;

        foreach(['phone', 'day', 'month', 'year'], (item)=>{
            if (!fields[item] || fields[item] == '0') {
                i++;
                this.getEl().querySelector('[name='+item+']').parentNode.classList.add('err');
            } else {
                this.getEl().querySelector('[name='+item+']').parentNode.classList.remove('err');
            }
        });

        return !i;
    }

    _prepareTplData() {
        if (this._tplModel) {
            this._tplData = Object.assign({},this._tplData, this._tplModel.get());
        }

        let date = (this._tplData.birthDate || '').split('-');
        let months = [
            {selected: false, text: 'Январь', value: 1},
            {selected: false, text: 'Февраль', value: 2},
            {selected: false, text: 'Март', value: 3},
            {selected: false, text: 'Апрель', value: 4},
            {selected: false, text: 'Май', value: 5},
            {selected: false, text: 'Июнь', value: 6},
            {selected: false, text: 'Июль', value: 7},
            {selected: false, text: 'Август', value: 8},
            {selected: false, text: 'Сентябрь', value: 9},
            {selected: false, text: 'Октябрь', value: 10},
            {selected: false, text: 'Ноябрь', value: 11},
            {selected: false, text: 'Декабрь', value: 12}
        ];

        if (date[1]) {
            months[date[1]-1].selected = true;
        }

        let years = [];

        for (let i=1914, d=(new Date()).getFullYear(); i<=d; i++) {
            years.push({
                selected: i == (date[0]*1),
                text: i,
                value: i
            });
        }

        years = years.reverse();

        this._tplData['months'] = months;
        this._tplData['years'] = years;
        this._tplData['days'] = this._getDays((new Date).getMonth()+1, (new Date).getFullYear(), (new Date).getDate());

        this._tplData['day'] = date[2] ? date[2]*1 : translate['date'];
        this._tplData['month'] = date[1] ? months[date[1]*1-1].text : translate['month'];
        this._tplData['year'] = date[0] ? date[0]*1 : translate['year'];

        return this._tplData;
    }

    _getDays (m, y, d) {
        let days = [];

        m = m || 1;
        y = y || 1;
        d = d || 1;

        let Date = new window.Date(y, m*1, 0);
        let countDays = Date.getDate();

        for (let i=1; i<=countDays; i++) {
            days.push({
                selected: false,
                text: i,
                value: i
            });
        }

        if (d) {
            if (d >= days.length ) {
                d = days.length-1;
            }
            days[d].selected = true;
        }

        return days;
    }

    _updateMonthDays () {
        let month = this.getEl().querySelector('[name=month]').value;
        let year = this.getEl().querySelector('[name=year]').value;
        let day = this.getEl().querySelector('[name=day]').value;
        let days = this._getDays(month, year, day || 1);

        var daysList = this.getEl().querySelector('[name=day]').parentNode.querySelector('.bns_select_popup');

        daysList.textContent = '';

        foreach(days, (day)=>{
            var a = document.createElement('A');
            a.textContent = day.text;
            a.href = day.value;
            daysList.appendChild(a);
        });
    }

    _getFieldsValue () {
        return {
            lastName: this.getEl().querySelector('[name=surname]').value,
            firstName: this.getEl().querySelector('[name=name]').value,
            email: this.getEl().querySelector('[name=email]').value,
            phone: this.getEl().querySelector('[name=phone]').value,
            day: this.getEl().querySelector('[name=day]').value,
            month: this.getEl().querySelector('[name=month]').value,
            year: this.getEl().querySelector('[name=year]').value
        };
    }

    viewMessage (textVersion) {
        textVersion = translate[textVersion] || textVersion;
        this.getEl().querySelector('.js-person-main').style.display = 'none';
        this.getEl().querySelector('.js-person-message > p').textContent = textVersion;
        this.getEl().querySelector('.js-person-message').style.display = 'block';
    }

    hideMessage() {
        this.getEl().querySelector('.js-person-main').style.display = 'block';
        this.getEl().querySelector('.js-person-message').style.display = 'none';
    }
}

ViewEditForm.EVENT_EDIT = 'view.edit-form.edit';
ViewEditForm.EVENT_MESS_OK = 'view.edit-form.mess-ok';
ViewEditForm.EVENT_POPUP_CLOSE = 'view.edit-form.popup-close';

module.exports = ViewEditForm;