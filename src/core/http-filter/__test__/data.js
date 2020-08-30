export const options = [
  {
    url: "http://jsonplaceholder.typicode.com",
    type: "fuzzy",
    method: "post",
    keepTime: "trigger",
    excludeAttrs: ["firstName", "lastName"],
    excludes: ["http://jsonplaceholder.typicode.com/users"],
  },
  {
    url: "http://jsonplaceholder.typicode.com/users",
    type: "precise",
    method: "post",
    keepTime: 5000,
    excludeAttrs: ["firstName", "lastName"],
  },
  {
    url: "",
    type: "fuzzy",
    method: "all",
    keepTime: "forever",
    excludes: ["http://jsonplaceholder.typicode.com/users"],
  },
];
