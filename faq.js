'use strict';

const App = require('./com').App;

require('./less/main.less');
require('./less/img/faq_arr_b.png');
require('./less/img/faq_arr_b_h.png');
require('./less/img/faq_arr_t.png');
require('./less/img/faq_arr_t_h.png');

document.addEventListener('DOMContentLoaded', function () {
    App.getInstance().components([
        {
            name: 'Popup',
            mountPoint: 'body'
        },
        {
            name: 'Person',
            mountPoint: '.js-person',
            startAfter: {
                type: 'event',
                name: 'App.EVENT_API_INITED'
            }
        }
    ]);

    $(".bns_faq_item .bns_faq_item_top").click(function(e){
        e.preventDefault();
        $(this).parent('div').toggleClass('act');
        $(this).parent('div').find('.bns_faq_item_popup').slideToggle();
        return false;
    });
});
