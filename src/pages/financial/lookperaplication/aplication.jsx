import React from 'react';
import { Button, Icon } from 'antd';
import { BoxTitle, FormControl } from '@jxkang/web-cmpt';
import model from '@/model';
import styles from './index.module.styl';


class ApliCation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: {
        corpLicenseType: '',
      },
      firstOwner: {
        ismargortype: Number(props.match.params.type),
      },
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
    };
  }


  evelinemes = (parObj, secObj) => {
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
          <div className={styles.textright}>
            {parObj.innerText}
          </div>
        </div>
        {secObj ? (
          <div className={styles.rightopen}>
            <div className={styles.textleft}>
              <div>
                <span className={styles.xingStyle}>*</span>
                <span>
                  {secObj.title}
                </span>
              </div>
            </div>
            <div className={styles.textright}>
              {secObj.type == 'occupation' ? this.dealOccupation(secObj.innerText) : secObj.innerText}
            </div>
          </div>
        ) : ''}

      </div>
    );
  }

  dealOccupation = (par) => {
    const { dataSource } = this.state;
    const newData = dataSource.filter((v) => {
      return v.value == par;
    });
    return newData[0] ? newData[0].label : '';
  }

  uploadTypeMes = (uploadArr) => {
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
              {v.uploadType ? <img src={v.uploadType} alt="avatar" style={{ width: '78px', height: '56px' }} />
                : (
                  <div>
                    <Icon type={loading ? 'loading' : 'plus'} />
                  </div>
                )}
            </div>
          </div>
        );
      })
    );
  }


  componentDidMount = () => {
    const { firstOwner } = this.state;
    if (firstOwner.ismargortype != 3) {
      this.getAllImgs();
      this.getBussinessAllMes();
    } else if (firstOwner.ismargortype == 3) {
      this.getPerMes();
    }
  }

  getBussinessAllMes = () => {
    model.financial.corpInfo().then((res) => {
      const { ismargortype } = this.state.firstOwner;
      if (ismargortype === 1) {
        res.listParams = JSON.parse(res.listParams);
        res.custName = (res.listParams)[0].custName;
        res.idCardType = (res.listParams)[0].idCardType;
        res.idCard = (res.listParams)[0].idCard;
        this.setState({
          owner: res,
        });
      }
      if (ismargortype === 2) {
        this.setState({
          secOwner: res,
        });
      }
    });
  }

  getAllImgs = () => {
    model.financial.attachList().then((res) => {
      // attachType  attachFile
      res.map((v) => {
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

  postAllForm = () => {
    const { history } = this.props;
    history.push('/financial/accountmes');
  }


  render() {
    const { owner, firstOwner, secOwner, thrOwner, imageUrl5, imageUrl2, imageUrl3,
      imageUrl4, imageUrl6, imageUrl10, imageUrl1, imageUrl14, imageUrl15,
      isTypeCard } = this.state;
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
                  borderNone: 0,
                  innerText: firstOwner.ismargortype == 1 ? '企业' : `${firstOwner.ismargortype == 2 ? '个体' : `${firstOwner.ismargortype == 3 ? '个人' : ''}`}`,
                })}
            </div>
          </section>
        </FormControl.Wrapper>
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
                    innerText: owner.corpLicenseType == 1 ? '普通证照' : '三证合一',
                  },
                  { title: '企业名称', innerText: owner.soloName },
                )}
                {isTypeCard !== 1 ? (
                  <>
                    {this.evelinemes(
                      { title: ' 统一社会信用代码', innerText: owner.socialCreditCode },
                      { title: '企业固定电话', innerText: owner.soloFixedTelephone },
                    )}
                    <div className={styles.cardUpload}>
                      {this.uploadTypeMes([{ title: '信用代码证件', uploadType: imageUrl6, typeNum: 6, uploadTypeString: 'imageUrl6' }], 3)}
                    </div>
                  </>
                )
                  : (
                    <>
                      {this.evelinemes(
                        { title: '营业执照注册号', innerText: owner.businessCode, type: 'text', nametype: 'businessCode', placehodler: '请输入营业执照注册号' },
                        { title: '组织机构代码', innerText: owner.businessCode, type: 'number', nametype: 'institutionCode', placehodler: '请输入组织机构代码' },
                      )}
                      {this.evelinemes(
                        { title: '税务登记证号', innerText: owner.businessCode, type: 'text', nametype: 'taxCode', placehodler: '请输入税务登记证号' },
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
                  { title: '控股股东（实际控股人）', innerText: owner.custName },
                  {
                    title: '控股人证件类型',
                    innerText: owner.idCardType == '10' ? '身份证' : '护照',
                  },
                )}
                {this.evelinemes(
                  { title: '控股人证件号码', innerText: owner.idCard },
                )}
                {this.evelinemes(
                  {
                    title: '法人证件类型',
                    innerText: owner.legalIdCardType == '10' ? '身份证' : '护照',
                  },
                  { title: '法人证件号码', innerText: owner.legalIdCard, type: 'number', nametype: 'legalIdCard', placehodler: '请输入法人证件号码', dataSource: [] },
                )}
                {this.evelinemes(
                  {
                    title: '法人证件起始日期',
                    innerText: `${owner.legalCertStartDate}~${owner.legalCertEndDate}`,
                  },
                  {
                    title: '法人手机号码',
                    innerText: owner.legalMobile,
                  }
                )}
                {this.evelinemes(
                  {
                    title: '企业联系人姓名',
                    innerText: owner.contactName,
                  },
                  {
                    title: '联系人手机号码',
                    innerText: owner.contactMobile,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '联系人Email',
                    innerText: owner.contactEmail,
                  },
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
                  {
                    title: '开户银行账户名',
                    innerText: owner.bankAcctName,
                  },
                  {
                    title: '开户银行账号',
                    innerText: owner.bankAcctNum,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '开户银行',
                    innerText: owner.bankName,
                  },
                  {
                    title: '开户银行支行名称',
                    innerText: owner.bankBranch,
                  },
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
                      {`${owner.provinceName}/${owner.areaName}`}
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
                    innerText: secOwner.soloName,
                  },
                  { title: '营业执照注册号', innerText: secOwner.businessCode },
                )}
                {this.evelinemes(
                  {
                    title: '证照起始结束日期',
                    innerText: `${secOwner.licenseStartDate} ~ ${secOwner.licenseEndDate == '99991231' ? '永久' : secOwner.licenseEndDate}`,
                  },
                  { title: '个体户经营地址', innerText: secOwner.soloBusinessAddress },
                )}
                {this.evelinemes(
                  {
                    title: '个体户注册地址',
                    innerText: secOwner.soloRegAddress,
                  },
                  {
                    title: '个体户固定电话',
                    innerText: secOwner.soloFixedTelephone,
                  }
                )}
                {this.evelinemes(
                  {
                    title: '经营范围',
                    innerText: secOwner.businessScope,
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
                  {
                    title: '法人姓名',
                    innerText: secOwner.legalName,
                  },
                  {
                    title: '职业',
                    type: 'occupation',
                    innerText: secOwner.occupation,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '法人证件类型',
                    innerText: secOwner.legalIdCardType == '10' ? '身份证' : '护照',
                  },
                  {
                    title: '法人证件号码',
                    innerText: secOwner.legalIdCard,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '法人证件起始日期',
                    innerText: `${secOwner.legalCertStartDate} ~ ${secOwner.legalCertEndDate}`,
                    type: 'date-range',
                    nametype: 'legaDateTime',
                    placehodler: '',
                    dataSource: [],
                  },
                  {
                    title: '法人手机号码',
                    innerText: secOwner.legalMobile,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '企业联系人姓名',
                    innerText: secOwner.contactName,
                  },
                  {
                    title: '联系人手机号码',
                    innerText: secOwner.contactMobile,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '联系人Email',
                    innerText: secOwner.contactEmail,
                  },
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
                  {
                    title: '开户银行账号',
                    innerText: secOwner.bankAcctNum,
                  },
                  {
                    title: '开户银行',
                    innerText: secOwner.bankName,
                  },
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
          <FormControl.Wrapper ref={(el) => { this.myThrForm = el; }} value={thrOwner}>

            <section className={styles.secopen}>
              <BoxTitle
                title="负责人信息填写"
                className="mb10"
              />
              <div className={styles.borderstyle}>
                {this.evelinemes(
                  {
                    title: '姓名',
                    innerText: thrOwner.userName,
                  },
                  {
                    title: '身份证号码',
                    innerText: thrOwner.idCard,
                  },
                )}
                {this.evelinemes(
                  {
                    title: '银行预留手机号码',
                    innerText: thrOwner.userMobile,
                  },
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
                  {
                    title: '开户银行账号',
                    innerText: thrOwner.cardNum,
                    borderNone: 0,
                  },
                  {
                    title: '开户银行',
                    innerText: thrOwner.bankName,
                  },
                )}
              </div>
            </section>

          </FormControl.Wrapper>
        ) : ''}
        <div className={styles.postItem}>
          <div />
          <div className={styles.allCheckItem}>
            <Button type="primary" onClick={() => this.postAllForm()}>完成</Button>
          </div>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default ApliCation;
