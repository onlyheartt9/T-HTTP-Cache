import {
  urlLoading,
  http,
  dealCacheKeyOption,
  commonRequestFilter,
  commonResponseFilter,
  removeUrlLoading,
} from "../index";
import { setOptions, getOptionByUrl } from "../../option/index";
import { setHttpCache } from "../../cache/index";
import { options } from "../../option/__test__/data";
import { cacheKeys } from "../../cache/__test__/data";

// cacheKeys.forEach(cacheKey=>{
//   setHttpCache(cacheKey.cacheKey, cacheKey.response);
// })

test("测试commonRequestFilter and commonResponseFilter loading状态", () => {
  setOptions(options);
  //http.debug = true
  cacheKeys.forEach((cacheKey) => {
    let type =  commonRequestFilter(cacheKey.param);
    if(type==="no option"){
      return
    }
    expect(type).toEqual("normal");
    expect(commonRequestFilter(cacheKey.param)).toEqual("loading");
    removeUrlLoading(cacheKey.cacheKey);
  });
});

test("测试removeUrlLoading", () => {
  setOptions(options);
  cacheKeys.forEach((cacheKey) => {
    urlLoading.push(cacheKey.cacheKey);
    removeUrlLoading(cacheKey.cacheKey);
    expect(urlLoading.includes(cacheKey.cacheKey)).toEqual(false);
  });
});

test("测试commonRequestFilter and commonResponseFilter", () => {
  setOptions(options);
  urlLoading.forEach(() => {
    urlLoading.pop();
  });

  //http.debug = true
  cacheKeys.forEach((cacheKey) => {
    let type = commonRequestFilter(cacheKey.param);
    let ret =  commonResponseFilter(cacheKey.param, cacheKey.response);
    let option = getOptionByUrl(cacheKey.param)
    expect(["normal","no option","loading"].includes(type)).toEqual(true);
    if(ret!=="no option"&&option.keepTime!==-1){
      expect(ret).toEqual(cacheKey.response);
      expect(commonRequestFilter(cacheKey.param)).toEqual(cacheKey.response);
    }
    
  });
});
