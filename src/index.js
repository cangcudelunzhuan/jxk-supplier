import ReactDOM from 'react-dom';
import AppRouter from './routes.jsx';
import './app.styl';

const appRoot = document.getElementById('app-root');

if (!appRoot) {
  throw new Error('当前页面不存在 <div id="app-root"></div> 节点.');
}

ReactDOM.render(AppRouter, appRoot);
