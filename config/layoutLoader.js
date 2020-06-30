/**
 * @Author: 福虎 TanShenghu tanshenghu@163.com
 * @Update: 2019-12-15
 * @Description: 针对于项目做layout-loader   本文件不要随便轻易修改
 */
// const loaderUtils = require('loader-utils');

const Utils = {
  firstUpper(str) {
    str = `${str}`;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  appendImport(code, layoutConfig) {
    const name = layoutConfig.name;
    const layout = `import ${this.firstUpper(name)}Layout from "${layoutConfig.alias ? layoutConfig.alias : `@/layout/${name}`}";`;
    // 检测是否已经存在
    if (code.includes(layout)) {
      return code;
    }
    if (this.hasReact(code)) {
      code = code.replace(/(?:"|')react(?:'|");?/, `"react";\n${layout}`);
    } else {
      code = `${layout}\n${code}`;
    }
    return code;
  },
  hasReact(code) {
    return /import .*? from (?:"|')react(?:'|")/.test(code);
  },
  getRenderCode({ source, layoutConfig }) {
    const layoutName = layoutConfig.name;
    let code = this.appendImport(source, layoutConfig);

    const regStartEnd = new RegExp(`\\{?\\/\\*+\\s*Layout-${layoutName}:Start:End\\s*\\*\\/\\}?`, 'mg');

    const regStart = new RegExp(`\\{?\\/\\*+\\s*Layout-${layoutName}:Start\\s*\\*\\/{1}?\\}?`, 'mg');
    const regEnd = new RegExp(`\\{?\\/\\*+\\s*Layout-${layoutName}:End\\s*\\*\\/{1}?\\}?`, 'mg');

    if (code.includes(`Layout-${layoutName}:`)) {
      code = code.replace(regStartEnd, `<${this.firstUpper(layoutName)}Layout {...this.props} {...(typeof this.setLayoutProps==='function'?this.setLayoutProps('${layoutName}'):{})} onRef={this.getLayoutScope} />`)
        .replace(regStart, `<${this.firstUpper(layoutName)}Layout {...this.props} {...(typeof this.setLayoutProps==='function'?this.setLayoutProps('${layoutName}'):{})} onRef={this.getLayoutScope}>`)
        .replace(regEnd, `</${this.firstUpper(layoutName)}Layout>`);
      // if(regStartEnd.test(code) || regStart.test(code)){
      //   this.getRenderCode({source: code, layoutConfig});
      // }
      return code;
    }

    return source;
  },
};

module.exports = function (source) {
  // const options = loaderUtils.getOptions(this);
  const options = {
    layout: [{ name: 'admin' }],
  };
  /**
   * layout: [{name: 'admin', alias: '', wraper: true}]
   */
  if (Array.isArray(options.layout)) {
    options.layout.forEach((item) => {
      source = Utils.getRenderCode({
        source,
        layoutConfig: item,
      });
    });
  }

  return source;
};
