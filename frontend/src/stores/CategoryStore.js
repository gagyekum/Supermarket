import AppDispatcher from '../dispatcher';
import BaseStore from './BaseStore';

class CategoryStore extends BaseStore {
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
        }
    }
}

const categoryStore = new CategoryStore();
AppDispatcher.register(categoryStore.handleEvents.bind(categoryStore));

export default categoryStore;

