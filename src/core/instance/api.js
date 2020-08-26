import {
  getOptionByKey,
  setOptions,
  removeOptionByKey,
  setOption,
} from "../option/index";
import { getCacheByKey } from "../cache/index";
import utils from "../utils";
import { http } from "../http-filter/index";

//设置debugger模式
function setDebugger() {
  http.debug = true;
}

//THCache 方法绑定
export function apiMixin(THCache) {
  let api = {
    removeOptionByKey,
    getCacheByKey,
    getOptionByKey,
    setOptions,
    setOption,
    setDebugger,
  };
  Object.keys(api).forEach((key) => {
    THCache.prototype[key] = function(...e){
      return api[key].call(this,...e);
    };
  });
}
