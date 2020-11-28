const tsconfig = require('./tsconfig.json');

/**
 * Map tsconfig.json paths to Babel alias
 * @param {*} tsconfig  - tsconfig json
 * @return {object} - Babel alias config
 */
function getBabelAlisFromTsConfigPaths(tsconfig) {
  const { paths } = tsconfig.compilerOptions;
  return Object.entries(paths).reduce(
    (aliases, [alias, pathGlob]) => ({
      ...aliases,
      [alias.replace('/*', '')]: pathGlob[0].replace('/*', ''),
    }),
    {}
  );
}

const moduleResolverPlugin = [
  'module-resolver',
  {
    alias: getBabelAlisFromTsConfigPaths(tsconfig),
  },
];

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [moduleResolverPlugin],
  };
};
