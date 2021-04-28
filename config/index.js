const config = {
  projectName: 'shuoliangju-client',
  date: '2020-1-9',
  designWidth: 375,
  deviceRatio: {
    '375': 1 / 2,
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  babel: {
    sourceMap: true,
    presets: [['env', { modules: false }]],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        "helpers": false,
        "polyfill": false,
        "regenerator": true,
        "moduleName": 'babel-runtime'
      }]
    ]
  },
  plugins: [
    '@tarojs/plugin-sass',
    '@tarojs/plugin-uglify'
  ],
  defineConstants: {
  },
  copy: {
    patterns: [
      {from: 'sitemap.json', to: 'dist/sitemap.json'},
      { from: 'src/components/ParserRichText/Parser/', to: 'dist/components/ParserRichText/Parser/' }
    ],
    options: {
    }
  },
  // 小程序配置从 weapp 改为 mini，可以删掉很多小配置
  mini: {
    webpackChain (chain, webpack) {
      // chain.plugin('analyzer')
      //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    },
    cssLoaderOption: {},
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    webpackChain(chain, webpack) { },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      }
    }

  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
