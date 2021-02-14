import { getOptionByUrl } from "../option/index";
import { getCacheKey, setHttpCache, getHttpCacheByKey } from "../cache/index";
import { TRIGGER_TYPE } from "../shared/constants";
import utils from "../utils";
export default class HttpConfig {
  constructor(option) {
    this.init(option);
    this.key = getCacheKey(this.data);
    //触发参数过滤方法，将参数过滤
    this.trigger;
    this.cacheKey = getCacheKey(this.data);
  }

  init({ url, method, params, data }){
    this.data = { url, method, params, data };
  }

  get url (){
    return this.data.url;
  }
  get option() {
    if (this._option !== undefined) {
      return this._option;
    }
    const { url, method } = this.data;
    this._option = getOptionByUrl({ url, method });
    return this._option;
  }
  get trigger() {
    if (this._trigger) {
      return this._trigger;
    }
    return (
      this.option &&
      (this._trigger = dealCacheKeyOption(this.option, this.data))
    );
  }
  get response() {
    if (!this._response) {
      this._response = getHttpCacheByKey(this.cacheKey);
    }
    return this._response;
  }
}

//根据配置项excludeAttrs，处理cacheKeyOpt,返回是否为trigger操作
export function dealCacheKeyOption(option = {}, cacheKeyOpt) {
  if (!option) {
    console.log(option, cacheKeyOpt);
  }

  const { params, data } = cacheKeyOpt;
  let trigger = data._trigger || params._trigger;
  let { excludeAttrs = [] } = option;
  if (option.keepTime === TRIGGER_TYPE) {
    utils.isArray(excludeAttrs) &&
      !excludeAttrs.includes("_trigger") &&
      excludeAttrs.push("_trigger");
  }
  if (utils.isArray(excludeAttrs)) {
    excludeAttrs.forEach((attr) => {
      delete cacheKeyOpt.params[attr];
      delete cacheKeyOpt.data[attr];
    });
  } else if (excludeAttrs === "all") {
    cacheKeyOpt.params = {};
    cacheKeyOpt.data = {};
  }

  return trigger;
}
