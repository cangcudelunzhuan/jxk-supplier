const path = require('path');

const proCwd = process.cwd();
const layoutLoader = path.join(proCwd, 'config', 'layoutLoader.js');

module.exports = {
  chainWebpack(config) {
    config.externals({
      react: 'React',
      'react-dom': 'ReactDOM',
    });

    config.devServer.historyApiFallback({
      rewrites: [{ from: /.*/, to: '/index.html' }],
    });

    config.module
      .rule('jsx')
      .test(/\.jsx?$/)
      .exclude
      .add(/node_modules/)
      .end()
      .use('layout')
      .loader(layoutLoader)
      .options({
        layout: [{ name: 'admin' }],
      });

    // 别名设置
    config.resolve.alias.set('@', path.join(__dirname, 'src'));
    config.resolve.alias.set('@/cmpt', path.join(__dirname, 'src', 'components'));
  },
  babelPlugins: [
    ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'ant'],
    ['babel-plugin-import', { libraryName: '@jxkang/web-cmpt', libraryDirectory: 'lib', style: true }, '@jxkang/web-cmpt'],
  ],
  plugins: [

  ],
  builderDone() {
    console.log('打包完成...');
  },
};
