// Karma configuration
// Generated on Thu Mar 03 2022 22:38:34 GMT+0300 (Moscow Standard Time)
const webpack = require('webpack')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['src/**/*.spec.ts'],
    preprocessors: {
      'src/**/*.spec.ts': ['webpack', 'sourcemap'],
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        fallback: {
          "buffer": require.resolve("buffer")
        }
      },
      plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
      module: {
        rules: [
          {test: /\.tsx?$/, loader: 'ts-loader'}
        ]
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
      },
      devtool: 'inline-source-map',
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    browserDisconnectTimeout: 12000,
  })
}
