import AppDispatcher from '../dispatcher';
import { StoreActions } from '../constants';
import axios from 'axios';


class UnitofMeasureActions {
    handleCreate = async (name, symbol = null) => {
        const resp = await axios.post('/api/units', {name, symbol});

        if (resp.status === 201) {
            AppDispatcher.dispatch({
                type: StoreActions.CREATE_UNIT,
                entity: {
                    id: resp.data.id,
                    name: resp.data.name,
                    symbol: resp.data.symbol,
                }
            });
        }
    }

    handleUpdate = async (id, name, symbol = null) => {
        const resp = await axios.put(`/api/units/${id}`, {name, symbol});

        if (resp.status === 200) {
            AppDispatcher.dispatch({
                type: StoreActions.UPDATE_UNIT,
                id,
                entity: {
                    name,
                    symbol
                }
            });
        }
    }

    handleDelete = async (id) => {
        const resp = await axios.delete(`/api/units/${id}`);

        if (resp.status === 204) {
            AppDispatcher.dispatch({
                type: StoreActions.DELETE_UNIT,
                id
            });
        }
    }

    handleFetch = async (term = '', orderBy = 'name') => {
        const resp = await axios.get(`/api/units?ordering=${orderBy}&search=${term}`);

        if (resp.status === 200) {
            AppDispatcher.dispatch({
                type: StoreActions.FETCH_UNITS,
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

const unitOfMeasureActions = new UnitofMeasureActions();
export default unitOfMeasureActions;