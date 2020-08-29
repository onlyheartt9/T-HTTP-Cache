////////////////////////////////////////////////export default//////////////////////////////////////////////////////////
var toString = Object.prototype.toString;
//克隆对象
function clone(obj, { excludeAttrs = [], attrs = {} } = {}) {
  if (isString(obj) || isNumber(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return parse(stringify(obj));
  }
  //
  for (let key in obj) {
    if ((isPlainObject(obj[key])||isArray(obj[key])) && !excludeAttrs.includes(key)) {
      obj[key] = clone(obj[key]);
    } else if (isFunction(obj[key])) {
      obj[key] = bind(obj[key], obj);
    }
  }
  return Object.assign({}, obj, attrs);
}

//加码为字符串
function stringify(data) {
  return JSON.stringify(data);
}
//解码为对象
function parse(data) {
  return JSON.parse(data);
}

//克隆一个方法
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}

/**
 * 将b对象的属性继承到a上面，浅拷贝
 */
function extend(a, b, thisArg) {
  for (let key in b) {
    let val = b[key];
    if (thisArg && typeof val === "function") {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }
  return a;
}

//是否为普通对象
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

//是否为undefined
function isUndefined(val) {
  return typeof val === "undefined";
}

//是否为数组
function isArray(val) {
  return toString.call(val) === "[object Array]";
}


//是否为字符串
function isString(val) {
  return typeof val === "string";
}
//是否为数字
function isNumber(val) {
  return typeof val === "number";
}
//是否为方法
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}


//函数组合
const compose = (...[first, ...others]) => (...args) => {
  let ret = first(...args);
  others.forEach((fn) => {
    ret = fn(ret);
  });
  return ret;
};


// const encodeMap = new TCache("encodeMap");
//编码
// function encode(str){
//   return escape(str)
// }
// //解码
// function decode(str){
//   return decodeURIComponent(atob(str))
// }
const encodeMap = [];
//编码
function encode(str){
  if(!encodeMap.includes(str)){
    encodeMap.push(str);
  }
  return encodeMap.indexOf(str);
}
//解码
function decode(index){
  return encodeMap[index];
}

export default {
  clone,
  parse,
  stringify,
  bind,
  extend,
  isPlainObject,
  isArray,
  isUndefined,
  isString,
  isNumber,
  isFunction,
  compose,
  encode,
  decode,
};
