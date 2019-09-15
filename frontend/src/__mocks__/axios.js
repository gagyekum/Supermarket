export default {
    get: jest.fn(() => Promise.resolve({ status: 200, data: {}})),
    post: jest.fn((payload) => Promise.resolve({data: {}})),
    put: jest.fn((id, payload) => Promise.resolve({data: {}})),
    delete: jest.fn((id) => Promise.resolve({data: {}}))
}