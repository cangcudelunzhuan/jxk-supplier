import React from 'react';
import { Common } from '@jxkang/utils';
import SystemMange from '../system-mange'; // 填写公司资料
import CompanyInfo from '../company-info'; // 公司资料只读

export default function (props) {
  const userInfo = JSON.parse(globalThis.localStorage.getItem('adminUserInfo') || '{}');
  const companyStatus = `${userInfo.companyStatus}`;

  return Common.seek()
    .equal(companyStatus === '4', <CompanyInfo {...props} />)
    .else(<SystemMange {...props} />)
    .get();
}
