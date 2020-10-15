export const options = [
  {
    url: "http://jsonplaceholder.typicode.com",
    type: "fuzzy",
    method: "post",
    keepTime: "trigger",
    excludeAttrs: "all",
    loadType:"todo",
    excludes: ["http://jsonplaceholder.typicode.com/users"],
  },
  {
    url: "http://jsonplaceholder.typicode.com/users",
    type: "precise",
    method: "post",
    keepTime: 5000,
    loadType:"todo",
    excludeAttrs: ["firstName", "lastName"],
  },
  {
    url: "http://jsonplaceholder.typicode.com/test",
    type: "precise",
    method: "post",
    keepTime: "trigger",
    excludeAttrs: "all",
  },
  {
    url: "http://jsonplaceholder.typicode.com/posts",
    type: "precise",
    method: "post",
    keepTime: -1,
    local:"storage",
    excludeAttrs: "all",
  },
  {
    url: "",
    type: "precise",
    method: "all",
    keepTime: "forever",
    excludes: ["http://jsonplaceholder.typicode.com/users"]
  },
];
