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
    format: 'esm',
    dest: 'public/app.min.js',
    plugins: [ multiInput() ],
};
```

## Options

### glob `{}`
[fast-glob](https://github.com/mrmlnc/fast-glob) object configuration.
