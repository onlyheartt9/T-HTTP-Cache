import TCache from "@onlyheartt9/t-cache";
import utils from "../utils/index";
import { isExcludesUrl } from "../cache/index";
import {
  TRIGGER_TYPE,
  FOREVER_TYPE,
  PRECISE_OPTIONS,
  FUZZY_OPTIONS,
  PRECISE_TYPE,
  FUZZY_TYPE,
} from "../shared/constants";
const preciseMap = new TCache(PRECISE_OPTIONS);
const fuzzyMap = new TCache(FUZZY_OPTIONS);
const defaultKeepTime = 3000; //默认保存时间

//对外暴露的api，根据标识获取cache
export function getOptionByKey(optKey) {
  try {
    optKey = decodeOptionKey(optKey);
    let { type } = parseOptionKey(optKey);
    let map = type === PRECISE_TYPE ? preciseMap : fuzzyMap;
    let opt = map.get(optKey);
    return opt;
  } catch (error) {
    throw new Error("optKey is not exact");
  }
}

//对optKey加密
function encodeOptionKey(optKey) {
  return utils.encode(optKey);
}
//对optKey解密
function decodeOptionKey(optKey) {
  return utils.decode(optKey);
}
//通过url获取配置项
export function getOptionByUrl({ url, method = "all" }) {
  let optKey = getOptionKey({ url, method, type: PRECISE_TYPE });
  let opt = preciseMap.get(optKey);
  if (!opt) {
    let options = [];
    opt = getFuzzyOptionByUrl(url, method);
  }
  return opt;
}

//模糊查询，根据请求类型，请求路径获取配置项，如果没有则使用all类型配置
function getFuzzyOptionByUrl(url, method) {
  let arr = url.split("/");
  let length = arr.length;
  let option = null;
  for (; arr.length > 0; ) {
    arr.pop();
    let newUrl = arr.join("/");
    let optKeys = [
      getOptionKey({ url: newUrl, method, type: FUZZY_TYPE }),
      getOptionKey({ url: newUrl, method: "all", type: FUZZY_TYPE }),
    ];
    option = fuzzyMap.get(optKeys[0]) ?? fuzzyMap.get(optKeys[1]);
    if (!!option && !isExcludesUrl(option, url)) {
      break;
    }
  }
  return option;
}

//设置filter配置项,返回option对应optionKey值
export function setOptions(options) {
  return options.map((opt) => {
    opt = utils.clone(opt);
    return setOption(opt);
  });
}
//设置单个option
export function setOption(option) {
  return parseOption(option);
}

export function removeOptionByKey(optKey){
  optKey = decodeOptionKey(optKey)
  removeOption(optKey);
}

//根据optKey删除配置项
function removeOption(optKey) {
  new TCache(optKey).destory();
  preciseMap.remove(optKey);
  fuzzyMap.remove(optKey);
}

//解析option选项，缓存到缓存类中
export function parseOption(option) {
  option = checkOption(option);
  let optKey = getOptionKey(option);
  removeOption(optKey);
  let map = option.type === PRECISE_TYPE ? preciseMap : fuzzyMap;
  map.add(optKey, option);
  return encodeOptionKey(optKey);
}

//检查option对象是否格式正确
function checkOption(option) {
  //设置默认值
  option = utils.clone(option);
  option.type = option.type ?? PRECISE_TYPE;
  option.method = option.method ?? "all";
  option.method = option.method.toLowerCase();
  option.keepTime = option.keepTime ?? defaultKeepTime;

  if (!option.url && option.url !== "") {
    throw new Error("option error:missing attribute 'url'");
  }
  if (![PRECISE_TYPE, FUZZY_TYPE].includes(option.type)) {
    throw new Error("option error:wrong attribute 'type'");
  }
  if (
    typeof option.keepTime !== "number" &&
    ![TRIGGER_TYPE, FOREVER_TYPE].includes(option.keepTime)
  ) {
    throw new Error("option error:wrong attribute 'keepTime'");
  }

  return option;
}

//根据配置项，解析唯一标识
export function getOptionKey({ url, type, method }) {
  return utils.stringify({ url, type, method });
}

//将标识解析为对象
export function parseOptionKey(optionKey) {
  return utils.parse(optionKey);
}

//克隆配置项
export function cloneOptions(options) {
  let newOpts = options.map((opt) => {
    return utils.clone(opt);
  });
  return newOpts;
}
