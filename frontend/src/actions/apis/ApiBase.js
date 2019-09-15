import axios from 'axios';

class ApiBase {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    generalError(status) {
        throw Error(`A ${status} error occurred while processing request.`);
    }

    fetch = async ({page=1, orderBy='', search='', filter=''} = {}) => {
        try {
            const url = `${this.baseUrl}?page=${page}&ordering=${orderBy}&search=${search}${filter}`;
            const resp = await axios.get(url);
            if (resp.status === 200) {
                return resp.data;
            }
            this.generalError(resp.status);
        }
        catch(err) {
            console.error(err);
        }
    }

    single = async id => {
        try {
            const url = `${this.baseUrl}/${id}`;
            const resp = await axios.get(url);
            if (resp.status === 200) {
                return resp.data;
            }
            this.generalError(resp.status);
        }
        catch(err) {
            console.error(err);
        }
    }

    create = async (data) => {
        try {
            const resp = await axios.post(this.baseUrl, JSON.stringify(data));
            if (resp.status === 201) {
                return resp.data;
            }
            this.generalError(resp.status);
        }
        catch(err) {
            console.error(err);
        }
    }

    update = async (id, data) => {
        try {
            const url = `${this.baseUrl}/${id}`;
            const resp = await axios.put(url, JSON.stringify(data));
            if (resp.status === 200) {
                return resp.data;
            }
            this.generalError(resp.status);
        }
        catch(err) {
            console.error(err);
        }
    }

    delete = async id => {
        try {
            const url = `${this.baseUrl}/${id}`;
            const resp = await axios.delete(url);
            if (resp.status === 204) {
                return true;
            }
            this.generalError(resp.status);
        }
        catch(err) {
            console.error(err);
        }
    }
}

export default ApiBase;