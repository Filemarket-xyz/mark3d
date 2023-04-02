// Karma configuration
// Generated on Thu Mar 03 2022 22:38:34 GMT+0300 (Moscow Standard Time)

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
        extensions: ['.js', '.ts', '.tsx']
      },
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
    concurrency: Infinity
  })
}
