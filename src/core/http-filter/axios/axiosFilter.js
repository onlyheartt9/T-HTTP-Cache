import {
  getHttpConfigByResponse,
  getHttpConfigByResponse,
} from "./axiosUtils";
import {
  commonRequestFilter,
  commonResponseFilter,
  urlLoading,
  removeUrlLoading,
} from "../index";
import utils from "../../utils/index";
import { METHODS } from "../../shared/constants";
import { getCacheKey } from "../../cache";

//请求filter对应下标
let reqNum = -1;
//响应filter对应下标
let resNum = -1;

/**
 * 封装axios入口方法
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
    return axios(...e).catch((data) => {
      return axiosFilter(data, axios);
    });
  };
  utils.extend(newAxios, axios, axios);
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
  methods.forEach((methodName) => {
    let method = axiosObj[methodName];
    axiosObj[methodName] = function (...e) {
      return method(...e).catch((data) => {
        return axiosFilter(data, axiosObj);
      });
    };
  });
}
/**
 *根据请求配置判断是否有缓存，如果没有执行callback函数
 * @param {*} data 警告，或者为缓存数据
 */
function axiosFilter(data, axiosObj) {
  let { config, type, promise, response, _isCache = false } = data;
  if (!_isCache) {
    let err = data;
    //urlLoading中清除该请求
    if (config) {
      let cacheKey = utils.compose(
        getHttpConfigByResponse,
        getCacheKey
      )(config);
      removeUrlLoading(cacheKey);
    }
    return new Promise((resolve, reject) => {
      reject(err);
    });
  } else if (type === "loading") {
    return promise((res) => {
      return dealResponse({ axiosObj, res });
    });
  } else {
    let res = dealResponse({ axiosObj, response });
    return new Promise((resolve) => {
      resolve(res);
    });
  }
}

//手动执行axios中的response拦截方法
function dealResponse({ axiosObj, response }) {
  let res = response;
  let handlers = axiosObj.interceptors.response.handlers;
  handlers.forEach((handler, index) => {
    if (handler?.fulfilled && index !== resNum) {
      res = handler.fulfilled(response);
    }
  });
  return res;
}

//注册全局的axios request filter拦截
function registerRequestFilter(axiosObj) {
  reqNum = axiosObj.interceptors.request.use(function (config) {
    const httpConfig = getHttpConfigByResponse(config);
    let { type, response, promise } = commonRequestFilter(httpConfig);
    if (type === "no option" || type === "normal") {
      return config;
    } else {
      throw { config, promise, type, response, _isCache: true };
    }
  });
  //将方法置顶
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
  //修改response.use方法，对reject做判断
  let responseUse = axiosObj.interceptors.response.use;
  axiosObj.interceptors.response.use = function (...e) {
    if (e[1]) {
      let rejcet = e[1];
      e[1] = function (error) {
        if (!error._isCache) {
          return rejcet(error);
        }
        return Promise.reject(error);
      };
    }
    let num = responseUse.call(this, ...e);
    return num;
  };
  //注册response filter方法
  resNum = axiosObj.interceptors.response.use((response) => {
    const httpConfig = getHttpConfigByResponse(response);
    let ret = commonResponseFilter(httpConfig, response);
    if (ret.msg === "no option") {
      return response;
    }
    return ret.res;
  });
  //将方法置顶
  let handlers = axiosObj.interceptors.response.handlers;
  let length = handlers.length;
  for (let num = 0; num < length; num++) {
    if (!handlers[num] || num === resNum) {
      continue;
    }
    let handler = handlers[num];
    handlers[num] = null;
    handlers.push(handler);
  }
}
