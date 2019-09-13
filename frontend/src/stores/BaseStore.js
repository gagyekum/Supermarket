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
}

export default BaseStore;