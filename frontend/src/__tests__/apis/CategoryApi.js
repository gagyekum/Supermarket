import CategoryApi from '../../actions/apis/CategoryApi';
import mockAxios from 'axios';

const api = new CategoryApi('/api/categories');

it('calls axios and return category list', async () => {
    // arrange
    mockAxios.get.mockImplementationOnce(() => 
        Promise.resolve({
            status: 200,
            data: {
                count: 0,
                next: null,
                previous: null,
                results: []
            }
        })
    );

    // act
    const resp = await api.fetch({orderBy: 'name'});

    // assert
    expect(resp.count).toBe(0);
    expect(resp.results.length).toBe(0);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith('/api/categories?page=1&ordering=name&search=');
});