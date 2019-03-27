# rollup-plugin-multi-input

[![Build Status](https://travis-ci.org/alfredosalzillo/rollup-plugin-multi-input.svg?branch=master)](https://travis-ci.org/alfredosalzillo/rollup-plugin-multi-input)

Use multiple entry points in your rollup bundle.
Let you use glob in input.
Preserve the dir structure in the output dir.

## Install
Install via npm or yarn.
```
npm i -D rollup-plugin-multi-input
yarn add rollup-plugin-multi-input
```
## Setup
In your rollup config
```js
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: ['src/**/*.js'],
    output: {
      format: 'esm',
      dir: 'dist'
    },
    plugins: [ multiInput() ],
};
```
If using a rollup lower version than __1.0.0__,
`experimentalCodeSplitting` must be enabled.

From version **0.2.0** it's possible to mix input types.
But *glob in object input element is not supported* yet. 

## Options

### relative `'src/'`
Specific the relative path to use in the dist folder.

Example:
```js
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: ['src/bar.js', 'src/foo/bar.js'],
    output: {
      format: 'esm',
      dir: 'dist'
    },
    plugins: [ multiInput({ relative: 'src/' }) ],
};
// create the files dist/bar.js and dist/foo/bar.js
```
 
### glob `{}`
[fast-glob](https://github.com/mrmlnc/fast-glob) object configuration.
