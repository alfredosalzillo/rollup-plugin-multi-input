module.exports = {
  presets: ['airbnb', [
    '@babel/preset-env',
    {
      targets: {
        node: 'current',
      },
    },
  ]],
};
