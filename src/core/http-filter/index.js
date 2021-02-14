import { getOptionByUrl } from "../option/index";
import { getCacheKey, setHttpCache, getHttpCacheByKey } from "../cache/index";
import { TRIGGER_TYPE } from "../shared/constants";
import HttpConfig from "../http-config";
import utils from "../utils";
export const http = {
  lib: null,
  type: "",
  debug: false,
};
export const urlLoading = {};

export function debug(callback) {
  if (http.debug) {
    console.log("=========T-HTTP-CAHCE=========");
    callback();
  }
}


/**
 * 统一请求拦截，
 * 对axios,ajax等之类的请求处理统一方法
 * 返回四个状态，没有配置项，接口正在执行，没有缓存，有缓存
 * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
 */
export function commonRequestFilter(httpConfig) {
  const { url,option } = httpConfig;
  debug(() => {
    console.log("RequestFilter:", {
      url,
      option,
    });
  });
  if (!option) {
    return { type: "no option" };
  }
  const { trigger, cacheKey, response } = httpConfig;

  //接口正在执行，不进行再次请求,这部分逻辑有点复杂，因为外界参数无法传入，callback处理res
  if (hasUrl(cacheKey)) {
    let promise = () => new Promise(() => {});
    if (option.loadType === "todo") {
      promise = (callback) =>
        new Promise((resolve) => {
          urlLoading[cacheKey].push((res) => {
            res = callback(res);
            resolve(res);
          });
        });
    }
    return { type: "loading", promise };
  } else if ((option.keepTime === TRIGGER_TYPE && trigger) || !response) {
    //没有缓存，请求接口
    urlLoading[cacheKey] = [];
    return { type: "normal" };
  } else {
    //有缓存，返回缓存
    return { type: "cache", response };
  }
}

/**
 * 统一响应拦截，
 * 对axios,ajax等之类的响应处理统一方法
 * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
 * @param {*} response 需要存储的返回值
 */
export function commonResponseFilter(httpConfig, response) {
  const ret = {
    msg: "response",
    opt: null,
    res: null,
  };
  const { option } = httpConfig;
  if (!option) {
    ret.msg = "no option";
    return ret;
  }
  const { cacheKey } = httpConfig;
  if (option && option.dataFormat) {
    response = option.dataFormat(response);
  }
  if (hasUrl(cacheKey)) {
    setHttpCache(cacheKey, response);
    dealUrlLoading(cacheKey, response);
    removeUrlLoading(cacheKey);
  }
  Object.assign(ret, {
    res: response,
    opt: option,
  });
  return ret;
}

//删除url状态值
export function removeUrlLoading(cacheKey) {
  if (hasUrl(cacheKey)) {
    delete urlLoading[cacheKey];
  }
}

//对之前loading状态的方法执行
export function dealUrlLoading(cacheKey, response) {
  urlLoading[cacheKey].forEach((resolve) => {
    resolve(response);
  });
}

//url是否正在执行
export function hasUrl(cacheKey) {
  return urlLoading.hasOwnProperty(cacheKey);
}
