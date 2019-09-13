import EventEmitter from 'events';
import {StoreActions} from '../constants';


class BaseStore extends EventEmitter {
    constructor() {
        super();
        this.storeData = {
            count: 0,
            showing: 0,
            previous: "",
            next: "",
            data: []
        }
    }

    broadCast() {
        this.emit("change");
    }

    create(entity) {
        this.storeData.data.push(entity);
        this.broadCast();
    }

    update(id, entity) {
        let obj = this.storeData.data.find(o => o.id === id);
        obj = {...entity};
        this.broadCast();
    }

    delete(id) {
        this.storeData.data = this.storeData.data.filter(o => o.id !== id);
        this.broadCast();
    }

    fetch(storeData) {
        this.storeData = {...storeData};
        this.broadCast();
    }

    handleEvents(action) {
        switch(action.type) {
            case StoreActions.CREATE_CATEGORY:
                this.create(action.entity);
            break;
            case StoreActions.UPDATE_CATEGORY:
                this.update(action.id, action.entity);
            break;
            case StoreActions.DELETE_CATEGORY:
                this.delete(action.id);
            break;
            case StoreActions.FETCH_CATEGORIES:
                this.fetch(action.storeData);
            break;
            default:
                this.handleSubEvents(action);
        }
    }

    /**
     * Override this method to handle 
     * other actions outside of default 
     * actions specified in base store
     */
    handleSubEvents(action) {
    }
}

export default BaseStore;