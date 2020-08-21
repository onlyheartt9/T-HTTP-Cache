import TCache from "@onlyheartt9/t-cache";
import { getOptionByUrl, isRelation } from "../instance/api";
import {
  HTTP_CACHE_DATA,
  PRECISE_OPTIONS,
  FUZZY_OPTIONS,
  PRECISE_TYPE,
  FUZZY_TYPE,
  FOREVER_TYPE,
  LOCALSTORAGE_TYPE,
  LOCALSTORAGE_TYPE_DEFAULT,
  LOCALSTORAGE_KEY,
} from "../shared/constants"


const cacheData = new TCache(HTTP_CACHE_DATA);
const defaultKeepTime = 3000;//默认保存时间
const preciseMap = new TCache(PRECISE_OPTIONS);
const fuzzyMap = new TCache(FUZZY_OPTIONS);
var toString = Object.prototype.toString;

//解析option选项，缓存到缓存类中
export function parseOption(option) {
  option = clone(option);
  let { type = PRECISE_TYPE, url, method = "all" } = option;
  method = method.toLowerCase();
  if (!url && url !== "") {
    throw new Error("option error:missing attribute 'url'")
  }
  removeOptionByUrl(url);
  let map = type === PRECISE_TYPE ? preciseMap : fuzzyMap;
  let opt = map.get(url) ?? {};
  opt[method] = option;
  map.add(url, opt);
}

export function removeOptionByUrl(url) {
  preciseMap.remove(url);
  fuzzyMap.remove(url);
}


//克隆配置项
export function cloneOptions(options) {
  let newOpts = options.map(opt => {
    return clone(opt);
  })
  return newOpts;
}


//封装缓存key值
export function getCacheKey({ url, params, data, method }) {
  if (isString(params)) {
    params = parse(params);
  }
  if (isString(data)) {
    data = parse(data);
  }
  params = sortParams(params);
  data = sortParams(data);
  return stringify({
    url,
    params,
    data,
    method
  })
}

//解析缓存key值获取内容
export function parseCacheKey(cacheKey) {
  return parse(cacheKey);
}

export function getLocalCacheKey(cacheKey) {
  return LOCALSTORAGE_KEY + cacheKey;
}

export function sortParams(params) {
  let newParams = {};
  let keys = Object.keys(params);
  keys.sort();
  keys.forEach(key => {
    newParams[key] = params[key];
  })
  return newParams;
}

// 提取url中的解析字符串
export function urlParamHash(url) {
  let params = {}, h;
  if (url.indexOf("?") < 0) {
    return {};
  }
  let hash = url.slice(url.indexOf("?") + 1).split('&');
  for (let i = 0; i < hash.length; i++) {
    h = hash[i].split("=");
    params[h[0]] = h[1];
  }
  return params;
}

//设置http接口返回值缓存
export function setHttpCache(name, value) {
  let createTime = new Date() - 0;
  let { url } = parseCacheKey(name);
  let { local = LOCALSTORAGE_TYPE_DEFAULT } = getOptionByUrl(url) ?? {};
  let data = {
    createTime,
    data: value
  };
  cacheData.add(name, data);
  //判断配置存储位置，如果是storage则存储到storage一份
  if (local === LOCALSTORAGE_TYPE) {
    let localCacheKey = getLocalCacheKey(name);
    localStorage && localStorage.setItem(localCacheKey, stringify(data));
  }
}


//设置http接口返回值缓存
export function setStorgeHttpCache(name, value) {
  cacheData.add(name, value);
}

//TODO 暂时考虑更新缓存，删除过期缓存数据
export function updateHttpCache() {
  let keys = cacheData.getKeys();
  keys.forEach((key) => {
    let { createTime } = cacheData.get(name);

  })
}


//删除指定缓存
export function deleteHttpCacahe(name) {
  cacheData.remove(name);
}

//判断url是否为配置项中不包含的
export function isExcludesUrl(option, url) {
  let { excludes = [] } = option ?? {};
  let key = false;
  excludes.forEach(exUrl => {
    if (exUrl === url || isRelation(url, exUrl)) {
      key = true;
    }
  })
  return key;
};



//获取http接口返回值缓存
export function getHttpCacheByKey(name) {
  let cData = cacheData.get(name);
  let { url, method } = parseCacheKey(name);
  let option = getOptionByUrl(url, method) ?? {};
  let isExcludesUrlKey = isExcludesUrl(option, url);
  if (!cData || isExcludesUrlKey) {
    return null;
  }

  let { data, createTime } = cData;
  let { keepTime = defaultKeepTime } = option;
  if (keepTime !== FOREVER_TYPE) {
    keepTime = keepTime - 0;
    let timeDifference = new Date() - createTime;
    if (timeDifference > keepTime) {
      deleteHttpCacahe(name);
      return null;
    }
  }

  return clone(data, {
    excludeAttrs: ["request"],
    attrs: {
      isCache: true
    }
  });
};


////////////////////////////////////////////////export default//////////////////////////////////////////////////////////
//克隆对象
function clone(obj, { excludeAttrs = [], attrs = {} } = {}) {
  if (isString(obj) || isNumber(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return parse(stringify(obj));
  };
  //
  for (let key in obj) {
    if (isPlainObject(obj[key]) && !excludeAttrs.includes(key)) {
      obj[key] = clone(obj[key]);
    } else if (isFunction(obj[key])) {
      obj[key] = bind(obj[key], obj);
    }
  }
  return Object.assign({}, obj, attrs);
}



//加码为字符串
function stringify(data) {
  return JSON.stringify(data)
}
//解码为对象
function parse(data) {
  return JSON.parse(data)
}



//克隆一个方法
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/**
 * 将b对象的属性继承到a上面
 */
function extend(a, b, thisArg) {
  for (let key in b) {
    let val = b[key];
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }
  return a;
}




//是否为普通对象
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

//是否为undefined
function isUndefined(val) {
  return typeof val === 'undefined';
}

//是否为数组
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

//对象合并
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
//是否为字符串
function isString(val) {
  return typeof val === 'string';
}
//是否为数字
function isNumber(val) {
  return typeof val === 'number';
}
//是否为方法
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

//函数组合
const compose = (...[first, ...others]) => (...args) => {
  let ret = first(...args);
  others.forEach(fn => {
    ret = fn(ret);
  })
  return ret;
}

export default {
  clone,
  parse,
  stringify,
  bind,
  extend,
  isPlainObject,
  merge,
  isArray,
  isUndefined,
  forEach,
  isString,
  isNumber,
  isFunction,
  compose
}
