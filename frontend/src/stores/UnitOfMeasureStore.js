import AppDispatcher from '../dispatcher';
import BaseStore from './BaseStore';

class UnitOfMeasureStore extends BaseStore {
    handleEvents(action) {
        switch(action.type) {
            case StoreActions.CREATE_UNIT:
                this.create(action.entity);
            break;
            case StoreActions.UPDATE_UNIT:
                this.update(action.id, action.entity);
            break;
            case StoreActions.DELETE_UNIT:
                this.delete(action.id);
            break;
            case StoreActions.FETCH_UNIT:
                this.fetch(action.storeData);
            break;
        }
    }
}

const unitOfMeasureStore = new UnitOfMeasureStore();
AppDispatcher.register(unitOfMeasureStore.handleEvents.bind(unitOfMeasureStore));

export default unitOfMeasureStore;

