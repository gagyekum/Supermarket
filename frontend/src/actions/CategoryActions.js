import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import CategoryApi from './apis/CategoryApi';


class CategoryActions {
    constructor() {
        this.api = new CategoryApi('/api/categories');
    }

    handleCreate = async (name) => {
        const data = await this.api.create({name});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_CATEGORY,
                entity: {
                    id: data.id,
                    name: data.name
                }
            });
        }
    }

    handleUpdate = async (id, name) => {
        const data = await this.api.update(id, {name});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_CATEGORY,
                id,
                entity: {
                    name: data.name
                }
            });
        }
    }

    handleDelete = async (id) => {
        const resp = await this.api.delete(id);
        if (resp) {
            AppDispatcher.dispatch({
                type: StoreActions.DELETE_CATEGORY,
                id
            });
        }
    }

    handleFetch = async ({page = 1, orderBy = 'name', search = null} = {}) => {
        const data = await this.api.fetch({page, orderBy, search});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.FETCH_CATEGORIES,
                storeData: {
                    count: data.count,
                    showing: data.results.length,
                    previous: data.previous,
                    next: data.next,
                    data: data.results,
                }
            });
        }
    }
}

const categoryActions = new CategoryActions();
export default categoryActions;