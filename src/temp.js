//OPTIONS参数模板
let options = [{
  url: "/aaa",
  type: "precise" || "fuzzy",
  keepTime: 3 || "forever"||"trigger",
  local: "defalut" || "storage",
  excludes: ["/aaa/bbb"],
  excludeAttrs:["name"],
  dataFormat:()=>{},
  method: "get"
}]
