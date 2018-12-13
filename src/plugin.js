import fastGlob from 'fast-glob';
import path from 'path';

/*
* multiInput return a rollup plugin config for enable support of multi-entry glob inputs
* */
export default ({
  glob,
  relative = 'src/',
} = {}) => {
  const flatter = () => (acc, a) => [...acc, ...(Array.isArray(a) ? a : [a])];
  const formatName = name => path
    .relative(relative, name)
    .replace(/\.[^/.]+$/, '');
  const options = (conf) => {
    const { input, experimentalCodeSplitting } = conf;
    if (!experimentalCodeSplitting) throw new Error('experimentalCodeSplitting required to be true');
    const inputGlobed = Object
      .assign({}, ...fastGlob
        .sync([input]
          .reduce(flatter(), []), glob)
        .map(name => ({ [formatName(name)]: name })));
    return {
      ...conf,
      input: inputGlobed,
    };
  };
  return {
    options,
  };
};
