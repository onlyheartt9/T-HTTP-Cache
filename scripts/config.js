const path = require("path");
const buble = require("rollup-plugin-buble");
const alias = require("rollup-plugin-alias");
const cjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");
const node = require("rollup-plugin-node-resolve");
const flow = require("rollup-plugin-flow-no-whitespace");
const version = process.env.VERSION || require("../package.json").version;
const weexVersion = "1.0.0";
const featureFlags = require("./feature-flags");
const { uglify } = require("rollup-plugin-uglify");

const banner =
  "/*!\n" +
  ` * THCache.js v${version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} Challenger\n` +
  " * Released under the MIT License.\n" +
  " */";

const weexFactoryPlugin = {
  intro() {
    return "module.exports = function weexFactory (exports, document) {";
  },
  outro() {
    return "}";
  },
};

const aliases = {};
const resolve = (p) => {
  const base = p.split("/")[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};

const builds = {
  "web-full-dev": {
    entry: resolve("src/core/umdIndex.js"),
    dest: resolve("dist/thcache.js"),
    format: "umd",
    plugins: [
      node(),
      cjs(),
      babel({
        exclude: "node_modules/**",
      }),
    ],
    env: "development",
    alias: { he: "./entity-decoder" },
    banner,
  },
  "web-full-prod": {
    entry: resolve("src/core/umdIndex.js"),
    dest: resolve("dist/index.js"),
    format: "umd",
    env: "production",
    alias: { he: "./entity-decoder" },
    plugins: [
      node(),
      cjs(),
      babel({
        exclude: "node_modules/**",
      }),
      uglify(),
    ],
    interop: false,
    banner,
  },
  "web-runtime-cjs-prod": {
    entry: resolve("src/core/index.js"),
    dest: resolve("dist/thcache.common.prod.js"),
    format: "cjs",
    plugins: [
      node(),
      cjs(),
      babel({
        exclude: "node_modules/**",
      }),
      uglify(),
    ],
    env: "production",
    banner,
  },
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [flow(), alias(Object.assign({}, aliases, opts.alias))].concat(
      opts.plugins || []
    ),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || "THCache",
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
  };

  // built-in vars
  const vars = {
    __WEEX__: !!opts.weex,
    __WEEX_VERSION__: weexVersion,
    __VERSION__: version,
  };
  // feature flags
  Object.keys(featureFlags).forEach((key) => {
    vars[`process.env.${key}`] = featureFlags[key];
  });
  // build-specific env
  if (opts.env) {
    vars["process.env.NODE_ENV"] = JSON.stringify(opts.env);
  }
  config.plugins.push(replace(vars));

  if (opts.transpile !== false) {
    config.plugins.push(buble());
  }

  Object.defineProperty(config, "_name", {
    enumerable: false,
    value: name,
  });

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}
