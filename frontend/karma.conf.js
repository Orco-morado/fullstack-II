// ============================================================
// Configuración de Karma + Jasmine (Requisito 7 de la evaluación)
// Ejecuta las MISMAS pruebas unitarias que Jest, pero bajo el
// framework Jasmine, tal como lo pide la rúbrica del curso.
//   npm run test:jasmine
// ============================================================

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-jsdom-launcher'),
      require('karma-webpack'),
    ],

    files: [
      'src/setupKarma.js',
      { pattern: 'src/**/*.test.js', watched: false },
    ],

    preprocessors: {
      'src/**/*.test.js': ['webpack'],
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },

    webpackMiddleware: {
      stats: 'errors-only',
    },

    reporters: ['progress'],
    browsers: ['jsdom'],
    singleRun: true,
    concurrency: Infinity,
  });
};
