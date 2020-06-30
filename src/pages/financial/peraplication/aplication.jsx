import React from 'react';
import { Button, message, Upload, Icon, Cascader, Checkbox, Modal, Table } from 'antd';
import { BoxTitle, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import moment from 'moment';
import model, { getUploadProps } from '@/model';
import until from '@/utils/index';
import styles from './index.module.styl';

class ApliCation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: {
        corpLicenseType: 2,
      },
      firstOwner: {
        ismargortype: Number(props.match.params.type) != 3 ? Number(props.match.params.type) : 2,
      },
      dealType: Number(props.match.params.dealType),
      secOwner: {},
      thrOwner: {},
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
      imageUrl6: '',
      imageUrl10: '',
      imageUrl14: '',
      imageUrl15: '',
      loading: false,
      isTypeCard: 2,
      options: [],
      isDisabled: 'disabled',
      currentArea: [],
      visibleItem: false,
      visibleUserMes: false,
      showNewAccount: false,
      visibleSecConfirm: false,
      boxChecked: false,
      secConfirmData: [
        {
          title: '账户号',
          dataIndex: 'userCustId',
        },
        {
          title: '账户类型',
          dataIndex: 'userType',
          render: (item) => {
            return (
              <>
                {item == 1 ? <div>企业</div> : null}
                {item == 2 ? <div>个体</div> : null}
                {item == 3 ? <div>个人</div> : null}
              </>
            );
          },
        },
        {
          title: '开通时间',
          dataIndex: 'createTime',
          render: (item) => {
            return (
              <div>
                {until.timeStampTurnTimeDetail(item)}
              </div>
            );
          },
        },
      ],

      firColumns: [
        {
          title: '账户号',
          dataIndex: 'userCustId',
        },
        {
          title: '账户类型',
          dataIndex: 'userType',
          render: (item) => {
            return (
              <>
                {item == 1 ? <div>企业</div> : null}
                {item == 2 ? <div>个体</div> : null}
                {item == 3 ? <div>个人</div> : null}
              </>
            );
          },
        },
        {
          title: '开通时间',
          dataIndex: 'createTime',
          render: (item) => {
            return (
              <div>
                {until.timeStampTurnTimeDetail(item)}
              </div>
            );
          },
        },
        {
          title: '账户名',
          dataIndex: 'accountName',
        },
        {
          title: '操作',
          render: (item) => {
            return (
              <Checkbox
                checked={item.checkStatus}
                disabled={item.checkDisabled}
                onChange={(e) => this.onCheckChange(e, item)}
              >
                勾选启用
              </Checkbox>
            );
          },
        },
      ],

      secColumns: [
        {
          title: '账户号',
          dataIndex: 'userCustId',
        },
        {
          title: '账户类型',
          dataIndex: 'userType',
          render: (item) => {
            return (
              <>
                {item == 1 ? <div>企业</div> : null}
                {item == 2 ? <div>个体</div> : null}
                {item == 3 ? <div>个人</div> : null}
              </>
            );
          },
        },
        {
          title: '开通时间',
          dataIndex: 'createTime',
          render: (item) => {
            return (
              <div>
                {until.timeStampTurnTimeDetail(item)}
              </div>
            );
          },
        },
        {
          title: '账户名',
          dataIndex: 'accountName',
        },
      ],
      useListVOS: [],
      noUseListVOS: [],
      buttonDisabled: true,
    };
  }

  onCheckChange = (e, item) => {
    const { useListVOS } = this.state;
    item.checkStatus = e.target.checkStatus;
    useListVOS.map((v) => {
      if (v.userCustId == item.userCustId) {
        v.checkStatus = e.target.checked;
      } else {
        v.checkStatus = false;
      }
      return v;
    });
    this.setState({
      useListVOS,
    }, () => {
      const someItem = useListVOS.filter((v) => {
        return v.checkStatus == true;
      });
      this.setState({
        buttonDisabled: !someItem,
      });
    });
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange = (info, uploadType, typeNum, businesstype) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) => this.setState({
        [uploadType]: imageUrl,
        loading: false,
      }),
      );
      const currentData = {
        handleType: 1,
        attachType: typeNum,
        transType: businesstype,
        attachFile: info.file.response.entry.filePath,
      };
      model.financial.uploaFfile(currentData).then((res) => {
        console.log(res);
      });
    }
  };

  onCorChange = (e) => {
    if (e == 1) {
      this.mySecForm.removeValidate('socialCreditCode');
      this.mySecForm.removeValidate('soloFixedTelephone');
      this.mySecForm.addValidate('businessCode', (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback('这是一个必填项哦');
        }
      });
      this.mySecForm.addValidate('institutionCode', (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback('这是一个必填项哦');
        }
      });
      this.mySecForm.addValidate('taxCode', (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback('这是一个必填项哦');
        }
      });
    } else {
      this.mySecForm.removeValidate('businessCode');
      this.mySecForm.removeValidate('institutionCode');
      this.mySecForm.removeValidate('taxCode');
      this.mySecForm.addValidate('socialCreditCode', (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback('这是一个必填项哦');
        }
      });
      this.mySecForm.addValidate('soloFixedTelephone', (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback('这是一个必填项哦');
        }
      });
    }
    this.setState({
      isTypeCard: e == 1 ? 1 : 2,
    });
  }

  searchBank = (e, allType) => {
    const { owner, secOwner, thrOwner } = this.state;
    if (e.target.value) {
      const currentData = {
        bankNum: e.target.value,
      };
      model.financial.queryBank(currentData).then((res) => {
        if (res) {
          if (allType === 1) {
            owner.bankId = res.bankId;
            owner.bankName = res.bankName;
            this.setState({
              owner,
            });
          } else if (allType === 2) {
            secOwner.bankName = res.bankName;
            this.setState({
              secOwner,
            });
          } else if (allType === 3) {
            thrOwner.bankName = res.bankName;
            this.setState({
              thrOwner,
            });
          }
        }
      });
    }
  }

  onCityChange = (e, selectedOptions) => {
    const { owner } = this.state;
    owner.backAreaMes = selectedOptions;
    const cuQcurrentArea = [selectedOptions[0].value, selectedOptions[1].value];
    this.setState({
      owner,
      currentArea: cuQcurrentArea,
    });
  }

  onCheckBoxChange = (e) => {
    this.setState({
      boxChecked: e.target.checked,
    });
  }

  onItemChange = (e) => {
    const { firstOwner } = this.state;
    firstOwner.ismargortype = e;
    this.setState({
      firstOwner,
    });
  }

  evelinemes = (parObj, secObj, parExtra, secExtra) => {
    const { boxChecked } = this.state;
    return (
      <div className={`${styles.secOpenmes} ${parObj.borderNone == 0 ? styles.borderNone : ''}`}>
        <div className={styles.leftopen}>
          <div className={styles.textleft}>
            <div>
              <span className={styles.xingStyle}>*</span>
              <span>
                {parObj.title}
              </span>
            </div>
          </div>
          <div
            className={
              `${secObj && secObj.buttonType == 'buttonType' ? styles.textright : ''} 
               ${parObj && parObj.buttonType == 'endForever' ? styles.textInlineright : ''}`
            }
            style={{ padding: '10px', position: 'relative' }}
          >
            <FormControl
              type={parObj.type}
              name={parObj.nametype}
              placeholder={parObj.placehodler}
              required={!parObj.required}
              verifMessage="这是一个必填项哦"
              trim
              dataSource={parObj.dataSource}
              onChange={parObj.type == 'select' ? parObj.onCorChange : ''}
              disabled={parObj.isItemDisabled}
              onBlur={parObj.onBulerMes}
              style={parObj.style}
              // {...parObj.nametype == 'userMobile' ? { 'maxlength' = 11 } : null}
              {...parExtra}
            />
            {secObj && secObj.buttonType == 'buttonType'
              ? <Button type="primary" className={styles.buttonMes} onClick={this.confirmType}> 确认开户类型</Button>
              : null}
            {parObj && parObj.buttonType == 'endForever' ? (
              <Checkbox
                checked={boxChecked}
                disabled={this.state.disabled}
                onChange={this.onCheckBoxChange}
                style={{ marginLeft: '12px' }}
                className={styles.checkboxstyle}
              >
                永久
              </Checkbox>
            )
              : null}
            {boxChecked && parObj.buttonType == 'endForever' ? <div className={styles.foreverMes}>永久</div> : null}
          </div>
        </div>
        {
          secObj && secObj.buttonType != 'buttonType' ? (
            <div className={styles.rightopen}>
              <div className={styles.textleft}>
                <div>
                  <span className={styles.xingStyle}>*</span>
                  <span>
                    {secObj.title}
                  </span>
                </div>
              </div>
              <div className={
                `${secObj && secObj.buttonType == 'buttonType' ? styles.textright : ''} 
                 ${parObj && parObj.buttonType == 'endForever' ? styles.textInlineright : ''}`
              }
                style={{ padding: '10px', position: 'relative' }}
              >
                <FormControl
                  type={secObj.type}
                  name={secObj.nametype}
                  required={!secObj.required}
                  verifMessage="这是一个必填项哦"
                  placeholder={secObj.placehodler}
                  trim
                  style={{ width: '100%' }}
                  dataSource={secObj.dataSource}
                  onChange={secObj.type == 'select' ? secObj.onCorChange : ''}
                  disabled={secObj.isItemDisabled}
                  onBlur={secObj.onBulerMes}
                  {...secExtra}
                />
              </div>
            </div>
          ) : ''
        }
      </div>
    );
  }

  uploadTypeMes = (uploadArr, businesstype) => {
    const { loading } = this.state;
    return (
      uploadArr.map((v) => {
        return (
          <div>
            <div className={styles.codeMes}>
              <span className={styles.xingStyle}>*</span>
              <span className={styles.codejoin}>
                {v.title}
              </span>
            </div>
            <div className={styles.uploadotherStyle}>
              <Upload
                {
                ...getUploadProps({
                  listType: 'picture-card',
                  showUploadList: false,
                  beforeUpload: this.beforeUpload,
                  onChange: (e) => this.handleChange(e, v.uploadTypeString, v.typeNum, businesstype),
                })
                }
              >
                {v.uploadType ? <img src={v.uploadType} alt="avatar" style={{ width: '78px', height: '56px' }} />
                  : (
                    <div>
                      <Icon type={loading ? 'loading' : 'plus'} />
                    </div>
                  )}
              </Upload>
            </div>
          </div>
        );
      })
    );
  }

  // 提交页面
  postAllForm = (postType) => {
    if (postType === 1) {
      this.postBusinessMes();
    } else if (postType === 2) {
      this.postPerApply();
    } else if (postType === 3) {
      this.perApplyUpload();
    }
  }

  // 企业开户申请提交
  postBusinessMes = () => {
    this.mySecForm.validateAll((error, value) => {
      if (!error) {
        const params = Common.clone(value);
        if (params.dateTime && params.dateTime.length) {
          const df = 'yyyymmdd';
          params.legalCertStartDate = Common.dateFormat(params.dateTime[0].valueOf(), df);
          params.legalCertEndDate = Common.dateFormat(params.dateTime[1].valueOf(), df);
          params.listParams = JSON.stringify([{ custName: params.custName, idCardType: params.idCardType, idCard: params.idCard }]);
          params.bankProv = params.backAreaMes[0].value;
          params.bankArea = params.backAreaMes[1].value;
          params.provinceName = params.backAreaMes[0].label;
          params.areaName = params.backAreaMes[1].label;
          params.operateType = 'A';
          // delete params.controllingShareholder;
          delete params.dateTime;
          delete params.custName;
          delete params.idCardType;
          delete params.idCard;
          delete params.backAreaMes;
        } else {
          params.legalCertStartDate = '';
          params.legalCertEndDate = '';
        }
        // 1 为普通证照片  2为三证合一
        const { imageUrl6, imageUrl4, imageUrl10, imageUrl2, imageUrl3, imageUrl5 } = this.state;
        if (params.corpLicenseType == 1) {
          if (imageUrl6 == '') {
            message.warning('未上传信用代码证件');
            return;
          }
          if (imageUrl3 == '') {
            message.warning('未上传税务登记号');
            return;
          }
          if (imageUrl2 == '') {
            message.warning('未上传组织机构代码');
            return;
          }
        } else if (params.corpLicenseType == 2) {
          if (imageUrl6 == '') {
            message.warning('未上传信用代码证件');
            return;
          }
        }
        if (imageUrl5 == '') {
          message.warning('未上传对公账户信息');
          return;
        }
        if (imageUrl4 == '') {
          message.warning('未上传法人证件正面');
          return;
        }
        if (imageUrl10 == '') {
          message.warning('未上传法人证件反面');
          return;
        }
        model.financial.openAccountCorp(params).then((res) => {
          if (res) {
            const { history } = this.props;
            history.push('/financial/accountmes');
          }
        });
      }
    });
  }

  // 个体户申请提交
  postPerApply = () => {
    this.myThrForm.validateAll((error, value) => {
      if (!error) {
        const { boxChecked } = this.state;
        const params = Common.clone(value);
        const { imageUrl1, imageUrl4, imageUrl10, imageUrl14, imageUrl15 } = this.state;
        if (params.legaDateTime && params.dateTime && params.dateTime.length && params.legaDateTime.length) {
          const df = 'yyyymmdd';
          params.licenseStartDate = Common.dateFormat(params.legaDateTime[0].valueOf(), df);
          params.licenseEndDate = boxChecked ? '99991231' : Common.dateFormat(params.legaDateTime[1].valueOf(), df);
          params.legalCertStartDate = Common.dateFormat(params.dateTime[0].valueOf(), df);
          params.legalCertEndDate = Common.dateFormat(params.dateTime[1].valueOf(), df);
          params.operateType = 'A';
          delete params.legaDateTime;
          delete params.dateTime;
        } else {
          params.licenseStartDate = '';
          params.licenseEndDate = '';
          params.legalCertStartDate = '';
          params.legalCertEndDate = '';
        }
        if (imageUrl1 == '') {
          message.warning('未上传营业执照');
          return;
        }
        if (imageUrl4 == '') {
          message.warning('未上传法人证件正面');
          return;
        }
        if (imageUrl10 == '') {
          message.warning('未上传法人证件反面');
          return;
        }
        if (imageUrl14 == '') {
          message.warning('未上传银行卡正面');
          return;
        }
        if (imageUrl15 == '') {
          message.warning('未上传银行卡反面');
          return;
        }
        model.financial.openAccountSoho(params).then((res) => {
          if (res) {
            const { history } = this.props;
            history.push('/financial/accountmes');
          }
        });
      }
    });
  }

  // 个人申请提交
  perApplyUpload = () => {
    this.myFourForm.validateAll((error, value) => {
      if (!error) {
        model.financial.userBindCard(value).then((res) => {
          if (res) {
            const { history } = this.props;
            history.push('/financial/accountmes');
          }
        });
      }
    });
  }

  componentDidMount = () => {
    this.getAreaMes();
  }

  getBussinessAllMes = () => {
    model.financial.corpInfo().then((res) => {
      const { ismargortype } = this.state.firstOwner;
      if (ismargortype === 1) {
        res.listParams = JSON.parse(res.listParams);
        res.custName = (res.listParams)[0].custName;
        res.idCardType = (res.listParams)[0].idCardType;
        res.idCard = (res.listParams)[0].idCard;
        res.corpLicenseType = Number(res.corpLicenseType);
        res.dateTime = [moment(res.legalCertStartDate, 'YYYY-MM-DD'), moment(res.legalCertEndDate == '99991231' ? res.legalCertStartDate : res.legalCertEndDate, 'YYYY-MM-DD')];
        res.backAreaMes = [{ label: res.provinceName, value: res.bankProv }, { label: res.areaName, value: res.bankArea }];
        res.legalIdCardType = Number(res.legalIdCardType);
        this.setState({
          owner: res,
          currentArea: [res.bankProv, res.bankArea],
        });
      }
      if (ismargortype === 2) {
        res.legaDateTime = [moment(res.legalCertStartDate, 'YYYY-MM-DD'), moment(res.legalCertEndDate, 'YYYY-MM-DD')];
        res.dateTime = [moment(res.licenseStartDate, 'YYYY-MM-DD'), moment(res.licenseEndDate == '99991231' ? res.licenseStartDate : res.licenseEndDate, 'YYYY-MM-DD')];
        this.setState({
          secOwner: res,
          boxChecked: res.licenseEndDate == '99991231',
        });
      }
    });
  }

  getAllImgs = () => {
    model.financial.attachList().then((res) => {
      // attachType  attachFile
      (res || []).map((v) => {
        this.setState({
          [`imageUrl${v.attachType}`]: v.attachFile,
        });
        return v;
      });
    });
  }

  getPerMes = () => {
    model.financial.userInfo().then((res) => {
      this.setState({
        thrOwner: res,
      });
    });
  }

  getAreaMes = () => {
    model.financial.getAreaAddress().then((res) => {
      this.setState({
        options: res,
      }, () => {
        const { dealType, firstOwner } = this.state;
        if (dealType === 1) {
          if (firstOwner.ismargortype != 3) {
            this.getBussinessAllMes();
            this.getAllImgs();
          } else {
            this.getPerMes();
          }
        } else if (dealType == 3) {
          console.log('我是来开户的');
        }
      });
    });
  }

  onChangeBusinessItem = (e) => {
    if (e.target.checked) {
      this.setState({
        isDisabled: '',
        isChecked: true,
      });
    } else {
      this.setState({
        isDisabled: 'disabled',
        isChecked: false,
      });
    }
  }

  openItem = () => {
    this.setState({
      visibleItem: true,
    });
  }

  handleOk = () => {
    this.setState({
      visibleItem: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visibleItem: false,
    });
  }

  confirmType = () => {
    const { firstOwner } = this.state;
    const currentData = {
      userType: firstOwner.ismargortype,
    };
    model.financial.accountUserList(currentData).then((res) => {
      if (!res) return false;
      if ((res.useListVOS || []).length !== 0) {
        res.useListVOS.map((v) => {
          v.checkStatus = false;
          v.checkDisabled = false;
          return v;
        });
      }
      this.setState({
        useListVOS: res.useListVOS,
        noUseListVOS: res.noUseListVOS,
      });
    });
    this.setState({
      visibleUserMes: true,
    });
  }

  handleUserCancel = () => {
    this.setState({
      showNewAccount: true,
      visibleUserMes: false,
    });
  }

  handlUserDel = () => {
    this.setState({
      visibleUserMes: false,
    });
  }

  handleUserMesOk = () => {
    const { useListVOS } = this.state;
    const someItem = useListVOS.filter((v) => {
      return v.checkStatus == true;
    });
    if (someItem.length != 0) {
      this.setState({
        secConfirmMes: someItem,
        visibleSecConfirm: true,
      });
    } else {
      message.warning('请勾选沿用账户');
    }
  }

  handlSecUserDel = () => {
    this.setState({
      visibleSecConfirm: false,
    });
  }

  confirmSecItem = () => {
    const { secConfirmMes } = this.state;
    const currentData = {
      userCustId: secConfirmMes[0].userCustId,
    };
    model.financial.openAccount(currentData).then((res) => {
      if (res) {
        const { history } = this.props;
        history.push({ pathname: '/financial/accountmes' });
      }
    });
  }


  render() {
    const { owner, firstOwner, secOwner, thrOwner, imageUrl5, imageUrl2, imageUrl3,
      imageUrl4, imageUrl6, imageUrl10, imageUrl1, imageUrl14, imageUrl15,
      isTypeCard, options, isDisabled, isChecked, currentArea, visibleItem } = this.state;
    const { firColumns, secColumns, useListVOS, noUseListVOS, showNewAccount, visibleUserMes, visibleSecConfirm, secConfirmData, secConfirmMes, buttonDisabled } = this.state;
    return (
      /** Layout-admin:Start */
      <section>
        {/* 主体类型 */}
        <FormControl.Wrapper ref={(el) => { this.myFirstForm = el; }} value={firstOwner}>
          <section className={styles.secopen}>
            <div className={styles.borderstyle}>
              {this.evelinemes(
                {
                  title: '注册主体类型选择',
                  type: 'select',
                  nametype: 'ismargortype',
                  placehodler: '请选择注册主体类型',
                  borderNone: 0,
                  onCorChange: (e) => { this.onItemChange(e); },
                  dataSource: [{ label: '企业', value: 1 }, { label: '个体', value: 2 }, { label: '个人', value: 3 }],
                  style: { width: '60%' },
                },
                {
                  buttonType: 'buttonType',
                }
              )}
            </div>
          </section>
        </FormControl.Wrapper>
        {showNewAccount ? (
          <section>
            {/* 企业账户申请 */}
            {firstOwner.ismargortype === 1 ? (
              <FormControl.Wrapper ref={(el) => { this.mySecForm = el; }} value={owner}>
                {/* 组织信息 */}
                <section className={styles.secopen}>
                  <BoxTitle
                    title="组织信息填写"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      {
                        title: '企业证件类型',
                        type: 'select',
                        style: { width: '100%' },
                        nametype: 'corpLicenseType',
                        placehodler: '请选择企业证件类型',
                        onCorChange: (e) => { this.onCorChange(e); },
                        dataSource: [{ label: '三证合一', value: 2 }, { label: '普通证照', value: 1 }],
                      },
                      { title: '企业名称', type: 'text', nametype: 'soloName', placehodler: '输入企业名称', dataSource: [] },
                    )}
                    {isTypeCard !== 1 ? (
                      <>
                        {this.evelinemes(
                          { title: ' 统一社会信用代码', type: 'text', nametype: 'socialCreditCode', placehodler: '请输入统一社会信用代码', dataSource: [] },
                          { title: '企业固定电话', type: 'text', nametype: 'soloFixedTelephone', placehodler: '请输入企业固定电话' },
                        )}
                        <div className={styles.cardUpload}>
                          {this.uploadTypeMes([{ title: '信用代码证件', uploadType: imageUrl6, typeNum: 6, uploadTypeString: 'imageUrl6' }], 3)}
                        </div>
                      </>
                    )
                      : (
                        <>
                          {this.evelinemes(
                            { title: '营业执照注册号', type: 'text', nametype: 'businessCode', placehodler: '请输入营业执照注册号' },
                            { title: '组织机构代码', type: 'text', nametype: 'institutionCode', placehodler: '请输入组织机构代码' },
                          )}
                          {this.evelinemes(
                            { title: '税务登记证号', type: 'text', nametype: 'taxCode', placehodler: '请输入税务登记证号' },
                            { title: '企业固定电话', type: 'text', nametype: 'soloFixedTelephone', placehodler: '请输入企业固定电话' },
                          )}
                          <div className={styles.cardUpload}>
                            {this.uploadTypeMes([
                              { title: '信用代码证件', uploadType: imageUrl6, typeNum: 6, uploadTypeString: 'imageUrl6' },
                              { title: '税务登记号', uploadType: imageUrl3, typeNum: 3, uploadTypeString: 'imageUrl3' },
                              { title: '组织机构代码', uploadType: imageUrl2, typeNum: 2, uploadTypeString: 'imageUrl2' },
                            ], 3)}
                          </div>
                        </>
                      )}

                  </div>
                </section>
                {/* 负责人信息 */}
                <section className={styles.secopen}>
                  <BoxTitle
                    title="负责人信息填写"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '控股股东（实际控股人）', type: 'text', nametype: 'custName', placehodler: '请输入控股股东（实际控股人）', dataSource: [] },
                      {
                        title: '控股人证件类型',
                        type: 'select',
                        nametype: 'idCardType',
                        placehodler: '请选择控股人证件类型',
                        dataSource: [
                          { label: '身份证', value: 10 },
                          { label: '护照', value: 11 },
                        ],
                      },
                    )}
                    {this.evelinemes(
                      { title: '控股人证件号码', type: 'text', nametype: 'idCard', placehodler: '请输入控股人证件号码', dataSource: [] },
                    )}
                    {this.evelinemes(
                      { title: '法人姓名', type: 'text', nametype: 'legalName', placehodler: '请输入法人姓名', dataSource: [] },
                      {
                        title: '法人证件类型',
                        type: 'select',
                        nametype: 'legalIdCardType',
                        placehodler: '请选择法人证件类型',
                        style: { width: '100%' },
                        dataSource: [
                          { label: '身份证', value: 10 },
                          { label: '护照', value: 11 },
                        ],
                      },
                    )}
                    {this.evelinemes(
                      { title: '法人证件号码', type: 'text', nametype: 'legalIdCard', placehodler: '请输入法人证件号码', dataSource: [] },
                      { title: '法人证件起始日期', type: 'date-range', nametype: 'dateTime', placehodler: '', dataSource: [] },

                    )}
                    {this.evelinemes(
                      { title: '法人手机号码', type: 'text', nametype: 'legalMobile', placehodler: '请输入法人手机号码', dataSource: [] },
                      { title: '企业联系人姓名', type: 'text', nametype: 'contactName', placehodler: '请输入企业联系人姓名', dataSource: [] },
                      { maxlength: '11' }
                    )}
                    {this.evelinemes(
                      { title: '联系人手机号码', type: 'text', nametype: 'contactMobile', placehodler: '请输入联系人手机号码', dataSource: [] },
                      { title: '联系人Email', type: 'text', nametype: 'contactEmail', placehodler: '请输入联系人Email', dataSource: [] },
                      { maxlength: '11' }
                    )}
                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([
                        { title: '法人证件正面', uploadType: imageUrl4, typeNum: 4, uploadTypeString: 'imageUrl4' },
                        { title: '法人证件反面', uploadType: imageUrl10, typeNum: 10, uploadTypeString: 'imageUrl10' },
                      ], 3)}
                    </div>
                  </div>
                </section>
                {/* 银行信息 */}
                <section className={styles.secopen}>
                  <BoxTitle
                    title="银行相关信息"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '开户银行账户名', type: 'text', nametype: 'bankAcctName', placehodler: '请输入开户银行账户名', dataSource: [] },
                      { title: '开户银行账号', type: 'text', nametype: 'bankAcctNum', placehodler: '请输入开户银行账号', dataSource: [] },
                    )}
                    {this.evelinemes(
                      { title: '开户银行', type: 'text', nametype: 'bankName', placehodler: '请输入开户银行', dataSource: [] },
                      { title: '开户银行支行名称', type: 'text', nametype: 'bankBranch', placehodler: '请输入开户银行支行名称', dataSource: [] },
                    )}
                    <div className={styles.secOpenmes}>
                      <div className={styles.leftopen}>
                        <div className={styles.textleft}>
                          <div>
                            <span className={styles.xingStyle}>*</span>
                            <span>
                              开户银行所在地区
                            </span>
                          </div>
                        </div>
                        <div className={styles.textright}>
                          <Cascader options={options} value={currentArea} onChange={(e, selectCity) => this.onCityChange(e, selectCity)} style={{ width: '100%' }} placeholder="请选择开户银行所在地区" />
                          <FormControl type="empty" required name="backAreaMes" verifMessage="这是一个必填项哦" />
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '36px', background: '#FAFAFA' }}>
                      <div className={styles.textleft} style={{ height: '36px' }}>
                        <div>
                          <span className={styles.xingStyle}>*</span>
                          <span>
                            “对公账户信息”提供印鉴卡、银行流水单号、银行开户许可证、银行开户回执单，4项中任选一即可。“对公账户信息”中必须显示对应银行的支行信息，并附有银行公章
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([
                        { title: '对公账户信息', uploadType: imageUrl5, typeNum: 5, uploadTypeString: 'imageUrl5' },
                      ], 3)}
                    </div>
                  </div>
                </section>
              </FormControl.Wrapper>
            ) : ''}

            {/* 个体账户申请 */}
            {firstOwner.ismargortype === 2 ? (
              <FormControl.Wrapper ref={(el) => { this.myThrForm = el; }} value={secOwner}>
                <section className={styles.secopen}>
                  <BoxTitle
                    title="组织信息填写"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      {
                        title: ' 个体户名称',
                        type: 'text',
                        nametype: 'soloName',
                        placehodler: '请输入个体户名称',
                      },
                      { title: '营业执照注册号', type: 'text', nametype: 'businessCode', placehodler: '请输入营业执照注册号', dataSource: [] },
                    )}
                    {this.evelinemes(
                      {
                        title: '证照起始结束日期',
                        type: 'date-range',
                        nametype: 'dateTime',
                        buttonType: 'endForever',
                        style: { position: 'relative' },
                      },
                      { title: '个体户经营地址', type: 'text', nametype: 'soloBusinessAddress', placehodler: '请输入个体户经营地址', dataSource: [] },
                    )}
                    {this.evelinemes(
                      {
                        title: '个体户注册地址',
                        type: 'text',
                        nametype: 'soloRegAddress',
                        placehodler: '请输入个体户注册地址',
                      },
                      { title: '个体户固定电话', type: 'text', nametype: 'soloFixedTelephone', placehodler: '请输入个体户固定电话', dataSource: [] },
                      {},
                      { maxlength: '11' }
                    )}
                    {this.evelinemes(
                      {
                        title: '经营范围',
                        type: 'text',
                        nametype: 'businessScope',
                        placehodler: '请输入经营范围',
                      }
                    )}
                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([
                        { title: '营业执照', uploadType: imageUrl1, typeNum: 1, uploadTypeString: 'imageUrl1' },
                      ], 4)}
                    </div>
                  </div>
                </section>

                <section className={styles.secopen}>
                  <BoxTitle
                    title="负责人信息填写"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '法人姓名', type: 'text', nametype: 'legalName', placehodler: '请输入法人姓名', dataSource: [] },
                      {
                        title: '职业',
                        type: 'select',
                        nametype: 'occupation',
                        placehodler: '请输入职业',
                        dataSource: [
                          { label: '国家机关、党群机关、企事业单位负责人', value: '01' },
                          { label: '金融业从业人员', value: '02' },
                          { label: '房地产业从业人员', value: '03' },
                          { label: '商贸从业人员', value: '04' },
                          { label: '自由职业者', value: '05' },
                          { label: '科教文从业人员', value: '06' },
                          { label: '制造业从业人员', value: '07' },
                          { label: '卫生行业从业人员', value: '08' },
                          { label: 'IT业从业人员', value: '09' },
                          { label: '农林牧渔劳动者', value: '10' },
                          { label: '生产工作、运输工作和部分体力劳动者 ', value: '11' },
                          { label: '退休人员', value: '12' },
                          { label: '不便分类的其他劳动者', value: '13' },
                        ],
                      },
                    )}
                    {this.evelinemes(
                      {
                        title: '法人证件类型',
                        type: 'select',
                        nametype: 'legalIdCardType',
                        placehodler: '请选择法人证件类型',
                        style: { width: '100%' },
                        dataSource: [
                          { label: '身份证', value: '10' },
                          { label: '护照', value: '11' },
                          { label: '军官证', value: '12' },
                          { label: '士兵证', value: '13' },
                          { label: '回乡证', value: '14' },
                          { label: '户口本', value: '15' },
                          { label: '警官证', value: '16' },
                          { label: '台胞证', value: '17' },
                          { label: '其他', value: '22' },
                        ],
                      },
                      { title: '法人证件号码', type: 'text', nametype: 'legalIdCard', placehodler: '请输入法人证件号码', dataSource: [] },
                    )}
                    {this.evelinemes(
                      { title: '法人证件起始日期', style: { width: '100%' }, type: 'date-range', nametype: 'legaDateTime', placehodler: '', dataSource: [] },
                      { title: '法人手机号码', type: 'text', nametype: 'legalMobile', placehodler: '请输入法人手机号码', dataSource: [] },
                      {},
                      { maxlength: '11' }
                    )}
                    {this.evelinemes(
                      { title: '企业联系人姓名', type: 'text', nametype: 'contactName', placehodler: '请输入企业联系人姓名', dataSource: [] },
                      { title: '联系人手机号码', type: 'text', nametype: 'contactMobile', placehodler: '请输入联系人手机号码' },
                      {},
                      { maxlength: '11' }
                    )}
                    {this.evelinemes(
                      { title: '联系人Email', type: 'text', nametype: 'contactEmail', placehodler: '请输入联系人Email', dataSource: [] },
                    )}
                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([
                        { title: '法人证件正面', uploadType: imageUrl4, typeNum: 4, uploadTypeString: 'imageUrl4' },
                      ], 4)}
                      {this.uploadTypeMes([
                        { title: '法人证件反面', uploadType: imageUrl10, typeNum: 10, uploadTypeString: 'imageUrl10' },
                      ], 4)}
                    </div>
                  </div>
                </section>

                <section className={styles.secopen}>
                  <BoxTitle
                    title="银行相关信息"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '开户银行账号', type: 'text', nametype: 'bankAcctNum', placehodler: '请输入开户银行支行名称', dataSource: [], onBulerMes: (e) => { this.searchBank(e, 2); } },
                      { title: '开户银行', type: 'text', nametype: 'bankName', placehodler: '请输入开户银行', dataSource: [], isItemDisabled: 'disabled' },
                    )}

                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([
                        { title: '银行卡正面', uploadType: imageUrl14, typeNum: 14, uploadTypeString: 'imageUrl14' },
                      ], 4)}

                      {this.uploadTypeMes([
                        { title: '银行卡正面', uploadType: imageUrl15, typeNum: 15, uploadTypeString: 'imageUrl15' },
                      ], 4)}
                    </div>
                  </div>
                </section>

              </FormControl.Wrapper>
            ) : ''}
            {/* 个人账户申请 */}
            {firstOwner.ismargortype === 3 ? (
              <FormControl.Wrapper ref={(el) => { this.myFourForm = el; }} value={thrOwner}>

                <section className={styles.secopen}>
                  <BoxTitle
                    title="负责人信息填写"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '姓名', type: 'text', nametype: 'userName', placehodler: '请输入姓名', dataSource: [], required: '' },
                      { title: '身份证号码', type: 'text', nametype: 'idCard', placehodler: '请输入身份证号码', dataSource: [] },
                    )}
                  </div>
                </section>

                <section className={styles.secopen}>
                  <BoxTitle
                    title="银行相关信息"
                    className="mb10"
                  />
                  <div className={styles.borderstyle}>
                    {this.evelinemes(
                      { title: '开户银行账号', type: 'text', nametype: 'cardNum', placehodler: '请输入开户银行支行名称', dataSource: [], onBulerMes: (e) => { this.searchBank(e, 3); } },
                      { title: '开户银行', type: 'text', nametype: 'bankName', placehodler: '请输入开户银行', dataSource: [], isItemDisabled: 'disabled', required: '1111' },
                    )}
                    {this.evelinemes(
                      { title: '银行预留手机号码', type: 'text', nametype: 'userMobile', placehodler: '请输入银行预留手机号码', dataSource: [] },
                      null,
                      { maxlength: 11 },
                    )}
                  </div>
                </section>

              </FormControl.Wrapper>
            ) : ''}
            <div className={styles.postItem}>
              <div />
              <div className={styles.allCheckItem}>
                <Checkbox checked={isChecked} onChange={this.onChangeBusinessItem}>
                  我已同意
                </Checkbox>
                <a style={{ color: '#1548F4', cursor: 'pointer' }} onClick={this.openItem}>《汇付天下开户服务协议》</a>
                <Button disabled={isDisabled} type="primary" onClick={() => this.postAllForm(firstOwner.ismargortype)}>提交</Button>
              </div>
            </div>
          </section>
        )
          : null}


        <Modal
          title="支付服务协议"
          visible={visibleItem}
          onOk={this.handleOk}
          width={780}
          bodyStyle={{ maxHeight: '500px', overflow: 'scroll' }}
          onCancel={this.handleCancel}
        >
          <div style={{ textIndent: '10px' }}>
            <p>本支付服务协议（以下简称“本协议”）由上海汇付数据服务有限公司（以下简称“本公司”）和由为xxxx公司负责运营管理的网站（以下简称“网站”）或/且移动客户端（以下简称“移动客户端”）的注册个人或企业用户（以下简称“用户”）签订。网站及移动客户端等统称“入驻平台”。本公司仅为用户提供支付服务。</p>
            <p>进行本次注册操作的个人（您）应具有法律规定的完全民事权利能力和行为能力，且为能够独立承担民事责任的自然人。如注册用户为企业用户，您应当已经取得了企业用户的合法授权，您的操作及行为代表企业用户之真实意愿，即视为企业用户的操作及行为。如您不符合上述要求应立即停止注册和使用唯一标识。</p>
            <p>【审慎阅读】本公司在此特别提醒用户在点击同意本协议之前，务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议管辖条款。除非用户接收本协议所有条款，否则用户将无权使用本公司于本协议项下所提供的服务。用户一经使用本公司的服务即视为用户对本协议全部条款已充分理解并完全接受。如有违反，用户将独立承担相应的法律责任及法律后果。</p>
            <p>一、支付服务协议的确认</p>
            <p>二、支付服务的相关定义</p>
            <p>三、唯一标识的注册和使用</p>
            <p>四、唯一标识的服务内容</p>
            <p>五、使用唯一标识的注意事项</p>
            <p>六、用户合法、合规使用唯一标识的承诺</p>
            <p>七、用户权益保障和隐私保护</p>
            <p>八、责任限制</p>
            <p>九、知识产权的保护</p>
            <p>十、违约责任</p>
            <p>十一、法律适用和管辖</p>
            <p>一、支付服务协议的确认</p>
            <p>1.本协议有助于用户了解本公司为用户提供的本协议项下的服务内容及用户使用服务的权利和义务，请用户仔细阅读（特别是以粗体标注的内容）。</p>
            <p>2.本协议同时包括《支付服务协议》以及本公司可能不时发布的相关协议、服务声明、各项规则等内容。所有相关协议、声明、规则为本协议不可分割的一部分，与本协议具有同等法律效力。各相关协议、声明、规则有约定，而本协议没有约定的，以各相关协议、声明、规则约定为准。</p>
            <p>3.在本协议履行的过程中，本公司有权根据国家法律法规变化以及公司业务发展情况，在必要时修改本协议，本协议一旦发生变动，将会以移动客户端界面或网站公告的方式予以公布，不再另行单独通知用户。如果用户继续使用本公司的服务，则视为用户已经理解、同意并接受本协议的修改，也将遵循修改后的协议来使用本公司的服务；同时，就用户在本协议修改前通过移动客户端或网站发生的交易及其效力，视为用户已同意并已按照本协议及有关规则进行了相应的授权和追认。若用户不同意修改后的协议内容，请立即停止使用本公司提供的服务。</p>
            <p>二、支付服务相关的定义</p>
            <p>1.唯一标识（或账户）：指用户通过向本公司提交身份要素，经过身份认证并且用户同意本协议后，本公司为用户开立的用于记录预付交易资金待结算资金、用户凭以发起支付指令、反映交易明细信息的电子簿记。</p>
            <p>2.身份要素：指本公司用于识别用户身份的信息要素，包括但不限于用户的姓名、身份证件、身份证件号、生物识别信息（例如人脸信息等）、手机号码、短信验证码等信息。如注册用户为企业用户，则包括但不限于用户的名称、地址、经营范围、统一社会信用代码或组织机构代码、营业执照、事业单位法人证书、法定代表人或负责人本人的身份证明及影音资料、电话号码等信息。</p>
            <p>3.有权机关：指依照法律法规等有权要求采取查询、冻结或扣划资金等措施的单位，包括但不限于公安机关、检察院、法院、海关、税务机关等。</p>
            <p>4.冻结：指按照前述有权机关要求进行的冻结。被冻结待结算资金不能用于支付、提现或转账等，被冻结账户可能无法使用。</p>
            <p>5.限制：指除有权机关冻结情况之外，用户的唯一标识部分或全部功能不能使用，以及唯一标识待结算资金不能使用。</p>
            <p>6.止付：指唯一标识待结算资金不能使用的限制措施，例如不能用于支付、提现或转账等服务。</p>
            <p>三、唯一标识的注册和使用</p>
            <p>(一)唯一标识的注册</p>
            <p>1.用户应为具有法律规定的完全民事权利能力和行为能力且为能够独立承担民事责任的自然人、合法开展经营活动或其他业务的法人或其他组织或机构。若用户不具备前述条件，应立即停止注册和使用唯一标识。</p>
            <p>2.用户应使用真实身份信息注册并使用唯一标识，并依注册提示提供用户的正确、完整、有效的相关资料及其他必要的身份要素，用户不得冒用或妨碍其他组织、机构或个人注册使用唯一标识。</p>
            <p>3.用户有义务维护和更新用户的身份要素，确保其持续的准确性、完整性和有效性，并承担因用户的身份要素缺失、陈旧或不真实而造成的任何损失。若本公司有合理理由怀疑用户提供的身份信息及相关资料错误、不实、过时或不完整的，本公司有权暂停或终止向用户提供部分或全部支付服务，并对此不承担任何责任。</p>
            <p>4.本公司有权通过银行或其他第三方机构验证用户的身份要素。本公司有权将从用户采集的身份要素提供给第三方校验，以便进行身份认证第三方也有权将用户的信息提供给本公司，以便本公司进行验证。</p>
            <p>(二)唯一标识的使用</p>
            <p>身份要素是本公司识别用户身份的依据，请用户务必妥善保管。使用身份要素进行的操作、发出的指令视为用户本身做出。因用户的原因造成的唯一标识、密码等信息被冒用、盗用或非法使用，由此引起的风险和损失需要由用户自行承担。 用户同意：</p>
            <p>1.本公司有权在首笔交易时自助识别用户身份，方式包括但不限于小额对公打款验证方式等。</p>
            <p>2.本公司有权根据用户风险承受能力设立相匹配的单笔和单日累计交易限额。</p>
            <p>3.妥善保管唯一标识及密码，不应转让或借予他人使用，用户应对以该账户进行的一切活动承担全部法律责任。如因用户泄露密码或身份信息导致无法使用本协议项下服务或发生资金被盗等权益受损，本公司不承担责任。</p>
            <p>4.如发现有他人冒用或盗用唯一标识及密码等任何其他未经合法授权之情形，或发生其他可能危及到用户资金安全情形时，应立即以有效方式通知本公司，向本公司申请暂停相关服务。如因用户未能及时有效通知，本公司对造成的损失不承担任何责任。本公司对用户的请求采取行动需要合理期限，在此之前，本公司对已执行的指令及(或)所导致的用户的损失不承担任何责任。</p>
            <p>5.唯一标识仅限用户本人或本主体使用，不得向任何其他第三方出售、出租、转让或者以其他形式进行有偿或无偿转让或提供使用。</p>
            <p>6.合理使用唯一标识，不从事任何违反法律、法规等具有约束力的规范性文件的行为。</p>
            <p>7.基于运行和交易安全的需要，本公司可能会暂停或者限制唯一标识的部分服务功能，或增加新的功能。</p>
            <p>8.为了维护良好的网络环境，本公司有时需要了解用户使用支付服务的真实背景及目的，如要求用户提供相关信息或资料的，还需用户配合提供。</p>
            <p>9.为了用户的交易安全，在使用支付服务时，请用户事先自行核实交易对方的身份信息（如交易对方是否具有完全民事行为能力）并谨慎决定是否使用支付服务与对方进行交易。</p>
            <p>10.当用户向企业用户付款时，企业用户会将用户的支付金额、支付对象传输给本公司以确认是否是用户的真实意思表示。本公司将按照法律法规及监管规定，对企业用户进行管理，如识别、防止其套取现金或欺诈，企业用户会将购买商品、收货地址、联系方式提供给本公司。</p>
            <p>11.若存在用户使用唯一标识待结算资金服务的多订单合并付款功能时，即一笔款项同时向多个网站或移动客户端的企业用户付款的情形，用户不可撤销的授权本公司将一笔交易资金分别向多个企业用户支付。若用户依据网站或移动客户端交易规则，发起部分订单的退款，相应订单的交易资金（扣除依据网站或移动客户端交易规则约定不予退回的费用）将退回至用户原付款账户。</p>
            <p>12.当用户的支付账号出现异常风险或超过六个月无任何主动交易时，本公司有权关闭用户的唯一标识部分功能（包括但不限于：支付、提现、转账等），如用户需重新启用需要通过身份验证方可再次激活该唯一标识。</p>
            <p>四、唯一标识的服务内容</p>
            <p>支付服务是由本公司向用户提供的服务总称，包括本公司受用户委托向用户提供唯一标识、收付款等账户管理、资金转移服务。收付款服务是本公司受用户委托，为用户提供代为收取或代为支付款项的服务。用户向本公司发出代收款项的指令后，非经法律程序或非依本协议之约定，该指令不可撤销。</p>
            <p>通过唯一标识实现收付款的功能有如下几类：</p>
            <p>1.充值：注册完成后，用户即可将同名银行卡内的资金划转至唯一标识。充值完成，即视为用户将充值资金交付本公司保管。充值方式包括但不限于：网银、银行卡快捷支付方式、条码支付方式等</p>
            <p>2.提现：用户可对唯一标识的待结算资金划转至用户同名的银行账户。该银行账户开户名需与用户的姓名或名称一致。除被有权机关冻结、止付或被采取其他限制措施外，本公司将于收到提现指令后的合理时间内，将相应款项汇入该银行账户。用户理解，根据用户提供的账户所属银行不同或资金清算通道不同，或会有到账时间差异，本公司不对到账时间作保证。</p>
            <p>3.转账：用户可以委托本公司将用户唯一标识中的款项转至收款方在本公司开立的唯一标识。为确保用户的资金和财产安全，用户在使用转账服务时，请用户谨慎核对收款方信息，包括但不限于收款方的真实身份及准确的账户名等信息。</p>
            <p>4.消费：用户可通过支付服务实现消费。消费方式包括但不限于：待结算资金支付、银行卡支付、银行卡快捷支付、条码支付等。用户使用上述支付方式进行消费的，相关付款账户必须为该企业所有且待结算资金充足。根据平台需求，用户可开通使用下述消费增值功能中的一种或多种：</p>
            <p>（1）即时到账：客户无需确认收货即向本公司提交向企业用户付款的指令，本公司按此指令在合理的时间内划付资金的服务。基于客户用户对交易对方的充分了解(包括但不限于对方的真实身份及确切的账户名等)，客户用户不可撤销的授权本公司有权按照其发出的指令将款项的全部或部分支付给交易对方，客户用户应自行判断对方是否是完全民事行为能力人并自行决定是否与对方进行交易，承担因其指示错误(失误)而导致的风险。本公司依照客户用户指示的收款方并根据本协议的约定完成交易后，即完成了当次服务的所有义务，对于收付款双方之间产生的关于当次支付的任何纠纷不承担任何责任，客户用户应当自行处理相关的纠纷。</p>
            <p>（2）担保交易：为了解决客户和企业用户网上交易的信任问题，客户用户按照交易流程点击确认收货后，本公司再将代为收取的客户用户支付的款项代为支付给企业用户，该项服务本公司不承担任何交易担保责任。基于客户用户对交易对方的充分了解(包括但不限于对方的真实身份及确切的账户名等)，客户用户不可撤销的授权本公司有权按照其发出的指令将款项的全部或部分支付给交易对方，客户用户应自行判断对方是否是完全民事行为能力人并自行决定是否与对方进行交易，用户承担因自身指示错误(失误)而导致的风险。本公司依照客户用户指示的收款方并根据本协议的约定完成交易后，即完成了当次服务的所有义务，对于收付款双方之间产生的关于当次支付的任何纠纷不承担任何责任，客户用户应当自行处理相关的纠纷。</p>
            <p>5.分账：企业用户知悉同意：若其选择开通分账功能，企业用户应与被分账方签署相应的授权开通协议。本公司将根据企业用户的指令将代为收取的交易款项，依据企业用户的分账指令，部分代为划付至被分账方，部分代为划付至相应的交易对手方。企业用户不得以收取的款项与交易的款项不一致为由或分账金额不准确为由向本公司提出争议。</p>
            <p>企业用户不可撤销的授权本公司开通分账功能。企业用户知悉：若企业用户开通分账功能，本公司将根据企业用户的指令将代为收取的交易款项，依据企业用户的分账指令，部分划付至企业用户的账户，部分代为划付至相应的交易对手方（如：供应商、入驻平台等）。一经开通分账功能，相关分账指令企业用户授权由其所入驻平台代为向本公司提交。</p>
            <p>若依据平台交易规则，买卖双方确认交易存在退款的情形，本公司将从企业用户的结算账户中将应退款项退还至原付款账户；企业用户应保证结算账户的待结算资金充足，结算待结算资金不足，企业用户应及时补足。否则，由此产生的任何争议给本公司造成损失的，本公司有权追究企业用户的责任。</p>
            <p>针对该项服务，企业用户保证提供给入驻平台的授权合法有效，并在协议或业务规则中予以明确约定，本公司有权随时调取该合作协议或业务规则。</p>
            <p>6.收款：本公司根据用户及付款方的指令向用户提供指定账户的收款服务。</p>
            <p>7.生利宝。本公司向用户提供的，通过基金公司系统在本公司的网上直销自助前台系统向用户提供的货币基金交易资金的划转及在线进行货币基金交易、信息查询等服务。本服务中，用户知悉同意，本公司仅为支付渠道提供方，并非理财产品购买协议的参与方，不对理财产品购买协议的协议方任何口头、书面陈述之真实性、合法性做任何明示或暗示的担保或对此承担任何责任，不对相关基金公司及任何第三方的法定义务和/或契约责任承担任何连带责任。本公司亦不参与理财产品协议交易资金划转及支付环节之外的任何理赔、纠纷处理等活动，也不保证理财产品之盈亏。</p>
            <p>8.本公司有权随时增加、减少或改造服务内容，并同时新增或调整相应规则，届时本公司将通过移动客户端公告的方式予以公布，不做另行通知。若用户在本公司公告规则后继续使用本服务的，表示用户已充分阅读、理解并接受新增或调整的规则内容。</p>
            <p>五、使用唯一标识的注意事项</p>
            <p>为了保障用户使用本公司支付服务时的合法权益，本公司提醒用户注意以下事项：</p>
            <p>（一）身份认证</p>
            <p>1.身份认证是指：根据法律法规及监管规定，用户按照要求向本公司提交本人真实、完整、有效的含有身份要素的信息及证明材料（企业用户包括但不限于营业执照、事业单位法人证书、法定代表人或负责人本人的身份证明及影音资料、电话号码等信息及证明材料），并授权本公司通过银行或其他第三方机构验证用户的身份信息，或通过第三方获得用户相关信息。由于身份认证或交易验证不通过的，本公司有权拒绝提供支付服务。用户申请身份认证应同时遵守以下几点：</p>
            <p>（1）用户不得冒用任何第三方名义进行身份认证；</p>
            <p>（2）用户有义务维护和更新身份信息，确保其持续的准确性、完整性和有效性。用户通过身份认证后需要对信息修改的，应向本公司提交相应资料，由本公司重新认证后进行修改；</p>
            <p>（3）用户承担因身份信息缺失、陈旧或不真实而造成的任何损失，若本公司有合理理由怀疑用户的身份信息不真实、不合法或过时的，本公司有权不经通知先行暂停或终止为用户提供任何账户服务；</p>
            <p>（4）用户同意本公司保存用户提交的身份信息。</p>
            <p>2.为了满足相关监管规定的要求，也为了用户的资金安全，在出现下列情形时，请用户积极配合本公司核对用户的有效身份证件或其他必要身份要素，留存有效身份证件的彩色照片，且完成相关身份认证：</p>
            <p>（1）用户办理充值、收取或支付超过指定限额的（限额以最新的监管规定及本公司最新的风险管控要求为准）；</p>
            <p>（2）用户使用本公司的服务购买理财产品的；</p>
            <p>（3）用户要求变更身份信息或用户身份信息已过有效期的；</p>
            <p>（4）用户的交易行为或交易情况出现异常的；</p>
            <p>（5）用户的身份信息或相关资料存在疑点的；</p>
            <p>（6）存在应核对或留存用户身份证件或其他必要文件的其他情形的。</p>
            <p>3.为了满足相关监管规定的要求，请用户按照本公司要求的时间提供用户的身份信息以完成身份认证，否则用户可能无法进行收款、提现、转账、购买理财产品等操作，且本公司可能对用户的账户待结算资金进行止付或关闭用户的唯一标识。</p>
            <p>4.若用户存在如下情形时，本公司有权采取包括但不限于以下措施：有权不经通知先行暂停、中止或终止用户名下全部或部分唯一标识的使用（包括但不限于对账户名下的款项和在途交易采取取消交易、止付等限制措施）。</p>
            <p>（1）用户违反了法律法规的规定或本协议的约定；</p>
            <p>（2）根据相关法律法规或有权机关的要求；</p>
            <p>（3）用户的账户操作、资金流向等存在异常时；</p>
            <p>（4）用户的账户可能产生风险的；</p>
            <p>（5）用户在参加市场活动时有批量注册唯一标识、交易内容不符或作弊等违反活动规则、违反诚实信用原则的；</p>
            <p>（6）他人向用户唯一标识错误汇入资金等导致用户可能存在不当获利的；用户遭到他人投诉，且对方已经提供了一定证据的；</p>
            <p>（7）用户可能错误地操作他人唯一标识，或者将他人账户进行了身份验证的。</p>
            <p>除（1）、（2）规定的情形外，如用户申请恢复服务、解除上述止付或限制，请用户向本公司提供相关资料及身份证明等文件，以便本公司进行核实。</p>
            <p>（二）支付服务规则</p>
            <p>（1）本公司有权根据《非金融机构支付服务管理办法》、《非银行支付机构网络支付业务管理办法》等相关规定对用户唯一标识功能和交易额度进行限制和调整。当用户的身份认证和交易校验情况符合（或不满足）相关规定时，本公司有权对用户拥有的唯一标识采取开启（关闭）相关功能、增加（或降低）交易额度的措施，并要求用户补充提交相关信息。若用户拒不提交，或提交的信息仍不符合相关规定，本公司有权对用户采取暂停、限制或终止服务。</p>
            <p>（2）用户认可唯一标识的使用记录、交易数据等均以本公司的系统记录为准。如用户对该等数据存有异议的，可及时向本公司提出，本公司会根据用户提供的相关证据积极予以核实。</p>
            <p>（3）用户使用唯一标识的代为支付款项服务时，存在以下情况时会导致扣款不成功：</p>
            <p>A.用户指定的账户待结算资金不足；</p>
            <p>B.用户指定的账户已被采取止付、有权机关冻结或其他限制使用权限的措施；</p>
            <p>C.超出监管部门、清算机构或银行规定的付款额度。</p>
            <p>（4）本公司承担账户系统运行，向用户提供本协议所约定之各项服务。对账户系统的信息处理过程中的安全、保密、及时性负责。</p>
            <p>（5）本公司保障用户账户中的资金独立存放，本公司进行资金的止付、扣划完全来自于用户的授权或及用户对商户的授权。</p>
            <p>（6）用户不得利用本公司提供的支付服务进行任何形式的洗钱、虚假交易、资金非法套现及其它违法行为。若本公司发现用户违反本约定的，本公司可立即暂停、中止或终止支付服务，向公安部门报案且将相关信息报送有关部门。</p>
            <p>（7）用户不得利用本公司的支付服务从事任何非法行为，不得违反中国法律、法规、规章、规范性文件及政策，不得侵犯他人的合法权益，不得实施任何违反公序良俗和诚实信用的行为。否则，本公司有权立即终止本协议并按照监管银行及银联的相关规定采取措施。上述违法违规行为包括但不限于：</p>
            <p>a.从事非法交易行为，如洗钱、套现、涉赌、诈骗等行为；</p>
            <p>b.利用银行卡账户进行无真实交易背景的虚假交易，或与真实交易背景不相符的交易行为；</p>
            <p>c.使用盗窃、伪造的银行卡账户交易；</p>
            <p>d.侵害他人合法权益的；</p>
            <p>e.销售法律禁止流通、限制流通商品或提供非法服务的；</p>
            <p>f.其他违反法律法规的行为。</p>
            <p>g.如因用户违法违规行为导致的一切责任，由用户自行承担，如因上述行为造成本公司损失的，用户应予以全面赔偿。</p>
            <p>（三）本公司的承诺和声明</p>
            <p>1.本公司并非银行，本协议项下涉及的资金转移均通过银行来实现，用户接受资金在转移途中产生的合理时间。</p>
            <p>2.基于相关法律法规的规定，对本协议项下的服务，本公司均无法提供担保、垫资。</p>
            <p>3.本公司提请用户注意，唯一标识所记录的资金待结算资金不同于用户的银行存款，不受《存款保险条例》保护，其实质为用户委托本公司保管的、所有权归属于用户的预付价值。该预付价值对应的货币资金虽然属于用户，但不以用户名义存放在银行，而是以本公司的名义存放在银行，并且由本公司向银行发起资金调拨指令。</p>
            <p>4.本公司提请用户注意，本公司依据用户指令提供支付服务。非因本公司过错，产生的任何损失，由用户自行承担。若由此给第三方造成任何损失的，用户应承担全部赔偿责任。</p>
            <p>（四）风险提示</p>
            <p>1.用户充分知悉，本公司仅提供支付相关服务，用户应承担使用支付服务时其资金的货币贬值、汇率波动等风险。</p>
            <p>2.用户充分知悉，网上交易有风险，用户与他人因网上交易产生的商品或服务质量、数量、交易金额、交货时间等纠纷及损失，应由用户独立承担责任。</p>
            <p>3.用户使用本公司的服务购买金融类产品时，为了用户的利益，建议用户仔细阅读金融类产品的协议以及页面提示，确认销售机构及产品信息，谨慎评估风险后再购买。</p>
            <p>4.用户对本公司所提示的风险和列示措施、说明完全理解和同意，承诺采取相关风险防范措施以尽量避免或减小风险。</p>
            <p>（五）服务费用</p>
            <p>在用户使用相关服务时，本公司有权向用户收取相应服务费。具体收费方式及收费标准以移动客户端界面或网站所示或与本公司的其他约定为准。本公司保留制订及调整收费方式及收费标准之权利。</p>
            <p>六、用户合法使用唯一标识的承诺</p>
            <p>为贯彻落实《人民币银行结算账户管理办法》、《非银行支付机构网络支付业务管理办法》、《中国人民银行关于进一步加强支付结算管理防范电信网络新型违法犯罪有关事项的通知》等相关法律法规规定，有效应对和防范电信网络新型违反犯罪活动，保护金融消费者财产安全和合法权益，优化商户服务，用户承诺同意如下事项：</p>
            <p>1.同意并确认系自愿申请在本公司开立单位账户，并保证向本公司提交的单位账户开户证明文件真实、完整、合规，且开户文件所属人与开户申请人保持一致。</p>
            <p>2.本公司为用户开立的单位账户仅供用户在双方协议范围内合法、合规、合理使用，用户不得出租、出借、出售或有其他变相买卖单位账户的行为。如有违反，导致用户被市级及以上公安机关认定为买卖唯一标识、冒名开户等违法行为的，本公司有权依据相关法律法规的规定，5年内停暂停用户所有业务，并不再为用户开立新账户。惩戒期满后，用户如需办理新开立账户业务的，本公司有权要求用户提供账户使用相关证明文件等其他资质材料。</p>
            <p>3.用户应提高账户的合规使用意识，并配合本公司做好账户审核、动态符合、对账、风险监测及后续控制措施等工作。如遇账户变更、撤销或其他行政性变更的，应当及时告知本公司并提交相关说明和证明文件。</p>
            <p>4.用户将不断提高社会责任意识，秉持合法经营、合规使用的原则，始终把消费者合法权益的保护工作放在首位。用户愿意积极维护消费者合法权益，在发生交易风险时，同意本公司对用户采取控制账户交易等风险控制措施。</p>
            <p>5.用户需要遵守中华人民共和国相关法律法规的规定，不得将本公司的服务用于非法目的（包括用于禁止或限制交易物品的交易），也不得以非法方式使用本公司的服务。</p>
            <p>6.用户不得利用本公司提供的服务从事侵害他人合法权益的行为，否则本公司有权拒绝提供服务，且用户应承担所有相关法律责任。因用户的违法行为导致本公司损失的（包括但不限于对他方的先行赔付），本公司有权从账户待结算资金或其他本公司保管的用户资金中扣收相应赔偿金，或向用户进行追偿。违法行为包括但不限于：</p>
            <p>（1）冒用他人名义使用本服务；</p>
            <p>（2）从事洗钱、恐怖融资等行为；</p>
            <p>（3）非法使用他人银行账户或无效银行账户；</p>
            <p>（4）违反《银行卡业务管理办法》使用银行卡，或利用信用卡套取现金；</p>
            <p>（5）对账户使用过程中的任何计算机数据进行拦截、破解、篡改或对账户服务系统进行非正常的登录；</p>
            <p>（6）因欺诈、非授权交易、套现等非法行为给任何第三方造成损失的；</p>
            <p>（7）其他违反法律法规等具有约束力的规范性文件的行为。</p>
            <p>7.用户理解，本公司的服务有赖于系统的准确运行及操作。若出现系统差错、故障、或用户不当获利等情形，用户同意本公司可以采取更正差错、扣划款项等适当纠正措施。</p>
            <p>8.为防控交易风险，用户有积极协助本公司处理风险事件、调查可疑交易的义务。本公司有权在风险事件或可疑交易发生时，要求用户在合理期限前提供相关辅助材料及情况说明等相关内容以证明其行为的正常。对于用户发生的风险事件或可疑交易，本公司有权在用户提供情况说明、澄清交易事实前，暂停向用户提供服务。若用户拒绝提供或无法证明其行为正常的，则本公司有权拒绝或停止为其提供服务，造成本公司损失的，本公司有权从账户待结算资金或其他本公司保管的用户资金中扣收相应赔偿金，或向用户进行追偿。</p>
            <p>七、用户权益保障及隐私保护</p>
            <p>(一)客户权益保障承诺</p>
            <p>本公司一直秉承“客户第一”的原则，努力为用户带来微小而美好的改变，保障用户的合法权益。</p>
            <p>(二)用户资金保障</p>
            <p>本公司始终重视保护用户的资金安全，将自有资金和用户资金分开存放，承诺不挪用、占用用户资金。如用户在使用本公司支付服务的过程中，资金被盗，应立即与本公司联系。</p>
            <p>(三)隐私权保护</p>
            <p>1.本公司尊重并保护用户隐私，本公司依法收集、使用及共享用户的个人信息（个人信息是以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息，包括用户注册账户所提供的全部身份要素）。</p>
            <p>2.为本协议的目的，即用户能更好的使用本公司的服务，用户签订本协议即表示用户授权同意本公司依法可收集、使用及共享用户的个人信息。</p>
            <p>3.本公司按现有技术提供相应的安全措施来保护用户的个人信息，提供合理的安全保障，本公司将在任何时候尽力使用户的个人信息不被泄露、毁损或丢失。</p>
            <p>4.用户的交易相对方、用户访问的第三方网站经营者、用户使用的第三方服务提供者和由本公司处接受用户的个人信息的第三方可能有资金的隐私权保护政策；本公司会尽商业上的合理努力去要求这些主体对用户的个人信息采取保护措施，但本公司无法保证这些主体一定会按照本公司的要求采取保护措施，亦不对这些主体的行为及后果承担任何责任。如果用户发现这些第三方创建的网页或第三方开发的应用程序存在风险时，建议用户终止相关操作以保护用户的合法权益。</p>
            <p>八、责任限制</p>
            <p>1.因黑客攻击、计算机病毒、网络服务商或银行系统故障等非因本公司故意或重大过失而造成的用户损失，本公司不承担责任。</p>
            <p>2.因台风、地震、洪水、雷电或恐怖袭击等不可抗力造成的用户损失，本公司不承担责任。</p>
            <p>3.本公司为用户提供账户资金结算服务，对用户发生的所有投资风险不承担法律责任。不承担借款人违约损失，对用户亦不承担任何担保责任。</p>
            <p>4.在适用法律允许的最大范围内，本公司对账户系统的功能，不做任何责任的保证，不对用户因使用或不能使用所造成的任何损失承担责任。</p>
            <p>九、知识产权的保护</p>
            <p>1.本公司所有电子及其他形式的相关信息，包括但不限于程序、著作、表格、图片、档案、资料、信函等均由本公司或相关主体拥有知识产权。</p>
            <p>2.非经本公司书面同意，用户除使用服务需要外，不得复制、篡改、传播、发行或以任何其他形式向第三方披露。</p>
            <p>3.用户不得对本公司的系统和程序采取反向工程手段进行破解，不得对上述系统和程序（包括但不限于源程序、目标程序、技术文档、客户端至服务器端的数据、服务器数据）进行复制、修改、编译、整合或篡改，不得修改或增减本公司系统的功能。</p>
            <p>十、违约责任</p>
            <p>用户因违反本协议及任何账户相关业务规则，均构成违约。因用户违约而给本公司造成的损失的，本公司有权扣收用户的账户待结算资金或其他本公司保管的用户资金，并有权依法追究用户违约责任。</p>
            <p>十一、法律适用和管辖</p>
            <p>1.本协议的订立、生效、变更、履行、解除、终止和解释以及由此产生的所有事项均适用中华人民共和国之法律、法规。</p>
            <p>2.涉及本协议履行过程中任何之争议，均以上海市徐汇区人民法院作为诉讼管辖法院。</p>
          </div>
        </Modal>

        <Modal
          title="系统提醒"
          visible={visibleUserMes}
          width={780}
          // bodyStyle={{ maxHeight: '500px', overflow: 'scroll' }}
          onCancel={this.handlUserDel}
          footer={[
            <Button onClick={this.handlUserDel}>
              取消
            </Button>,
            <Button onClick={this.handleUserCancel}>
              开通新的汇付账户
            </Button>,
            <Button type="primary" disabled={buttonDisabled ? 'disabled' : null} onClick={this.handleUserMesOk}>
              启用原有账户
            </Button>,
          ]}
        >
          <div className={styles.intro_user}>
            您选择的汇付三方开户账号类型在汇付已经开通了如下账户，是否沿用原有账户，或是开通一个新的账户
          </div>

          <BoxTitle
            title="可沿用账户"
            className="mb10"
          />

          <Table
            dataSource={useListVOS}
            columns={firColumns}
            style={{ marginBottom: '20px' }}
            pagination={{
              hideOnSinglePage: true,
            }}
          />

          <BoxTitle
            title="不可沿用账户"
            className="mb10"
          />

          <Table
            dataSource={noUseListVOS}
            pagination={{
              hideOnSinglePage: true,
            }}
            columns={secColumns}
          />
        </Modal>

        <Modal
          title="再次确认"
          visible={visibleSecConfirm}
          width={780}
          okText="确认启用"
          onOk={this.confirmSecItem}
          // bodyStyle={{ maxHeight: '500px', overflow: 'scroll' }}
          onCancel={this.handlSecUserDel}

        >
          <div className={styles.intro_user}>
            你需要沿用的原有汇付三方账号以下账号，请二次确认！
          </div>

          <Table
            dataSource={secConfirmMes}
            columns={secConfirmData}
            pagination={{
              hideOnSinglePage: true,
            }}
          />

        </Modal>

      </section>
      /** Layout-admin:End */
    );
  }
}

export default ApliCation;
