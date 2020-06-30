import { $ajax, $get, $post } from '@jxkang/utils';

export default {
  // 查询公司审核上面的统计信息
  selectCompanyVerifyStatis: (reqModel) => $post('/userservice/company/selectCompanyVerifyStatis', reqModel),
  // 查询供应商审核列表
  getCompanyListByParam: (reqModel) => $post('/userservice/company/getCompanyListByParam', reqModel),
  // 冻结、解冻公司资料
  freezeCompany: (reqModel) => $post('/userservice/company/freezeCompany', reqModel),
  // 第一次邀请用户
  addMasterUser: (reqModel) => $post('/userservice/user/addMasterUser', reqModel),
  // 查询自己公司信息
  getCompanyByUserId: (reqModel) => $get('/userservice/company/getCompanyByUserId', reqModel),
  // 审核公司资料
  verifyCompany: (reqModel) => $post('/userservice/company/verifyCompany', reqModel),
  // 获取资质图片和资质文件
  getImageByType: (reqModel) => $get('/productservice/img/getImageByType', reqModel),
  // 查询所有一级部门
  getTopRoleByCompanyId: (reqModel) => $get('/userservice/role/getTopRoleByCompanyId', reqModel),
  // 重置密码
  resetPassword: (reqModel) => $get('/userservice/user/resetPassword', reqModel),
  // 保存公司资料
  addOrUpdateCompany: (reqModel) => $post('/userservice/company/addOrUpdateCompany', reqModel),
  //  保存提交公司资料
  submitCompany: (reqModel) => $post('/userservice/company/submitCompany', reqModel),
  // 平台角色关联的所有权限资源
  getFunctionListByPlatformRoleCode: (reqModel) => $get('/userservice/role/getFunctionListByPlatformRoleCode', reqModel),
  // 查询角色信息
  getRoleById: (reqModel) => $get('/userservice/role/getRoleById', reqModel),
  // 用户修改密码
  changePassword: (reqModel) => $post('/userservice/login/changePassword', reqModel),
  // 部门角色的资源权限赋权
  saveRoleFunction: (reqModel) => $post('/userservice/role/saveRoleFunction', reqModel),
  // 查询用户信息
  getUser: (reqModel) => $get('/userservice/user/getUser', reqModel),
  // 查询公司人员
  getUserListByParam: (reqModel) => $post('/userservice/user/getUserListByParam', reqModel),
  // 自己创建用户
  registerMasterUser: (reqModel) => $post('/userservice/user/registerMasterUser', reqModel),
  // 查询用户登陆日志
  getLoginRecord: (reqModel) => $post('/userservice/user/getLoginRecord', reqModel),
  // 冻结角色
  frozenRoleById: (reqModel) => $get('/userservice/role/frozenRoleById', reqModel),
  // 启用角色
  enableRoleById: (reqModel) => $get('/userservice/role/enableRoleById', reqModel),
  // 删除角色
  deleteRoleById: (reqModel) => $get('/userservice/role/deleteRoleById', reqModel),
  // 新建部门
  addOrUpdateRole: (reqModel) => $post('/userservice/role/addOrUpdateRole', reqModel),
  // 新建用户
  addOrUpdateUser: (reqModel) => $post('/userservice/user/addOrUpdateUser', reqModel),
  // 查询部门下面的人员
  getUserListByRoleId: (reqModel) => $post('/userservice/user/getUserListByRoleId', reqModel),
  // 重置部门账户密码
  resetRolePassword: (reqModel) => $get('/userservice/user/resetRolePassword', reqModel),
  // 删除部门人员
  deleteRoleUserById: (reqModel) => $get('/userservice/user/deleteRoleUserById', reqModel),
  // 冻结部门人员
  freezeRoleUserById: (reqModel) => $get('/userservice/user/freezeRoleUserById', reqModel),
  // 解冻部门人员
  enableRoleUserById: (reqModel) => $get('/userservice/user/enableRoleUserById', reqModel),
  // 用户查询公司资料是否完善(该接口已不用)
  getCompanyInitialStatus: (reqModel) => $ajax({ url: '/userservice/user/getCompanyInitialStatus', type: 'get', special: { intactModel: true }, data: reqModel }),
  // 用户查询公司资料是否完善
  getCompanyStatus: (reqModel) => $get('/userservice/company/getCompanyStatus', reqModel),
};
