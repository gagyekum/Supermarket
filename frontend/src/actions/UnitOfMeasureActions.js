import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import UnitOfMeasureApi from './apis/UnitOfMeasureApi';


class UnitofMeasureActions {
    constructor() {
        this.api = new UnitOfMeasureApi('/api/categories');
    }

    handleCreate = async (name, symbol = null) => {
        const data = await this.api.create({name, symbol});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_UNIT,
                entity: {
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                }
            });
        }
    }

    handleUpdate = async (id, name, symbol = null) => {
        const data = await this.api.update(id, {name, symbol});
        if (data) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_UNIT,
                id,
                entity: {
                    name: data.name,
                    symbol: data.symbol
                }
            });
        }
    }

    handleDelete = async (id) => {
        const resp = await this.api.delete(id);
        if (resp) {
            AppDispatcher.dispatch({
                type: StoreActions.DELETE_UNIT,
                id
            });
        }
    }

    handleFetch = async ({page = 1, orderBy = 'name', search = null} = {}) => {
        const data = await this.api.fetch({page, orderBy, search});

        if (resp.status === 200) {
            AppDispatcher.dispatch({
                type: StoreActions.FETCH_UNITS,
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

const unitOfMeasureActions = new UnitofMeasureActions();
export default unitOfMeasureActions;