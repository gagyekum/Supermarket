import AppDispatcher from '../dispatcher';
import StoreBase from './StoreBase';

class ProductStore extends StoreBase {
    handleEvents(action) {
        switch(action.type) {
            case StoreActions.CREATE_PRODUCT:
                this.create(action.entity);
            break;
            case StoreActions.UPDATE_PRODUCT:
                this.update(action.id, action.entity);
            break;
            case StoreActions.DELETE_PRODUCT:
                this.delete(action.id);
            break;
            case StoreActions.FETCH_PRODUCTS:
                this.fetch(action.storeData);
            break;
        }
    }
}

const productStore = new ProductStore();
AppDispatcher.register(productStore.handleEvents.bind(productStore));

export default ProductStore;

