//OPTIONS参数模板
let options = [{
  url: "/aaa",
  type: "precise" || "fuzzy",
  keepTime: 3000 || "forever"||"trigger"||-1,
  local: "defalut" || "storage",
  excludes: ["/aaa/bbb"],
  excludeAttrs:["name"]||"all",
  dataFormat:()=>{},
  method: "get"||"all"
}]
