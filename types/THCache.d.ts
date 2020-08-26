export interface THCacheConstructor {
  new (moduleName: string): THCache;
}
type Option = {
  url: string;
  type: string;
  keepTime: string | number;
  local: string;
  excludes: string[];
  excludeAttrs: string[];
  dataFormat:(response:any)=>any
  method: string;
};
export interface THCache {
  removeOptionByKey: (optKey: string) => void;
  getCacheByKey:(cacheKey:string)=>any;
  getOptionByKey:(optKey: string) => Option;
  setOptions: (options: Option[]) => string[];
  setOption: (options: Option) => string;
  setDebgger: () => void;
}

export const THCache: THCacheConstructor;
