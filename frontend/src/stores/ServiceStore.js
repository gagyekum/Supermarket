import AppDispatcher from '../dispatcher';
import StoreBase from './StoreBase';

class ServiceStore extends StoreBase {
    handleEvents(action) {
        switch(action.type) {
            case StoreActions.CREATE_SERVICE:
                this.create(action.entity);
            break;
            case StoreActions.UPDATE_SERVICE:
                this.update(action.id, action.entity);
            break;
            case StoreActions.DELETE_SERVICE:
                this.delete(action.id);
            break;
            case StoreActions.FETCH_SERVICES:
                this.fetch(action.storeData);
            break;
        }
    }
}

const serviceStore = new ServiceStore();
AppDispatcher.register(serviceStore.handleEvents.bind(serviceStore));

export default serviceStore;

