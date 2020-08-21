import TCache from "@onlyheartt9/t-cache";
import utils, { parseOption,removeOptionByUrl,isExcludesUrl } from "../utils/index";
import {
    PRECISE_OPTIONS,
    FUZZY_OPTIONS,
} from "../shared/constants";
import {http} from "../http-filter/index";

const preciseMap = new TCache(PRECISE_OPTIONS);
const fuzzyMap = new TCache(FUZZY_OPTIONS);

//通过url获取配置项
export function getOptionByUrl(url,method="all") {
    let opt = (preciseMap.get(url)??{})[method];
    if (!opt) {
        let options = [];
        fuzzyMap.getKeys().forEach(key => {
            let option = fuzzyMap.get(key);
            // if (isRelation(url,option.url)&&!isExcludesUrl(option,url)&&isSameMethod(option.method,method)){
            if (isRelation(url,key)){
                option["_key"] = key;
                options.push(option);
            };
        });
        options.sort((a,b)=>{
           return b._key.length-a._key.length
        });

        opt = getOption(options,method,url);
        console.log("getOption",opt)
    }

    //模糊查询，根据请求类型，请求路径获取配置项，如果没有则使用all类型配置
    function getOption(options,method,url){
        let option = null;
        for (let i = 0;i<options.length;i++) {
            option = options[i][method]??options[i]["all"];
            if(!!option&&!isExcludesUrl(option,url)){
                break;
            }
        }
        return option;
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
//设置单个option
function setOption(option){
    parseOption(option);
}


//设置debugger模式
function setDebgger(){
    http.debug = true;
}

//THCache 方法绑定
export function apiMixin(THCache) {
    let api = {
        getOptionByUrl,
        setOptions,
        removeOptionByUrl,
        setOption,
        setDebgger
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