# rollup-plugin-multi-input

Let you use glob in input. Preserve the dir structure in the output dir.

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
    experimentalCodeSplitting: true,
    output: {
      format: 'esm',
      dir: 'dist'
    },
    plugins: [ multiInput() ],
};
```

## Options

### relative `'src/'`
Specific the relative path to use in the dist folder.

Example:
```js
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: ['src/bar.js', 'src/foo/bar.js'],
    experimentalCodeSplitting: true,
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
