export const cacheKeys = [
  {
    param: {
      url: "http://jsonplaceholder.typicode.com/users",
      params: `{"a":1,"b":2}`,
      data: `{"c":3,"d":4}`,
      method: "post",
    },
    cacheKey:
      '{"url":"http://jsonplaceholder.typicode.com/users","params":{"a":1,"b":2},"data":{"c":3,"d":4},"method":"post"}',
    response: {
      data: { response: 1, response1: 2 },
      config: {
        url: "http://jsonplaceholder.typicode.com/users",
        method: "post",
      },
    },
  },
  {
    param: {
      url: "http://jsonplaceholder.typicode.com/test",
      params: { a: 11, b: 22 },
      data: { c: 33, d: 44 },
      method: "post",
    },
    cacheKey:
      '{"url":"http://jsonplaceholder.typicode.com/test","params":{"a":11,"b":22},"data":{"c":33,"d":44},"method":"post"}',
    response: {
      data: { response: 11, response1: 22 },
      config: {
        url: "http://jsonplaceholder.typicode.com/test",
        method: "post",
      },
    },
  },
  {
    param: {
      url: "http://jsonplaceholder.typicode.com/posts",
      params: { a: 55, b: 66 },
      data: { c: 77, d: 88 },
      method: "post",
    },
    cacheKey:
      '{"url":"http://jsonplaceholder.typicode.com/posts","params":{"a":55,"b":66},"data":{"c":77,"d":88},"method":"post"}',
    response: {
      data: { response: 99, response1: 0 },
      config: {
        url: "http://jsonplaceholder.typicode.com/posts",
        method: "post",
      },
    },
  },
  {
    param: { url: "/test1", params: {}, data: { c: 3, d: 4 }, method: "get" },
    cacheKey:
      '{"url":"/test1","params":{},"data":{"c":3,"d":4},"method":"get"}',
    response: {
      data: { response: 3, response1: 4 },
      config: {
        url: "/test1",
        method: "post",
      },
    },
  },
  {
    param: {
      url: "http://jsonplaceholder.typicode.com",
      params: { a: 1, b: 2 },
      data: {},
      method: "get",
    },
    cacheKey:
      '{"url":"http://jsonplaceholder.typicode.com","params":{"a":1,"b":2},"data":{},"method":"get"}',
    response: {
      data: { response: 5, response1: 6 },
      config: {
        url: "http://jsonplaceholder.typicode.com",
        method: "get",
      },
    },
  },
];
