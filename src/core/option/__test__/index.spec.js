import {
  getOptionByKey,
  getOptionByUrl,
  getFuzzyOptionByUrl,
  setOptions,
  setOption,
  removeOptionByKey,
  parseOption,
  getOptionKey,
  parseOptionKey,
  cloneOptions,
} from "../index";
import { options } from "./data";
import { FUZZY_TYPE } from "../../shared/constants";
//TODO checkOption 未exprot的方法

test("测试setOption and getOptionByUrl", () => {
  setOptions(options);
  options.forEach((option) => {
    let params = { url: option.url, method: option.method };
    if (option.type === FUZZY_TYPE) {
      params.url += "/aaa";
    }
    let opt = getOptionByUrl(params);
    expect(opt).toEqual(option);
  });
});

test("测试setOption and getOptionByKey", () => {
  options.forEach((option) => {
    let optKey = setOption(option);
    expect(getOptionByKey(optKey)).toEqual(option);
  });
});

test("测试setOptions and getOptionByKey and removeOptionByKey", () => {
  let optKeys = setOptions(options);
  optKeys.forEach((optKey, index) => {
    expect(getOptionByKey(optKey)).toEqual(options[index]);
    removeOptionByKey(optKey);
    expect(getOptionByKey(optKey)).toEqual(null);
  });
});

test("测试parseOption and getOptionByKey", () => {
  options.forEach((option) => {
    let optKey = parseOption(option);
    expect(getOptionByKey(optKey)).toEqual(option);
  });
});

test("测试parseOptionKey and getOptionKey", () => {
  options.forEach((option) => {
    let optKey = getOptionKey(option);
    expect(parseOptionKey(optKey)).toEqual({
      url: option.url,
      type: option.type,
      method: option.method,
    });
  });
});

test("测试cloneOptions", () => {
  expect(cloneOptions(options)).toEqual(options);
});
