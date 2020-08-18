import TCache from "@onlyheartt9/t-cache";
import { getOptionByUrl,isRelation } from "../instance/api";
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

//解析option选项，缓存到缓存类中
export function parseOption(option) {
        option = clone(option);
        let { type = PRECISE_TYPE, url } = option;
        if (!url) {
            throw new Error("option error:missing attribute 'url'")
        }
        removeOptionByUrl(url);
        let map = type === PRECISE_TYPE ? preciseMap : fuzzyMap;
        map.add(url, option);
}

export function removeOptionByUrl(url){
        preciseMap.remove(url);
        fuzzyMap.remove(url);
}

//克隆对象
function clone(obj,{excludeAttrs=[]}={}) {
    if (Array.isArray(obj)) {
        return parse(stringify(obj));
    };
    //
    for (let key in obj) {
        if (typeof obj[key] === "object"&&!excludeAttrs.includes(key)) {
            obj[key] = clone(obj[key]);
        }else if(typeof obj[key] === "function"){
            obj[key] = bind(obj[key],obj);
        }
    }
    return Object.assign({}, obj);
}

//克隆配置项
export function cloneOptions(options) {
    let newOpts = options.map(opt => {
        return clone(opt);
    })
    return newOpts;
}


//封装缓存key值
export function getCacheKey({ url, params, type }) {
    if (typeof params == "string") {
        params = parse(params);
    }
    params = sortParams(params);
    return stringify({
        url,
        params,
        type
    })
}

//解析缓存key值获取内容
export function parseCacheKey(cacheKey) {
    return parse(cacheKey);
}

export function getLocalCacheKey(cacheKey){
    return LOCALSTORAGE_KEY+cacheKey;
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
    let {url} = parseCacheKey(name);
    let {local=LOCALSTORAGE_TYPE_DEFAULT} = getOptionByUrl(url);
    let data = {
        createTime,
        data: value
    };
    cacheData.add(name,data);
    //判断配置存储位置，如果是storage则存储到storage一份
    if(local===LOCALSTORAGE_TYPE){
        let localCacheKey = getLocalCacheKey(name);
        localStorage&&localStorage.setItem(localCacheKey,stringify(data));
    }
}

//加码为字符串
function stringify(data){
    return JSON.stringify(data)
}
//解码为对象
function parse(data){
    return JSON.parse(data)
}

//设置http接口返回值缓存
export function setStorgeHttpCache(name, value) {
    window.tttt = cacheData;
    cacheData.add(name,value);
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
export function isExcludesUrl(option,url){
    let {excludes=[]} = option;
    let key = false;
    excludes.forEach(exUrl=>{
        if(exUrl===url||isRelation(url,exUrl)){
            key = true;
        }
    })
    return key;
};

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
    for(let key in b){
        let val = b[key];
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
    }
    return a;
  }


//获取http接口返回值缓存
export function getHttpCacheByKey(name) {
    let cData = cacheData.get(name);
    let { url } = parseCacheKey(name);
    let option = getOptionByUrl(url);
    let isExcludesUrlKey = isExcludesUrl(option,url);
    if (!cData||isExcludesUrlKey) {
        return null;
    }
   
    let { data, createTime } = cData;
    let { keepTime = defaultKeepTime } = option;
    if(keepTime!==FOREVER_TYPE){
        keepTime = keepTime-0;
        let timeDifference = new Date() - createTime;
        if (timeDifference > keepTime) {
            deleteHttpCacahe(name);
            return null;
        }
    }

    return clone(data,{
        excludeAttrs:["request"]
    });
};

export default {
    clone,
    parse,
    stringify,
    bind,
    extend
}