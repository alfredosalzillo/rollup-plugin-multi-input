import fastGlob from 'fast-glob';
import path from 'path';

const flatter = () => (acc, a) => [...acc, ...(Array.isArray(a) ? a : [a])];

/*
* multiInput return a rollup plugin config for enable support of multi-entry glob inputs
* */
export default ({
  glob,
  relative = 'src/',
} = {}) => {
  const formatName = name => path
    .relative(relative, name)
    .replace(/\.[^/.]+$/, '');
  const options = (conf) => {
    const { input } = conf;
    const reducedInput = [input]
      .reduce(flatter(), []);
    const stringInputs = reducedInput
      .filter(name => typeof name === 'string');
    const othersInputs = reducedInput
      .filter(name => typeof name !== 'string');
    const inputGlobed = Object
      .assign({}, ...fastGlob
        .sync(stringInputs, glob)
        .map(name => ({ [formatName(name)]: name })));
    return {
      ...conf,
      input: Object.assign(inputGlobed, ...othersInputs),
    };
  };
  return {
    options,
  };
};
