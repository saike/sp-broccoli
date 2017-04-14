/**
 * Created by vasia on 24/10/16.
 */

module.exports = new class {
    init (opt){
        this.config = opt;
        return new Promise((resolve)=>{
            let params = {
                partner_id: opt.partner_id
            };
            if (opt.domain) {
                params['domain'] = opt.domain;
            }
            SAILPLAY.send('init', params);
            SAILPLAY.on('init.success', (resp)=>{resolve(resp);});
        });
    }

    login (opt) {
        return new Promise((resolve)=>{
            if (opt.remote) {
                SAILPLAY.send('login.remote', opt);
            } else {
                SAILPLAY.send('login', opt.authHash);
            }
            SAILPLAY.on('login.success', (resp)=>{
                resolve(resp);
            });
        });
    }

    userInfo () {
        return new Promise((resolve)=>{
            let c = 2,
                resp = {};
            SAILPLAY.on('load.user.info.success', (r)=>{
                c--;
                Object.assign(resp, r);
                if (!c) resolve(resp);
            });
            SAILPLAY.on('load.user.info.error', (r)=>{
                resolve(r);
            });
            SAILPLAY.on('load.user.history.success', (r)=>{
                c--;
                Object.assign(resp, {history: r});
                if (!c) resolve(resp);
            });
            SAILPLAY.send('load.user.info', {all: 1});
            SAILPLAY.send('load.user.history');
        });
    }

    logout () {
        return new Promise((resolve)=>{
            SAILPLAY.on('logout.success', (resp)=>{
                resolve(resp);
            });
            SAILPLAY.send('logout');
        });
    }

    userUpdate (data) {
        return new Promise((resolve)=> {
            SAILPLAY.send('users.update', data, (resp)=>{
                setTimeout(()=>{
                    resolve(resp);
                }, 300);
            });
        });
    }

    getTasks (custom) {

        if (!custom) {
            console.log('here');
            return new Promise((resolve)=> {
                SAILPLAY.send('load.actions.list');
                SAILPLAY.on('load.actions.list.success', (data)=>{
                    resolve(data);
                });
            });
        }

        return new Promise((resolve)=>{
            var c = [false, false],
                runned = false,
                d = {},
                cb = function () {
                    if (c[0] && c[1] && !runned) {
                        runned = true;
                        setTimeout(()=>{
                            resolve(Object.assign({},d.base, {actionsCustom: d.custom}));
                        }, 100);
                    }
                };

            SAILPLAY.send('load.actions.custom.list', );
            SAILPLAY.on('load.actions.custom.list.success', (data)=> {
                d.custom = data;
                c[0] = true;
                cb(data);
            });
            SAILPLAY.send('load.actions.list');
            SAILPLAY.on('load.actions.list.success', (data)=>{
                d.base = data;
                c[1] = true;
                cb(data);
            });
        });
    }

    executeTask (action) {
        return new Promise((resolve)=> {
            SAILPLAY.on('actions.perform.success', (data)=>{
                resolve(data);
            });
            SAILPLAY.send('actions.perform', action);
        });
    }

    getBadges () {
        return new Promise((resolve)=> {
            SAILPLAY.send('load.badges.list', {include_rules:1});
            SAILPLAY.on('load.badges.list.success', (data)=>{
                resolve(data);
            });
        });
    }

    isExistTags (tags) {
        return new Promise((resolve)=> {
            SAILPLAY.send('tags.exist', {tags: tags || []});
            SAILPLAY.on('tags.exist.success', (data)=>{
                resolve(data);
            });
        });
    }

    addTags (tags) {
        return new Promise((resolve)=> {
            SAILPLAY.send('tags.add', {tags: tags || []});
            SAILPLAY.on('tags.add.success', (data)=>{
                setTimeout(()=>{
                    resolve(data);
                }, 300);
            });
        });
    }

    getGifts() {
        return new Promise((resolve)=>{
            SAILPLAY.send('load.gifts.list');
            SAILPLAY.on('load.gifts.list.success', (resp)=>{
                resolve(resp);
            });
        });
    }

    purchaseGifts(gift) {
        return new Promise((resolve)=>{
            SAILPLAY.send('gifts.purchase', {gift: gift || {}});
            SAILPLAY.on('gifts.purchase.success', (resp)=>{
                setTimeout(()=>{
                    resolve(resp);
                }, 300);
            });
        });
    }

    getPurchaseInfo(actionId) {
        return new Promise((resolve)=>{
            SAILPLAY.jsonp.get(SAILPLAY.config().DOMAIN + '/js-api/' + SAILPLAY.config().partner.id + '/purchases/get/', {id: actionId, auth_hash: SAILPLAY.config().auth_hash}, function (res) {
                resolve(res);
            });
        });
    }

    addVars(data) {
        return new Promise((resolve)=>{
            SAILPLAY.send('vars.add', {custom_vars: data}, (resp)=>{
                resolve(resp);
            });
        });
    }
}