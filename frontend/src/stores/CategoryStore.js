import AppDispatcher from '../dispatcher';
import BaseStore from './BaseStore';

class CategoryStore extends BaseStore {
}

const categoryStore = new CategoryStore();
AppDispatcher.register(categoryStore.handleEvents.bind(categoryStore));

export default categoryStore;

