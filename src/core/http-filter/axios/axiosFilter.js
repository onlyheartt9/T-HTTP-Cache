import { getCacheKeyOptByRequest, getCacheKeyOptByResponse } from "./axiosUtils"
import { commonRequestFilter, commonResponseFilter, urlLoading, removeUrlLoading } from "../index";
import utils from "../../utils/index";
import { METHODS } from "../../shared/constants"
import { getCacheKey } from "../../cache";
/**
 *
 * @param {*} axios  axios
 */
export function registerAxiosFilter(axios) {
  axios = createNewAxios(axios);
  //对create方法扩展，注册绑定httpFilter
  let create = axios.create;
  axios.create = (...e) => {
    let axiosObj = create(...e);
    axiosObj = createNewAxios(axiosObj);
    registerHttpFilter(axiosObj);
    return axiosObj;
  };
  registerHttpFilter(axios);
  return axios;
}

//对axios代理拦截处理，判断请求是否有缓存，返回缓存或请求接口
function createNewAxios(axios) {
  let newAxios = function (...e) {
    return axios(...e).catch(data => {
      return axiosFilter(data);
    })
  };
  utils.extend(newAxios, axios, axios)
  return newAxios;
}

//对axios对象的方法进行过滤，筛选配置过的url
function registerHttpFilter(axiosObj) {
  //请求拦截,如果有缓存或者接口正在请求，则抛出异常，在extendMethods方法中处理
  registerRequestFilter(axiosObj);

  //响应拦截
  registerResponseFilter(axiosObj);

  extendMethods(axiosObj);
}

//方法扩展
function extendMethods(axiosObj) {
  const methods = METHODS;
  methods.forEach(methodName => {
    let method = axiosObj[methodName];
    axiosObj[methodName] = function (...e) {
      return method(...e).catch((data) => {
        return axiosFilter(data);
      });
    }
  });
}
//根据请求配置判断是否有缓存，如果没有执行callback函数
/**
 *
 * @param {*} data 警告，或者为缓存数据
 */
function axiosFilter(data) {
  let { config, type,_isCache=false} = data;
  if (!_isCache) {
    let err = data;
    //urlLoading中清除该请求
    if(config){
      let cacheKey = utils.compose(getCacheKeyOptByRequest,getCacheKey)(config);
      removeUrlLoading(cacheKey);
    }
    return new Promise((resolve, reject) => {
      reject(err);
    })
  } else if (type === "loading") {
    return new Promise(() => { });
  } else {
    //上述条件都不是的话，type为缓存值
    return new Promise((resolve) => {
      resolve(type)
    });
  }
}
//注册全局的axios request filter拦截
function registerRequestFilter(axiosObj) {
  let reqNum = -1;
  reqNum = axiosObj.interceptors.request.use(function (config) {
    const cacheKeyOpt = getCacheKeyOptByRequest(config);
    let type = commonRequestFilter(cacheKeyOpt);
    if (type === "no option" || type === "normal") {
      return config;
    } else {
      throw { config, type ,_isCache:true};
    }
  });
  let handlers = axiosObj.interceptors.request.handlers;
  let length = handlers.length;
  for (let num = 0; num < length; num++) {
    if (!handlers[num] || num === reqNum) {
      continue;
    }
    let handler = handlers[num];
    handlers[num] = null;
    handlers.push(handler);
  }
}

//注册全局的axios response filter拦截
function registerResponseFilter(axiosObj) {
  let resNum = -1;
  let responseUse = axiosObj.interceptors.response.use;
  axiosObj.interceptors.response.use = function (...e) {
    let num = responseUse.call(this, ...e)
    if (e[e.length - 1] !== "useFilter") {
      axiosObj.interceptors.response.eject(resNum);
      useFilter();
    }
    return num;
  }
  useFilter();


  function useFilter() {
    resNum = axiosObj.interceptors.response.use((response) => {
      const cacheKeyOpt = getCacheKeyOptByResponse(response);
      let ret = commonResponseFilter(cacheKeyOpt, response);
      if(ret ==="no option"){
        return response;
      }
      return ret
    }, "useFilter");
  }
}
