import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import axios from 'axios';


class CategoryActions {
    handleCreate = async (name) => {
        const resp = await axios.post('/api/products', {name: name});

        if (resp.status === 201) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_CATEGORY,
                entity: {
                    id: resp.data.id,
                    name: resp.data.name
                }
            });
        }
    }

    handleUpdate = async (id, name) => {
        const resp = await axios.put(`/api/products/${id}`, {name: name});

        if (resp.status === 200) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_CATEGORY,
                id,
                entity: {
                    name: name
                }
            });
        }
    }

    handleDelete = async (id) => {
        const resp = await axios.delete(`/api/products/${id}`);

        if (resp.status === 204) {
            AppDispatcher.dispatch({
                type: StoreActions.DELETE_CATEGORY,
                id
            });
        }
    }

    handleFetch = async (term = '', orderBy = 'name') => {
        const resp = await axios.get(`/api/products?ordering=${orderBy}&search=${term}`);

        if (resp.status === 200) {
            AppDispatcher.dispatch({
                type: StoreActions.FETCH_CATEGORIES,
                storeData: {
                    count: resp.data.count,
                    showing: resp.data.results.length,
                    previous: resp.data.previous,
                    next: resp.data.next,
                    data: resp.data.results,
                }
            });
        }
    }
}

const categoryAction = new CategoryActions();
export default categoryAction;