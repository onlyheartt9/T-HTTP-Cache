import utils from "../index";

describe("test utils api", () => {
  it("测试clone", () => {
    let data = {
      aaa: 1,
      bbb: 2,
    };
    let ret = {
      aaa: 1,
      bbb: 2,
      ccc: 3,
    };
    expect(
      utils.clone(data, {
        excludeAttrs: ["aaa"],
        attrs: {
          ccc: 3,
        },
      })
    ).toEqual(ret);
  });


  it("测试clone", () => {
    let data = {
      aaa: 1,
      bbb: 2
    };
    let ret = {
      aaa: 1,
      bbb: 2,
      ccc: 3
    };
    expect(
      utils.clone(data, {
        excludeAttrs: ["aaa"],
        attrs: {
          ccc: 3,
        },
      })
    ).toEqual(ret);
  });

  it("测试stringify and parse", () => {
    let data = {
      stringify: 1,
      parse: 1
    }
    let str = utils.stringify(data);
    expect(utils.parse(str)).toEqual(data);
  })
  it("测试extend", () => {
    let data = {
      extend: 1
    }
    let params = {
      extend1: "extend1"
    };
    let ret = {
      extend: 1,
      extend1: "extend1",
    };
    expect(utils.extend(data, params)).toEqual(ret);
  })

  it("测试isPlainObject", () => {
    expect(utils.isPlainObject(undefined)).toEqual(false);
    expect(utils.isPlainObject(null)).toEqual(false);
    expect(utils.isPlainObject({})).toEqual(true);
    expect(utils.isPlainObject("")).toEqual(false);
    expect(utils.isPlainObject(123)).toEqual(false);
    expect(utils.isPlainObject([])).toEqual(false);
    expect(utils.isPlainObject(() => { })).toEqual(false);

  })

  it("测试isUndefined", () => {
    expect(utils.isUndefined(undefined)).toEqual(true);
    expect(utils.isUndefined(null)).toEqual(false);
    expect(utils.isUndefined({})).toEqual(false);
    expect(utils.isUndefined("")).toEqual(false);
    expect(utils.isUndefined(123)).toEqual(false);
    expect(utils.isUndefined([])).toEqual(false);
    expect(utils.isUndefined(() => { })).toEqual(false);

  })
  it("测试isArray", () => {
    expect(utils.isArray(undefined)).toEqual(false);
    expect(utils.isArray(null)).toEqual(false);
    expect(utils.isArray({})).toEqual(false);
    expect(utils.isArray("")).toEqual(false);
    expect(utils.isArray(123)).toEqual(false);
    expect(utils.isArray([])).toEqual(true);
    expect(utils.isArray(() => { })).toEqual(false);

  })

  it("测试isString", () => {
    expect(utils.isString(undefined)).toEqual(false);
    expect(utils.isString(null)).toEqual(false);
    expect(utils.isString({})).toEqual(false);
    expect(utils.isString("")).toEqual(true);
    expect(utils.isString(123)).toEqual(false);
    expect(utils.isString([])).toEqual(false);
    expect(utils.isString(() => { })).toEqual(false);
  })

  it("测试isNumber", () => {
    expect(utils.isNumber(undefined)).toEqual(false);
    expect(utils.isNumber(null)).toEqual(false);
    expect(utils.isNumber({})).toEqual(false);
    expect(utils.isNumber("")).toEqual(false);
    expect(utils.isNumber(123)).toEqual(true);
    expect(utils.isNumber([])).toEqual(false);
    expect(utils.isNumber(() => { })).toEqual(false);
  })
  it("测试isFunction", () => {
    expect(utils.isFunction(undefined)).toEqual(false);
    expect(utils.isFunction(null)).toEqual(false);
    expect(utils.isFunction({})).toEqual(false);
    expect(utils.isFunction("")).toEqual(false);
    expect(utils.isFunction(123)).toEqual(false);
    expect(utils.isFunction([])).toEqual(false);
    expect(utils.isFunction(() => { })).toEqual(true);
  })
  it("测试encode and decode", () => {
    let data = "encode";
    let index = utils.encode(data);

    expect(utils.decode(index)).toEqual(data);
  })

  it("测试compose", () => {
    let fn1 = (param) => param + 1;
    let fn2 = (param) => param + 2;

    expect(utils.compose(fn1, fn2)(0)).toBe(3);
    expect(utils.compose(fn1, fn2)(2)).toBe(5);
    expect(utils.compose(fn1, fn2)(5)).toBe(8);
  })




})
