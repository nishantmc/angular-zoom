import config from './rollup.config.umd.js';
config.output.format = "es";
config.output.file = "dist/zoom.esm.js";
export default config;