import TCache from "@onlyheartt9/t-cache";
import utils, { parseOption,removeOptionByUrl } from "../utils/index";
import { bindHttp } from "../http-filter/index";
import {
    PRECISE_OPTIONS,
    FUZZY_OPTIONS,
} from "../shared/constants"
const preciseMap = new TCache(PRECISE_OPTIONS);
const fuzzyMap = new TCache(FUZZY_OPTIONS);

//通过url获取配置项
export function getOptionByUrl(url) {
    let opt = preciseMap.get(url);
    if (!opt) {
        let length = 0;
        fuzzyMap.getKeys().forEach(key => {
            if (isRelation(url, key) && key.length > length) {
                opt = fuzzyMap.get(key);
                length = key.length;
            };
        })
    }
    return opt;
}
//是否两个url是否关联
export function isRelation(preciseUrl, fuzzyUrl) {
    return preciseUrl.startsWith(fuzzyUrl);
}

//设置filter配置项
function setOptions(options) {
    options.forEach(opt=>{
        setOption(opt);
    })
}
//
function setOption(option){
    parseOption(option);
}

//THCache 方法绑定
export function apiMixin(THCache) {
    let api = {
        getOptionByUrl,
        setOptions,
        bindHttp,
        removeOptionByUrl,
        setOption
    };

    Object.keys(api).forEach(key => {
        THCache.prototype[key] = (...e) => {
            // if (key !== "bindHttp" && !http.type) {
            //     throw new Error("not bind axios");
            // }
            let data = api[key](...e);
            return key === "bindHttp" ? data : utils.clone(data);
        };
    })
};