/*!
 * THCache.js v1.0.3
 * (c) 2020-2020 Challenger
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.THCache = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /*!
   * TCache.js v1.0.3
   * (c) 2020-2020 Challenger
   * Released under the MIT License.
   */

  var cache = Object.create(null);
  function getCacheData(moduleName){
      if(!cache[moduleName]){
          cache[moduleName] = {};
      }
      return cache[moduleName]
  }

  function initMixin(TCache){
      TCache.prototype._init=function(moduleName){
          //设置模块名
          this._moduleName = moduleName;
          TCache._moduleNames.push(moduleName);

          //获取模块对应缓存对象
          this.cacheData = getCacheData(moduleName);
      };
  }

  //添加
  function add(name,value){
      if ( value === void 0 ) { value=null; }

      this.cacheData[name] = value;
  }
  //设置
  function set(name,value){
      if ( value === void 0 ) { value=null; }

      this.cacheData[name] = value;
  }
  //获取
  function get(name){
      var data = this.cacheData[name];
      // if(!this.cacheData.hasOwnProperty(name)){
      //     throw new Error("not have attribute:"+name)
      // }
      return data?data:null;
  }
  //删除指定属性
  function remove(name){
      delete this.cacheData[name];
  }
  //重置所有属性
  function reset(){
      var this$1 = this;

      Object.keys(this.cacheData).forEach(function (key){
          delete this$1.cacheData[key];
      });
  }
  //获取所有key值
  function getKeys(){
     return Object.keys(this.cacheData)
  }


  function initApi(TCache){
      var api  = {
          add: add,
          set: set,
          get: get,
          remove: remove,
          reset: reset,
          getKeys: getKeys
      };
      Object.keys(api).forEach(function (key){
          TCache.prototype[key] = api[key];
      });
  }

  var MODULE_NAME = "defaultCache";

  function TCache(moduleName) {
      if ( moduleName === void 0 ) { moduleName=MODULE_NAME; }

      this._init(moduleName);
  }

  initMixin(TCache);
  initApi(TCache);

  TCache._index = 0;
  TCache._moduleNames =[];

  // Window.TCache = TCache;
  TCache.version = '1.0.3';

  var index_common = TCache;

  var HTTP_CACHE_DATA = "_http-cache-data";
  var PRECISE_OPTIONS = "precise-options";
  var FUZZY_OPTIONS = "fuzzy-options";
  var PRECISE_TYPE = "precise";
  var FOREVER_TYPE = "forever";
  var LOCALSTORAGE_TYPE = "storage";
  var LOCALSTORAGE_TYPE_DEFAULT = "default";
  var LOCALSTORAGE_KEY = "HTTP-CACHE:";
  var METHODS = ["get", "post", 'delete', 'head', 'options', 'put', 'patch'];

  var urlLoading = [];
  /**
   * 统一请求拦截，
   * 对axios,ajax等之类的请求处理统一方法
   * 返回四个状态，没有配置项，接口正在执行，没有缓存，有缓存
   * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
   */

  function commonRequestFilter(cacheKeyOpt) {
    var url = cacheKeyOpt.url,
        method = cacheKeyOpt.method;
    var option = getOptionByUrl(url, method);
    var cacheKey = getCacheKey(cacheKeyOpt);
    var response = getHttpCacheByKey(cacheKey);

    if (!option) {
      return "no option";
    } //接口正在执行，不进行再次请求


    if (urlLoading.includes(cacheKey)) {
      return "loading";
    } else if (!response) {
      //没有缓存，请求接口
      urlLoading.push(cacheKey);
      return "normal";
    } else {
      //有缓存，返回缓存
      return response;
    }
  }
  /**
   * 统一响应拦截，
   * 对axios,ajax等之类的响应处理统一方法
   * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
   * @param {*} response 需要存储的返回值
   */

  function commonResponseFilter(cacheKeyOpt, response) {
    var url = cacheKeyOpt.url;
    var opt = getOptionByUrl(url);
    var cacheKey = getCacheKey(cacheKeyOpt);

    if (opt && opt.dataFormat) {
      response = opt.dataFormat(response);
    }

    if (urlLoading.includes(cacheKey)) {
      setHttpCache(cacheKey, response);
      urlLoading.splice(urlLoading.indexOf(cacheKey), 1);
    }
    return response;
  }

  var preciseMap = new index_common(PRECISE_OPTIONS);
  var fuzzyMap = new index_common(FUZZY_OPTIONS); //通过url获取配置项

  function getOptionByUrl(url) {
    var _preciseMap$get;

    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "all";
    var opt = ((_preciseMap$get = preciseMap.get(url)) !== null && _preciseMap$get !== void 0 ? _preciseMap$get : {})[method];

    if (!opt) {
      var options = [];
      fuzzyMap.getKeys().forEach(function (key) {
        var option = fuzzyMap.get(key); // if (isRelation(url,option.url)&&!isExcludesUrl(option,url)&&isSameMethod(option.method,method)){

        if (isRelation(url, key)) {
          option["_key"] = key;
          options.push(option);
        }
      });
      options.sort(function (a, b) {
        return b._key.length - a._key.length;
      });
      opt = getOption(options, method, url);
      console.log("getOption", opt);
    } //模糊查询，根据请求类型，请求路径获取配置项，如果没有则使用all类型配置


    function getOption(options, method, url) {
      var option = null;

      for (var i = 0; i < options.length; i++) {
        var _options$i$method;

        option = (_options$i$method = options[i][method]) !== null && _options$i$method !== void 0 ? _options$i$method : options[i]["all"];

        if (!!option && !isExcludesUrl(option, url)) {
          break;
        }
      }

      return option;
    }

    return opt;
  } //是否两个url是否关联

  function isRelation(preciseUrl, fuzzyUrl) {
    return preciseUrl.startsWith(fuzzyUrl);
  } //设置filter配置项

  function setOptions(options) {
    options.forEach(function (opt) {
      setOption(opt);
    });
  } //设置单个option


  function setOption(option) {
    parseOption(option);
  } //设置debugger模式


  function setDebgger() {
  } //THCache 方法绑定


  function apiMixin(THCache) {
    var api = {
      getOptionByUrl: getOptionByUrl,
      setOptions: setOptions,
      removeOptionByUrl: removeOptionByUrl,
      setOption: setOption,
      setDebgger: setDebgger
    };
    Object.keys(api).forEach(function (key) {
      THCache.prototype[key] = function () {
        // if (key !== "bindHttp" && !http.type) {
        //     throw new Error("not bind axios");
        // }
        var data = api[key].apply(api, arguments);
        return key === "bindHttp" ? data : utils.clone(data);
      };
    });
  }

  var cacheData = new index_common(HTTP_CACHE_DATA);
  var defaultKeepTime = 3000; //默认保存时间

  var preciseMap$1 = new index_common(PRECISE_OPTIONS);
  var fuzzyMap$1 = new index_common(FUZZY_OPTIONS);
  var toString = Object.prototype.toString; //解析option选项，缓存到缓存类中

  function parseOption(option) {
    var _map$get;

    option = clone(option);
    var _option = option,
        _option$type = _option.type,
        type = _option$type === void 0 ? PRECISE_TYPE : _option$type,
        url = _option.url,
        _option$method = _option.method,
        method = _option$method === void 0 ? "all" : _option$method;
    method = method.toLowerCase();

    if (!url && url !== "") {
      throw new Error("option error:missing attribute 'url'");
    }

    removeOptionByUrl(url);
    var map = type === PRECISE_TYPE ? preciseMap$1 : fuzzyMap$1;
    var opt = (_map$get = map.get(url)) !== null && _map$get !== void 0 ? _map$get : {};
    opt[method] = option;
    map.add(url, opt);
  }
  function removeOptionByUrl(url) {
    preciseMap$1.remove(url);
    fuzzyMap$1.remove(url);
  } //克隆配置项

  function getCacheKey(_ref) {
    var url = _ref.url,
        params = _ref.params,
        data = _ref.data,
        method = _ref.method;

    if (isString(params)) {
      params = parse(params);
    }

    if (isString(data)) {
      data = parse(data);
    }

    params = sortParams(params);
    data = sortParams(data);
    return stringify({
      url: url,
      params: params,
      data: data,
      method: method
    });
  } //解析缓存key值获取内容

  function parseCacheKey(cacheKey) {
    return parse(cacheKey);
  }
  function getLocalCacheKey(cacheKey) {
    return LOCALSTORAGE_KEY + cacheKey;
  }
  function sortParams(params) {
    var newParams = {};
    var keys = Object.keys(params);
    keys.sort();
    keys.forEach(function (key) {
      newParams[key] = params[key];
    });
    return newParams;
  } // 提取url中的解析字符串

  function setHttpCache(name, value) {
    var _getOptionByUrl;

    var createTime = new Date() - 0;

    var _parseCacheKey = parseCacheKey(name),
        url = _parseCacheKey.url;

    var _ref2 = (_getOptionByUrl = getOptionByUrl(url)) !== null && _getOptionByUrl !== void 0 ? _getOptionByUrl : {},
        _ref2$local = _ref2.local,
        local = _ref2$local === void 0 ? LOCALSTORAGE_TYPE_DEFAULT : _ref2$local;

    var data = {
      createTime: createTime,
      data: value
    };
    cacheData.add(name, data); //判断配置存储位置，如果是storage则存储到storage一份

    if (local === LOCALSTORAGE_TYPE) {
      var localCacheKey = getLocalCacheKey(name);
      localStorage && localStorage.setItem(localCacheKey, stringify(data));
    }
  } //设置http接口返回值缓存

  function setStorgeHttpCache(name, value) {
    cacheData.add(name, value);
  } //TODO 暂时考虑更新缓存，删除过期缓存数据

  function deleteHttpCacahe(name) {
    cacheData.remove(name);
  } //判断url是否为配置项中不包含的

  function isExcludesUrl(option, url) {
    var _ref3 = option !== null && option !== void 0 ? option : {},
        _ref3$excludes = _ref3.excludes,
        excludes = _ref3$excludes === void 0 ? [] : _ref3$excludes;

    var key = false;
    excludes.forEach(function (exUrl) {
      if (exUrl === url || isRelation(url, exUrl)) {
        key = true;
      }
    });
    return key;
  }

  function getHttpCacheByKey(name) {
    var _getOptionByUrl2;

    var cData = cacheData.get(name);

    var _parseCacheKey2 = parseCacheKey(name),
        url = _parseCacheKey2.url,
        method = _parseCacheKey2.method;

    var option = (_getOptionByUrl2 = getOptionByUrl(url, method)) !== null && _getOptionByUrl2 !== void 0 ? _getOptionByUrl2 : {};
    var isExcludesUrlKey = isExcludesUrl(option, url);

    if (!cData || isExcludesUrlKey) {
      return null;
    }

    var data = cData.data,
        createTime = cData.createTime;
    var _option$keepTime = option.keepTime,
        keepTime = _option$keepTime === void 0 ? defaultKeepTime : _option$keepTime;

    if (keepTime !== FOREVER_TYPE) {
      keepTime = keepTime - 0;
      var timeDifference = new Date() - createTime;

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
  }
  //克隆对象

  function clone(obj) {
    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$excludeAttrs = _ref4.excludeAttrs,
        excludeAttrs = _ref4$excludeAttrs === void 0 ? [] : _ref4$excludeAttrs,
        _ref4$attrs = _ref4.attrs,
        attrs = _ref4$attrs === void 0 ? {} : _ref4$attrs;

    if (isString(obj) || isNumber(obj)) {
      return obj;
    }

    if (isArray(obj)) {
      return parse(stringify(obj));
    }

    for (var key in obj) {
      if (isPlainObject(obj[key]) && !excludeAttrs.includes(key)) {
        obj[key] = clone(obj[key]);
      } else if (isFunction(obj[key])) {
        obj[key] = bind(obj[key], obj);
      }
    }

    return Object.assign({}, obj, attrs);
  } //加码为字符串


  function stringify(data) {
    return JSON.stringify(data);
  } //解码为对象


  function parse(data) {
    return JSON.parse(data);
  } //克隆一个方法


  function bind(fn, thisArg) {
    return function wrap() {
      var arguments$1 = arguments;

      var args = new Array(arguments.length);

      for (var i = 0; i < args.length; i++) {
        args[i] = arguments$1[i];
      }

      return fn.apply(thisArg, args);
    };
  }
  /**
   * 将b对象的属性继承到a上面
   */

  function extend(a, b, thisArg) {
    for (var key in b) {
      var val = b[key];

      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }

    return a;
  } //是否为普通对象


  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  } //是否为undefined


  function isUndefined(val) {
    return typeof val === 'undefined';
  } //是否为数组


  function isArray(val) {
    return toString.call(val) === '[object Array]';
  } //对象合并


  function merge()
  /* obj1, obj2, obj3, ... */
  {
    var arguments$1 = arguments;

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
      forEach(arguments$1[i], assignValue);
    }

    return result;
  } //是否为字符串


  function isString(val) {
    return typeof val === 'string';
  } //是否为数字


  function isNumber(val) {
    return typeof val === 'number';
  } //是否为方法


  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    } // Force an array if not already something iterable


    if (_typeof(obj) !== 'object') {
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
  } //函数组合


  var compose = function compose() {
    var arguments$1 = arguments;

    for (var _len = arguments.length, _ref5 = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref5[_key] = arguments$1[_key];
    }

    var first = _ref5[0],
        others = _ref5.slice(1);

    return function () {
      var ret = first.apply(void 0, arguments);
      others.forEach(function (fn) {
        ret = fn(ret);
      });
      return ret;
    };
  };

  var utils = {
    clone: clone,
    parse: parse,
    stringify: stringify,
    bind: bind,
    extend: extend,
    isPlainObject: isPlainObject,
    merge: merge,
    isArray: isArray,
    isUndefined: isUndefined,
    forEach: forEach,
    isString: isString,
    isNumber: isNumber,
    isFunction: isFunction,
    compose: compose
  };

  function initMixin$1(THCache) {
    THCache.prototype._init = function (options) {
      //初始化配置项
      this.setOptions(options); //对localStorage中数据添加入缓存中

      initHttpCache();
    };
  } //对localStorage中数据添加入缓存中

  function initHttpCache() {
    if (!localStorage) {
      return;
    }

    Object.keys(localStorage).forEach(function (key) {
      var data = localStorage.getItem(key);
      key = isHttpLocalStorage(key);

      if (key) {
        setStorgeHttpCache(key, utils.parse(data));
      }
    });
  } //判断该值是否为存储在storage中的key值，并返回解析后的cacheKey


  function isHttpLocalStorage(key) {
    var k = key.startsWith(LOCALSTORAGE_KEY);

    if (k) {
      k = key.replace(LOCALSTORAGE_KEY, "");
    }

    return k;
  }

  function THCache(options) {
    //bind(http);
    options && this._init(options);
  }

  initMixin$1(THCache);
  apiMixin(THCache);

  //解析axios request参数，返回可以封装cachekey的参数格式
  function getCacheKeyOptByRequest(config) {
    var url = config.url,
        _config$params = config.params,
        params = _config$params === void 0 ? {} : _config$params,
        _config$data = config.data,
        data = _config$data === void 0 ? {} : _config$data,
        method = config.method;
    return {
      url: url,
      params: params,
      method: method,
      data: data
    };
  } //解析axios response参数，返回可以封装cachekey的参数格式

  function getCacheKeyOptByResponse(response) {
    var _response$config = response.config,
        url = _response$config.url,
        _response$config$para = _response$config.params,
        params = _response$config$para === void 0 ? {} : _response$config$para,
        _response$config$data = _response$config.data,
        data = _response$config$data === void 0 ? {} : _response$config$data,
        method = _response$config.method;
    return {
      url: url,
      params: params,
      method: method,
      data: data
    };
  }

  /**
   * 
   * @param {*} axios  axios
   */

  function registerAxiosFilter(axios) {
    axios = createNewAxios(axios); //对create方法扩展，注册绑定httpFilter

    var create = axios.create;

    axios.create = function () {
      var axiosObj = create.apply(void 0, arguments);
      axiosObj = createNewAxios(axiosObj);
      registerHttpFilter(axiosObj);
      return axiosObj;
    };

    registerHttpFilter(axios);
    return axios;
  } //对axios代理拦截处理，判断请求是否有缓存，返回缓存或请求接口

  function createNewAxios(axios) {
    var newAxios = function newAxios() {
      return axios.apply(void 0, arguments)["catch"](function (data) {
        return axiosFilter(data);
      });
    };

    utils.extend(newAxios, axios, axios);
    return newAxios;
  } //对axios对象的方法进行过滤，筛选配置过的url


  function registerHttpFilter(axiosObj) {
    //请求拦截,如果有缓存或者接口正在请求，则抛出异常，在extendMethods方法中处理
    registerRequestFilter(axiosObj); //响应拦截

    registerResponseFilter(axiosObj);
    extendMethods(axiosObj);
  } //方法扩展


  function extendMethods(axiosObj) {
    var methods = METHODS;
    methods.forEach(function (methodName) {
      var method = axiosObj[methodName];

      axiosObj[methodName] = function () {
        return method.apply(void 0, arguments)["catch"](function (data) {
          return axiosFilter(data);
        });
      };
    });
  } //根据请求配置判断是否有缓存，如果没有执行callback函数

  /**
   * 
   * @param {*} data 警告，或者为缓存数据
   */


  function axiosFilter(data) {
    var config = data.config,
        _data$type = data.type,
        type = _data$type === void 0 ? null : _data$type;

    if (!type) {
      var err = data;
      return new Promise(function (resolve, reject) {
        reject(err);
      });
    } else if (type === "loading") {
      return new Promise(function () {});
    } else {
      //上述条件都不是的话，type为缓存值
      return new Promise(function (resolve) {
        resolve(type);
      });
    }
  } //注册全局的axios request filter拦截


  function registerRequestFilter(axiosObj) {
    var reqNum = -1;
    reqNum = axiosObj.interceptors.request.use(function (config) {
      console.log("config", config);
      var cacheKeyOpt = getCacheKeyOptByRequest(config);
      var type = commonRequestFilter(cacheKeyOpt);

      if (type === "no option" || type === "normal") {
        return config;
      } else {
        throw {
          config: config,
          type: type
        };
      }
    });
    var handlers = axiosObj.interceptors.request.handlers;
    var length = handlers.length;

    for (var num = 0; num < length; num++) {
      if (!handlers[num] || num === reqNum) {
        continue;
      }

      var handler = handlers[num];
      handlers[num] = null;
      handlers.push(handler);
    }
  } //注册全局的axios response filter拦截


  function registerResponseFilter(axiosObj) {
    var resNum = -1;
    var responseUse = axiosObj.interceptors.response.use;

    axiosObj.interceptors.response.use = function () {
      var arguments$1 = arguments;

      for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
        e[_key] = arguments$1[_key];
      }

      var num = responseUse.call.apply(responseUse, [this].concat(e));

      if (e[e.length - 1] !== "useFilter") {
        axiosObj.interceptors.response.eject(resNum);
        useFilter();
      }

      return num;
    };

    useFilter();

    function useFilter() {
      resNum = axiosObj.interceptors.response.use(function (response) {
        var cacheKeyOpt = getCacheKeyOptByResponse(response);
        response = commonResponseFilter(cacheKeyOpt, response);
        return response;
      }, "useFilter");
      console.log(resNum);
    }
  }

  function TBindAxios(axios) {
    axios = registerAxiosFilter(axios);
    return axios;
  }

  // import TCache from "@onlyheartt9/t-cache"
  window.TBindAxios = TBindAxios;

  return THCache;

})));
