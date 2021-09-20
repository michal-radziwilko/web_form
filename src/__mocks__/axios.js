const mockResponse = {
  data: {
    validation_status: true,
    status: 200,
  },
};
export default {
  get: jest.fn().mockResolvedValue(mockResponse),
};
