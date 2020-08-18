/*!
 * THCache.js v1.0.2
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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var typeMethods = {
    get: {
      request: function request(e) {
        var _e = _slicedToArray(e, 2),
            url = _e[0],
            _e$1$params = _e[1].params,
            params = _e$1$params === void 0 ? {} : _e$1$params;

        params = Object.assign({}, params, urlParamHash(url));
        url = url.split("?")[0];
        return {
          url: url,
          params: params,
          type: "get"
        };
      },
      response: function response(_response) {
        var _config$params;

        var config = _response.config;
        var type = config.method;
        var params = (_config$params = config.params) !== null && _config$params !== void 0 ? _config$params : {};
        var url = config.url;
        params = Object.assign({}, params, urlParamHash(url));
        url = url.split("?")[0];
        return {
          url: url,
          params: params,
          type: type
        };
      },
      optRequest: function optRequest(config) {
        var url = config.url,
            _config$params2 = config.params,
            params = _config$params2 === void 0 ? {} : _config$params2;
        params = Object.assign({}, params, urlParamHash(url));
        url = url.split("?")[0];
        return {
          url: url,
          params: params,
          type: "get"
        };
      }
    },
    post: {
      request: function request(e) {
        var _e2 = _slicedToArray(e, 2),
            url = _e2[0],
            _e2$ = _e2[1],
            params = _e2$ === void 0 ? {} : _e2$;

        return {
          url: url,
          params: params,
          type: "post"
        };
      },
      response: function response(_response2) {
        var _config$data;

        var config = _response2.config;
        var type = config.method;
        return {
          url: config.url,
          params: (_config$data = config.data) !== null && _config$data !== void 0 ? _config$data : {},
          type: type
        };
      },
      optRequest: function optRequest(config) {
        var url = config.url,
            _config$data2 = config.data,
            data = _config$data2 === void 0 ? {} : _config$data2;
        return {
          url: url,
          params: data,
          type: "post"
        };
      }
    }
  }; //解析axios request参数，返回可以封装cachekey的参数格式

  function getCacheKeyOptByRequest(e, type) {
    return typeMethods[type].request(e);
  } //解析axios response参数，返回可以封装cachekey的参数格式

  function getCacheKeyOptByResponse(response) {
    var config = response.config;
    var type = config.method;
    return typeMethods[type].response(response);
  }

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
    var newAxios = function newAxios(config) {
      var arguments$1 = arguments;

      for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        e[_key - 1] = arguments$1[_key];
      }

      var _config$method = config.method,
          method = _config$method === void 0 ? "get" : _config$method;
      var cacheKeyOpt = typeMethods[method].optRequest(config);
      console.log("cacheKeyOpt", cacheKeyOpt);
      return axiosFilter(cacheKeyOpt, function () {
        return axios.apply(void 0, [config].concat(e));
      });
    };

    utils.extend(newAxios, axios, axios);
    return newAxios;
  } //对axios对象的方法进行过滤，筛选配置过的url


  function registerHttpFilter(axiosObj) {
    //请求拦截,暂无处理
    axiosObj.interceptors.request.use(function (config) {
      return config;
    }); //响应拦截

    registerResponseFilter(axiosObj);
    extendMethods(axiosObj);
  } //方法扩展


  function extendMethods(axiosObj) {
    var methods = ["get", "post"];
    methods.forEach(function (methodName) {
      var method = axiosObj[methodName];

      axiosObj[methodName] = function () {
        var arguments$1 = arguments;

        for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          e[_key2] = arguments$1[_key2];
        }

        var cacheKeyOpt = getCacheKeyOptByRequest(e, methodName);
        return axiosFilter(cacheKeyOpt, function () {
          return method.apply(void 0, e);
        });
      };
    });
  } //根据请求配置判断是否有缓存，如果没有执行callback函数

  /**
   * 
   * @param {*} cacheKeyOpt {url,params,type}
   * @param {*} callback 函数
   */


  function axiosFilter(cacheKeyOpt, callback) {
    var type = commonRequestFilter(cacheKeyOpt);

    if (type === "no option" || type === "normal") {
      return callback();
    } else if (type === "loading") {
      return new Promise(function () {});
    } else {
      //上述条件都不是的话，type为缓存值
      return new Promise(function (resolve) {
        resolve(type);
      });
    }
  }

  function registerResponseFilter(axiosObj) {
    var repNum = -1;
    var responseUse = axiosObj.interceptors.response.use;

    axiosObj.interceptors.response.use = function () {
      var arguments$1 = arguments;

      for (var _len3 = arguments.length, e = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        e[_key3] = arguments$1[_key3];
      }

      var num = responseUse.call.apply(responseUse, [this].concat(e));

      if (e[e.length - 1] !== "useFilter") {
        axiosObj.interceptors.response.eject(repNum);
        useFilter();
      }

      return num;
    };

    useFilter();

    function useFilter() {
      repNum = axiosObj.interceptors.response.use(function (response) {
        console.log("responseeeeeee", response);
        var cacheKeyOpt = getCacheKeyOptByResponse(response);
        commonResponseFilter(cacheKeyOpt, response);
        return response;
      }, "useFilter");
    }
  }

  var http = {
    lib: null,
    type: ""
  };
  var urlLoading = []; //对axios方法进行扩展封装并返回

  function bindHttp(obj) {
    var type = getObjType(obj);

    if (type === "axios") {
      http.lib = axios;
      http.type = type;
      obj = registerAxiosFilter(obj);
    }

    console.log("bindHttp", obj);
    console.log("bindHttp", _typeof(obj));
    return obj;
  }
  /**
   * 统一请求拦截，
   * 对axios,ajax等之类的请求处理统一方法
   * 返回四个状态，没有配置项，接口正在执行，没有缓存，有缓存
   * @param {*} cacheKeyOpt {type:请求类型,url:请求路径（get请求路径不带参数，需要去除）,params:参数}
   */

  function commonRequestFilter(cacheKeyOpt) {
    var url = cacheKeyOpt.url;
    var option = getOptionByUrl(url);

    if (!option) {
      return "no option";
    }

    var cacheKey = getCacheKey(cacheKeyOpt);
    var response = getHttpCacheByKey(cacheKey); //接口正在执行，不进行再次请求

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
    var cacheKey = getCacheKey(cacheKeyOpt);

    if (urlLoading.includes(cacheKey)) {
      setHttpCache(cacheKey, response);
      urlLoading.splice(urlLoading.indexOf(cacheKey), 1);
    }
  } //获取需要绑定的对象类型

  function getObjType(obj) {
    if (!!obj.interceptors) {
      return "axios";
    }
  }

  var HTTP_CACHE_DATA = "_http-cache-data";
  var PRECISE_OPTIONS = "precise-options";
  var FUZZY_OPTIONS = "fuzzy-options";
  var PRECISE_TYPE = "precise";
  var FOREVER_TYPE = "forever";
  var LOCALSTORAGE_TYPE = "storage";
  var LOCALSTORAGE_TYPE_DEFAULT = "default";
  var LOCALSTORAGE_KEY = "HTTP-CACHE:";

  var preciseMap = new index_common(PRECISE_OPTIONS);
  var fuzzyMap = new index_common(FUZZY_OPTIONS); //通过url获取配置项

  function getOptionByUrl(url) {
    var opt = preciseMap.get(url);

    if (!opt) {
      var length = 0;
      fuzzyMap.getKeys().forEach(function (key) {
        if (isRelation(url, key) && key.length > length) {
          opt = fuzzyMap.get(key);
          length = key.length;
        }
      });
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
  } //


  function setOption(option) {
    parseOption(option);
  } //THCache 方法绑定


  function apiMixin(THCache) {
    var api = {
      getOptionByUrl: getOptionByUrl,
      setOptions: setOptions,
      bindHttp: bindHttp,
      removeOptionByUrl: removeOptionByUrl,
      setOption: setOption
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
  var fuzzyMap$1 = new index_common(FUZZY_OPTIONS); //解析option选项，缓存到缓存类中

  function parseOption(option) {
    option = clone(option);
    var _option = option,
        _option$type = _option.type,
        type = _option$type === void 0 ? PRECISE_TYPE : _option$type,
        url = _option.url;

    if (!url) {
      throw new Error("option error:missing attribute 'url'");
    }

    removeOptionByUrl(url);
    var map = type === PRECISE_TYPE ? preciseMap$1 : fuzzyMap$1;
    map.add(url, option);
  }
  function removeOptionByUrl(url) {
    preciseMap$1.remove(url);
    fuzzyMap$1.remove(url);
  } //克隆对象

  function clone(obj) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$excludeAttrs = _ref.excludeAttrs,
        excludeAttrs = _ref$excludeAttrs === void 0 ? [] : _ref$excludeAttrs;

    if (Array.isArray(obj)) {
      return parse(stringify(obj));
    }

    for (var key in obj) {
      if (_typeof(obj[key]) === "object" && !excludeAttrs.includes(key)) {
        obj[key] = clone(obj[key]);
      } else if (typeof obj[key] === "function") {
        obj[key] = bind(obj[key], obj);
      }
    }

    return Object.assign({}, obj);
  } //克隆配置项

  function getCacheKey(_ref2) {
    var url = _ref2.url,
        params = _ref2.params,
        type = _ref2.type;

    if (typeof params == "string") {
      params = parse(params);
    }

    params = sortParams(params);
    return stringify({
      url: url,
      params: params,
      type: type
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

  function urlParamHash(url) {
    var params = {},
        h;

    if (url.indexOf("?") < 0) {
      return {};
    }

    var hash = url.slice(url.indexOf("?") + 1).split('&');

    for (var i = 0; i < hash.length; i++) {
      h = hash[i].split("=");
      params[h[0]] = h[1];
    }

    return params;
  } //设置http接口返回值缓存

  function setHttpCache(name, value) {
    var createTime = new Date() - 0;

    var _parseCacheKey = parseCacheKey(name),
        url = _parseCacheKey.url;

    var _getOptionByUrl = getOptionByUrl(url),
        _getOptionByUrl$local = _getOptionByUrl.local,
        local = _getOptionByUrl$local === void 0 ? LOCALSTORAGE_TYPE_DEFAULT : _getOptionByUrl$local;

    var data = {
      createTime: createTime,
      data: value
    };
    cacheData.add(name, data); //判断配置存储位置，如果是storage则存储到storage一份

    if (local === LOCALSTORAGE_TYPE) {
      var localCacheKey = getLocalCacheKey(name);
      localStorage && localStorage.setItem(localCacheKey, stringify(data));
    }
  } //加码为字符串

  function stringify(data) {
    return JSON.stringify(data);
  } //解码为对象


  function parse(data) {
    return JSON.parse(data);
  } //设置http接口返回值缓存


  function setStorgeHttpCache(name, value) {
    window.tttt = cacheData;
    cacheData.add(name, value);
  } //TODO 暂时考虑更新缓存，删除过期缓存数据

  function deleteHttpCacahe(name) {
    cacheData.remove(name);
  } //判断url是否为配置项中不包含的

  function isExcludesUrl(option, url) {
    var _option$excludes = option.excludes,
        excludes = _option$excludes === void 0 ? [] : _option$excludes;
    var key = false;
    excludes.forEach(function (exUrl) {
      if (exUrl === url || isRelation(url, exUrl)) {
        key = true;
      }
    });
    return key;
  }

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
  } //获取http接口返回值缓存


  function getHttpCacheByKey(name) {
    var cData = cacheData.get(name);

    var _parseCacheKey2 = parseCacheKey(name),
        url = _parseCacheKey2.url;

    var option = getOptionByUrl(url);
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
      excludeAttrs: ["request"]
    });
  }
  var utils = {
    clone: clone,
    parse: parse,
    stringify: stringify,
    bind: bind,
    extend: extend
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

  // import TCache from "@onlyheartt9/t-cache"

  return THCache;

})));
