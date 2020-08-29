import TCache from "@onlyheartt9/t-cache";
import {
  HTTP_CACHE_DATA,
  LOCALSTORAGE_TYPE_DEFAULT,
  LOCALSTORAGE_TYPE,
  FOREVER_TYPE,
  LOCALSTORAGE_KEY,
} from "../shared/constants";
import utils from "../utils";
import { getOptionByUrl, getOptionKey } from "../option";

const cacheData = new TCache(HTTP_CACHE_DATA);
const defaultKeepTime = 3000;

//封装缓存key值
export function getCacheKey({ url, params, data, method }) {
  if (utils.isString(params)) {
    params = parse(params);
  }
  if (utils.isString(data)) {
    data = parse(data);
  }
  params = sortParams(params);
  data = sortParams(data);
  return utils.stringify({
    url,
    params,
    data,
    method,
  });
}

//解析缓存key值获取内容
export function parseCacheKey(cacheKey) {
  return utils.parse(cacheKey);
}

export function getLocalCacheKey(cacheKey) {
  return LOCALSTORAGE_KEY + cacheKey;
}

export function sortParams(params) {
  let newParams = {};
  let keys = Object.keys(params);
  keys.sort();
  keys.forEach((key) => {
    newParams[key] = params[key];
  });
  return newParams;
}

//设置http接口返回值缓存
export function setHttpCache(cacheKey, value) {
  let createTime = new Date() - 0;
  let { url, method } = parseCacheKey(cacheKey);
  let option =getOptionByUrl({url, method}) ?? {}
  let { local = LOCALSTORAGE_TYPE_DEFAULT } = option;
  let cacheData = getTCacheByOption(option)
  let data = {
    createTime,
    data: value,
  };
  value._cacheKey = encodeCacheKey(cacheKey,createTime);
  if(utils.isNumber(option.keepTime)&&option.keepTime<0){
    return
  }
  cacheData.add(cacheKey, data);
  //判断配置存储位置，如果是storage则存储到storage一份
  if (local === LOCALSTORAGE_TYPE) {
    let localCacheKey = getLocalCacheKey(cacheKey);
    localStorage && localStorage.setItem(localCacheKey, utils.stringify(data));
  }
}

//对外cacheKey暴露加密方法
export function encodeCacheKey(cacheKey,createTime){
  let cacheKeyOpt = parseCacheKey(cacheKey);
  cacheKeyOpt.createTime = createTime;
  return utils.encode(utils.stringify(cacheKeyOpt));
}

//对外暴露的根据key值获取cache的方法
export function getCacheByKey(cacheKey){
  try {
    cacheKey = decodeCacheKey(cacheKey);
    return getHttpCacheByKey(cacheKey)
  } catch (error) {
    throw new Error("cacheKey is not exact");
  }
  
}
//对外cacheKey暴露解密方法
export function decodeCacheKey(cacheKey){
  let cacheKeyOpt =utils.parse(utils.decode(cacheKey));
  delete cacheKeyOpt.createTime;
  return utils.stringify(cacheKeyOpt);
}

//设置http接口返回值缓存
//TODO 需要修改
export function setStorgeHttpCache(cacheKey, value) {
  //let { url, method } = parseCacheKey(cacheKey);
  cacheData.add(cacheKey, value);
}

//TODO 暂时考虑更新缓存，删除过期缓存数据
export function updateHttpCache() {
  let keys = cacheData.getKeys();
  keys.forEach((key) => {
    let { createTime } = cacheData.get(name);
  });
}
//根据配置项，获取对应模块TCache
export function getTCacheByOption(option){
  let optKey = getOptionKey(option);
  return new TCache(optKey)
}

//删除指定缓存
export function deleteHttpCacahe(cacheKey) {
  let { url, method } = parseCacheKey(cacheKey);
  let option = getOptionByUrl({url, method}) ?? {};
  let tcache = getTCacheByOption(option);
  tcache.remove(cacheKey);
}

//获取http接口返回值缓存
export function getHttpCacheByKey(cacheKey) {
  let { url, method } = parseCacheKey(cacheKey);
  let option = getOptionByUrl({url, method}) ?? {};
  let cache = getTCacheByOption(option).get(cacheKey)
  let isExcludesUrlKey = isExcludesUrl(option, url);
  if (!cache || isExcludesUrlKey) {
    return null;
  }

  let { data, createTime } = cache;
  let { keepTime = defaultKeepTime } = option;
  if (keepTime !== FOREVER_TYPE&&keepTime!=="trigger") {
    keepTime = keepTime - 0;
    let timeDifference = new Date() - createTime;
    if (timeDifference > keepTime) {
      deleteHttpCacahe(cacheKey);
      return null;
    }
  }

  return utils.clone(data, {
    excludeAttrs: ["request"],
  });
}
//判断url是否为配置项中不包含的
export function isExcludesUrl(option, url) {
  let { excludes = [] } = option ?? {};
  let key = false;
  excludes.forEach((exUrl) => {
    if (exUrl === url || isRelation(url, exUrl)) {
      key = true;
    }
  });
  return key;
}

//是否两个url是否关联
export function isRelation(preciseUrl, fuzzyUrl) {
  return preciseUrl.startsWith(fuzzyUrl);
}
