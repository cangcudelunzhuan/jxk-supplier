import { $post, $get } from '@jxkang/utils';

export default {
  // 用户登录
  login: (reqModel) => $post('/userservice/login/doLogin', reqModel),
  // 用户登出
  logout: (reqModel) => $post('/userservice/login/logout', reqModel),
  // 注册用户
  addOrUpdateUser: (reqModel) => $post('/userservice/user/registerMasterUser', reqModel),
  // 判断 用户资料是否审核通过 1, "未提交(初始状态)"  2, "已提交，未审核"  3,"审核失败"  4,"审核通过"
  getCompanyStatus: (reqModel) => $get('/userservice/company/getCompanyStatus', reqModel),
};
