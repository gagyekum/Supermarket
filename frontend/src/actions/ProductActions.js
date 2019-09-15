import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import ProductApi from './apis/ProductApi';


class ProductActions {
    constructor() {
        this.api = new ProductApi('/api/products');
    }

    handleCreate = async (name, {unitPrice = 0, category = null, unitOfMeasure = null, upc = null} = {}) => {
        const data = await this.api.create({
            name,
            unit_price: unitPrice,
            category,
            unit_of_measure: unitOfMeasure,
            upc
        });
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_PRODUCT,
                entity: {
                    id: data.id,
                    name: data.name,
                    unitPrice: data.unit_price,
                    category: data.category,
                    unitOfMeasure: data.unit_of_measure,
                    upc: data.upc
                }
            });
        }
    }

    handleUpdate = async (id, name, {unitPrice = 0, category = null, unitOfMeasure = null, upc = null} = {}) => {
        const data = await this.api.update(id, {
            name,
            unit_price: unitPrice,
            category,
            unit_of_measure: unitOfMeasure,
            upc
        });
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_PRODUCT,
                id,
                entity: {
                    name: data.name,
                    unitPrice: data.unit_price,
                    category: data.category,
                    unitOfMeasure: data.unit_of_measure,
                    upc: data.upc
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