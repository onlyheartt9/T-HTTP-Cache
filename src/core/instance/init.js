import utils,{setStorgeHttpCache} from "../utils";
import {
    LOCALSTORAGE_KEY,
} from "../shared/constants";
export function initMixin(THCache){
    THCache.prototype._init=function(options){
        //初始化配置项
        this.setOptions(options);
        //对localStorage中数据添加入缓存中
        initHttpCache();
    }
}

//对localStorage中数据添加入缓存中
function initHttpCache(){
    if(!localStorage){
        return
    }
    Object.keys(localStorage).forEach(key=>{
        let data = localStorage.getItem(key);
        key = isHttpLocalStorage(key);
        if(key){
            setStorgeHttpCache(key,utils.parse(data));
        }
    })
}

//判断该值是否为存储在storage中的key值，并返回解析后的cacheKey
function isHttpLocalStorage(key){
    let k = key.startsWith(LOCALSTORAGE_KEY);
    if(k){
        k = key.replace(LOCALSTORAGE_KEY,"");
    }
    return k;
}