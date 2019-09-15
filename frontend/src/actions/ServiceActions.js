import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import ServiceApi from './apis/ServiceApi';


class ServiceActions {
    constructor() {
        this.api = new ServiceApi('/api/services');
    }

    handleCreate = async (name, {unitPrice = 0, category = null} = {}) => {
        const data = await this.api.create({
            name,
            unit_price: unitPrice,
            category,
        });
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_PRODUCT,
                entity: {
                    id: data.id,
                    name: data.name,
                    unitPrice: data.unit_price,
                    category: data.category,
                }
            });
        }
    }

    handleUpdate = async (id, name, {unitPrice = 0, category = null} = {}) => {
        const data = await this.api.update(id, {
            name,
            unit_price: unitPrice,
            category,
        });
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_PRODUCT,
                id,
                entity: {
                    name: data.name,
                    unitPrice: data.unit_price,
                    category: data.category,
                }
            });
        }
    }

    handleDelete = async (id) => {
        const resp = await this.api.delete(id);
        if (resp) {
            AppDispatcher.dispatch({
                type: StoreActions.DELETE_PRODUCT,
                id
            });
        }
    }

    handleFetch = async ({page = 1, orderBy = 'name', search = null, filter = '&is_deleted=False'} = {}) => {
        const data = await this.api.fetch({page, orderBy, search, filter});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.FETCH_PRODUCTS,
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

const productActions = new ProductActions();
export default productActions;