
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
 * 将b对象的属性继承到a上面
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

//对象合并
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
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

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== "object") {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

//函数组合
const compose = (...[first, ...others]) => (...args) => {
  let ret = first(...args);
  others.forEach((fn) => {
    ret = fn(ret);
  });
  return ret;
};

//编码
function encode(str){
  return window.btoa(str)
}
//解码
function decode(str){
  return window.atob(str)
}

export default {
  clone,
  parse,
  stringify,
  bind,
  extend,
  isPlainObject,
  merge,
  isArray,
  isUndefined,
  forEach,
  isString,
  isNumber,
  isFunction,
  compose,
  encode,
  decode,
};
