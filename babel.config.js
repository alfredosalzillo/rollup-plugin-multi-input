module.exports = {
  presets: [
    'airbnb', [
      '@babel/preset-env',
      {
        targets: {
          node: 4,
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]],
};
