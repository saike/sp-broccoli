const Events = require('events');
const API = require('./api');
const config = require('../../config');
const Components = require('../');
const foreach = require('lodash.foreach');
const isString = require('lodash.isstring');
const BaseView = require('./view');

class App extends Events {
    constructor () {
        super();
        API
            .init(config)
            .then(()=>{
                this.emit(App.EVENT_API_INITED);
            });

        this._components = {
            App: this
        };

        this._communication = [];
        this._viewDep = []
    }

    _mount (point, com) {
        if (point) {
            if (point == 'body') {
                document.body.appendChild(com.getEl());
            } else {
                document.body.querySelector(point).appendChild(com.getEl());
            }
            setTimeout(()=>{
                com.emit(BaseView.EVENT_MOUNT);
            }, 300);
        }
    }

    components (components) {
        foreach(components, (com, index)=>{
            if (Components[com.name]) {
                let Component = new Components[com.name](this, config);

                this._mount(com.mountPoint, Component);

                if (com.viewDependence) {
                    this._viewDep.push({
                        dependent: Component,
                        dependence: com.viewDependence,
                        point: com.mountPoint
                    });
                }

                if (com.startAfter) {
                    if (com.startAfter.type == 'event') {
                        let arr = com.startAfter.name.split('.');
                        let event = Components[arr[0]];
                        let observable = null;

                        foreach(arr.slice(1), (part)=>{
                            event = event[part];
                        });

                        observable = this._components[arr[arr.length-2]];
                        observable.on(event, (data)=>{
                            Component.start(data);
                        });
                    }
                } else {
                    Component.start();
                }

                if (com.communication) {
                    foreach(com.communication, (component, event)=>{
                        this._communication.push([com.name, component, event])
                    });
                }

                this._components[com.name] = Component;
            }
        });

        this._subscribe();
        this._viewDependence();
    }

    _subscribe () {
        foreach(this._communication, (entry)=>{
            let Component = this._components[entry[0]];
            let component = entry[1];
            let event = entry[2];

            if (isString(component)){
                let parts = component.split('.');
                Component.on(Components[entry[0]][event], this._components[parts[0]][parts[1]].bind(this._components[parts[0]]));
            }else if (typeof component == 'function') {
                Component.on(Components[entry[0]][event], component);
            }
        });
    }

    _viewDependence () {
        foreach(this._viewDep, (entry)=>{
            let ComDependence = this._components[entry['dependence']];

            ComDependence.getBaseView().on(BaseView.EVENT_RENDER, ()=>{
                this._mount(entry.point, entry['dependent']);
            });
        });
    }

    getComponent (name) {
        return this._components[name];
    }
}
App.EVENT_API_INITED = 'app.api-inited';

let instance = null;

App.getInstance = function () {
    if (instance == null) {
        instance = new App();
    }
    return instance;
};

module.exports = App;