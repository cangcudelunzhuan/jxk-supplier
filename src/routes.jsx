import React from 'react';
import { Result, ConfigProvider } from 'antd';
import ZHCN from 'antd/es/locale/zh_CN';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'dva/router';
import { Common } from '@jxkang/utils';
import routerConf from './router';

let url = '';
const reqParams = Common.getRequest();
if (reqParams.sign && reqParams.sign.includes(':')) {
  document.body.style.opacity = 0;
  setTimeout(() => {
    const el = document.querySelectorAll('#aside_menu,#sys_top_bar');
    const mainContent = document.getElementById('main-content');
    el.forEach((item) => {
      item.parentNode.removeChild(item);
    });
    mainContent.parentNode.style.marginLeft = '0';
    mainContent.style.maxHeight = '100%';
    mainContent.style.maxWidth = '100%';
    document.body.removeAttribute('style');
  }, 1500);
} else {
  if (!Common.getCookie(globalThis.webConfig.fetchTokenName) && !location.pathname.includes('/login')) {
    location.href = '/login';
  }

  if (Common.getCookie(globalThis.webConfig.fetchTokenName)) {
    url = '/home';
  } else {
    url = '/login';
  }
}


const Routers = (
  <ConfigProvider locale={ZHCN}>
    <BrowserRouter>
      <Switch>
        <Redirect path="/" exact to={url} />
        {
          routerConf.map((v, i) => <Route key={i} path={v.url} exact={v.exact} component={v.component} />)
        }
        <Route component={() => <Result status="404" title="404 Not Found" subTitle="未找到相关服务" extra={<Link to="/home">回到首页</Link>} />} />
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
);

export default Routers;
