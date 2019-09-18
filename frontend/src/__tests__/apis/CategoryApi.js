import CategoryApi from "../../actions/apis/CategoryApi";
import mockAxios from "axios";

const api = new CategoryApi("/api/categories");

it("test category list", async () => {
  // arrange
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      status: 200,
      data: {
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            name: "category_0"
          },
          {
            id: 2,
            name: "category_1"
          },
          {
            id: 3,
            name: "category_3"
          }
        ]
      }
    })
  );

  // act
  const resp = await api.fetch({ orderBy: "name" });

  // assert
  expect(resp.count).toBe(3);
  expect(resp.results.length).toBe(3);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(
    "/api/categories?page=1&ordering=name&search="
  );
});

it('test create category', () => {

  let thenFn = jest.fn();
  let catchFn = jest.fn();
  let data = {name: 'cat_0'};

  api.create(data).then(thenFn).catch(catchFn);

  expect(mockAxios.post).toHaveBeenCalledWith('/api/categories', JSON.stringify(data));
  expect(mockAxios.post).toHaveBeenCalledTimes(1);

  const resp = {
    status: 201,
    data: {
      id: 1,
      name: data.name
    }
  }
});
