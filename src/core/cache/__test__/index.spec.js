import {
  getCacheKey,
  parseCacheKey,
  getLocalCacheKey,
  sortParams,
  encodeCacheKey,
  decodeCacheKey,
  isRelation,
  isExcludesUrl,
  setHttpCache,
  getCacheByKey,
  getTCacheByOption,
  deleteHttpCacahe,
} from "../index";
import { LOCALSTORAGE_KEY, PRECISE_TYPE } from "../../shared/constants";
import { options } from "../../option/__test__/data.js";
import { setOptions, getOptionByUrl } from "../../option/index";
import { cacheKeys } from "./data";


test("测试setHttpCache and getCacheByKey and getTCacheByOption and deleteHttpCacahe", () => {
  setOptions(options);
  cacheKeys.forEach((key) => {
    setHttpCache(key.cacheKey, key.response);
    let cacheKey = encodeCacheKey(key.cacheKey, new Date() - 0);
    let option = getOptionByUrl(key.param);
    if (option) {
      let tcache = getTCacheByOption(option);
      expect(tcache.getKeys().includes(key.cacheKey)).toEqual(true);
    }
    expect(getCacheByKey(cacheKey)).toEqual(key.response);
    deleteHttpCacahe(key.cacheKey);
    expect(getCacheByKey(cacheKey)).toEqual(null);
  });
});

test("测试getCacheKey", () => {
  cacheKeys.forEach((key) => {
    expect(getCacheKey(key.param)).toBe(key.cacheKey);
  });
});

test("测试parseCacheKey", () => {
  cacheKeys.forEach((key) => {
    expect(parseCacheKey(key.cacheKey)).toEqual(key.param);
  });
});

test("测试getLocalCacheKey", () => {
  cacheKeys.forEach((key) => {
    expect(getLocalCacheKey(key.cacheKey)).toEqual(
      LOCALSTORAGE_KEY + key.cacheKey
    );
  });
});

test("测试sortParams", () => {
  cacheKeys.forEach((key) => {
    expect(sortParams(key.param.params)).toEqual(key.param.params);
  });
});
//TODO
test("测试encodeCacheKey and decodeCacheKey", () => {
  cacheKeys.forEach((key) => {
    let createTime = new Date() - 0;
    let cachekey = encodeCacheKey(key.cacheKey, createTime);
    expect(decodeCacheKey(cachekey)).toBe(key.cacheKey);
  });
});
test("测试isExcludesUrl", () => {
  //let options = Object.create(optionData.options);
  options.forEach((option) => {
    if (option.type === PRECISE_TYPE) {
      return;
    }
    expect(isExcludesUrl(option, option.excludes[0])).toEqual(true);
  });
});
test("测试isRelation", () => {
  options.forEach((option) => {
    if (option.type === PRECISE_TYPE) {
      return;
    }
    expect(isRelation(option.excludes[0], option.url)).toEqual(true);
  });
});
