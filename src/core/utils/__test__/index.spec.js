import { getCacheKey } from "../index"

test('测试getCacheKey', () => {
  let parmas = { url: "/test", params: { a: 1, b: 2 }, data: { c: 3, d: 4 }, method: "post" };
  console.log(getCacheKey(parmas))
  //expect(getCacheKey(parmas)).toBe("");
})
