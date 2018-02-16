import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';

var sass = require('node-sass');
export default {
    entry: './src/lib/zoom.ts',
    output: {
        format: 'umd',
        file:"dist/zoom.umd.js",
    },
    moduleName: 'zoom',
    sourceMap:true,
    external: [
        '@angular/core',
        '@angular/common'
    ],
    plugins: [
    angular(
        {
            preprocessors:{
                template:template => template,
                style: scss => {
                     let css;
                     if(scss){
                         css = sass.renderSync({ data: scss }).css.toString();
                     }else{
                          css = '';
                     }
                     return css;
                },
            }
        }
    ),
    typescript({
         typescript:require('typescript')
    }),
    resolve({
         module: true,
         main: true
    }),
    commonjs({
         include: 'node_modules/**',
    }),
    postcss({
        plugins: []
      })
    ],
    onwarn: warning => {
         const skip_codes = [
         'THIS_IS_UNDEFINED',
         'MISSING_GLOBAL_NAME'
    ];
    if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};