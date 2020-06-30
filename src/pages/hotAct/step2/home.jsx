import React from 'react';
import { Card, Upload, message, Tabs, Button, Checkbox, Spin, Popover, Modal } from 'antd';
import { PreviewImage } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model, { getUploadProps, clientHeader } from '@/model';
import
// until,
{ getFileUrl } from '@/utils/index';
import {
  beforeUpload,
  beforeUploadOtherFile,
  backFun,
  setSort,
} from '@/utils/uploadImgConfig';
import styles from './index.module.styl';
import Step from '../components/Step/index';

const { TabPane } = Tabs;
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkLIst: [],
      verified: false,
      detailName: 'detailImgsMd5',
      options: [
        { label: '启用新海报', value: 'photo' },
        { label: '启用新商详', value: 'detailImgsMd5' },
        { label: '启用新素材', value: 'sourceMaterial' },
      ],
      photo11: [
      ],
      photo169: [
      ],
      photo32: [
      ],
      detailImgsMd5: [],
      sourceMaterial: [],
      mobileDetailImgsMd5: [],
      loading: false,
      tokenObj: {
        token: Common.getCookie(globalThis.webConfig.fetchTokenName),
        jdxiaokang_client: clientHeader,
      },
    };
  }

  setMain = (type, i) => {
    let dataName = '';
    if (type === 1) {
      dataName = 'photo11';
    } else if (type === 2) {
      dataName = 'photo169';
    } else {
      dataName = 'photo32';
    }
    /* eslint-disable */
    const arr = this.state[`${dataName}`];
    /* eslint-disable */
    arr.map((item) => {
      item.main = 0;
      return '';
    });
    arr[i].main = 1;
    this.setState({
      [`${dataName}`]: arr,
    });
  }

  cancelPhoto = (type, i) => {
    let dataName = '';
    if (type === 1) {
      dataName = 'photo11';
    } else if (type === 2) {
      dataName = 'photo169';
    } else {
      dataName = 'photo32';
    }
    /* eslint-disable */
    const arr = this.state[`${dataName}`];
    /* eslint-disable */
    arr.splice(i, 1)
    this.setState({
      [dataName]: arr,
    });
  }
  handleChange = (info, type) => {
    let fileName = '';
    if (type === 1) {
      fileName = 'photo11'
    } else if (type === 2) {
      fileName = 'photo169'
    } else if (type === 3) {
      fileName = 'photo32'
    }
    const list = [...info.fileList].splice(0, 5);
    list.map(item => {
      if (item.response) {
        item.photo = `${item.response.entry.filePath}`
      }
    })
    this.setState({
      [fileName]: list
    })
    backFun(info.file.status, this)
    const { checkLIst } = this.state
    if (info.file.status === 'done' && checkLIst.indexOf('photo') === -1) {
      Modal.warning({
        content: '上传了新海报，请记得勾选启用哦>O<',
      });
    }
  }
  detailImgChange = (info, name) => {
    const list = [...info.fileList];
    list.map(item => {
      if (item.response) {
        list.url = `${item.response.entry.filePath}`;
      }
    })
    this.setState({ [name]: list });
    backFun(info.file.status, this)
    const { checkLIst } = this.state
    if (info.file.status === 'done' && checkLIst.indexOf('detailImgsMd5') === -1) {
      Modal.warning({
        content: '上传了新商详，请记得勾选启用哦>O<',
      });
    }
  }
  sourceChange = (info) => {
    const sourceMaterial = [...info.fileList].slice(-1);
    this.setState({ sourceMaterial });
    backFun(info.file.status, this)
    if (info.file.status === 'done') {
      sourceMaterial[0].url = `${getFileUrl(sourceMaterial[0].response.entry.filePath)}`;
      sourceMaterial[0].postUrl = `${sourceMaterial[0].response.entry.filePath}`;
      // sourceMaterial[0].name = `${sourceMaterial[0].response.entry.originName}`
      this.setState({ sourceMaterial });
      const { checkLIst } = this.state
      if (checkLIst.indexOf('sourceMaterial') === -1) {
        Modal.warning({
          content: '上传了新素材，请记得勾选启用哦>O<',
        });
      }
    }
  }

  onCheckChange = (v) => {
    this.setState({
      checkLIst: v
    })
  }

  goBack = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/hotAct/step1/${id}`);
  }

  sub = async () => {
    const {
      photo11, photo169, photo32, detailImgsMd5, mobileDetailImgsMd5,
      checkLIst, sourceMaterial, itemId } = this.state;
    const { id } = this.props.match.params;
    let params = {
      newPoster: false,
      newDetail: false,
      newSource: false
    }
    if (checkLIst.indexOf('photo') !== -1) {
      if (photo11.length <= 0) {
        message.error('请上传1:1素材')
        return
      } else if (photo169.length <= 0) {
        message.error('请上传16:9素材')
        return
      }
      else if (photo32.length <= 0) {
        message.error('请上传3:2素材')
        return
      }
      params.photo11 = setSort(photo11, itemId);
      params.photo169 = setSort(photo169, itemId);
      params.photo32 = setSort(photo32, itemId);
      params.newPoster = true
    }
    if (checkLIst.indexOf('detailImgsMd5') !== -1) {
      if (detailImgsMd5.length <= 0) {
        message.error('请上传新Pc商详')
        return
      }
      if (mobileDetailImgsMd5.length <= 0) {
        message.error('请上传新移动端商详')
        return
      }
      let list = [];
      let list2 = [];
      detailImgsMd5.map(item => list.push(item.url || `${item.response.entry.filePath}`));
      mobileDetailImgsMd5.map(item => list2.push(item.url || `${item.response.entry.filePath}`));
      params.detailImgsMd5 = setSort(list, itemId);
      params.mobileDetailImgsMd5 = setSort(list2, itemId);
      params.newDetail = true
    }
    if (checkLIst.indexOf('sourceMaterial') !== -1) {
      if (sourceMaterial.length <= 0) {
        message.error('请上传素材包')
        return
      }
      let list = [];
      sourceMaterial.map(item => list.push(item.postUrl || `${item.response.entry.filePath}`));
      params.sourceMaterial = setSort(list, itemId)
      params.newSource = true
    }
    params.activityId = id;
    const res = await Model.marketing.inActSourceMaterial(params);
    if (res) {
      message.success(res)
      this.props.history.push(`/market/activityList`);
    }
  }

  getDetail = async (id) => {
    const res = await Model.marketing.inHotDetail({ activityId: id });
    if (res) {
      let photo11 = res.photo11 || [];
      let photo169 = res.photo169 || [];
      let photo32 = res.photo32 || [];
      let detailImgsMd5 = res.detailImgsMd5 || [];
      let sourceMaterial = res.sourceMaterial || [];
      let mobileDetailImgsMd5 = res.mobileDetailImgsMd5 || [];
      photo11 = this.getImgUploadFile(photo11);
      photo169 = this.getImgUploadFile(photo169);
      photo32 = this.getImgUploadFile(photo32);
      detailImgsMd5 = this.getMaterList(detailImgsMd5);
      mobileDetailImgsMd5 = this.getMaterList(mobileDetailImgsMd5);
      sourceMaterial = this.getMaterList(sourceMaterial, 0);
      let checkLIst = []
      if (res.newPoster === true) {
        checkLIst.push('photo')
      }
      if (res.newDetail === true) {
        checkLIst.push('detailImgsMd5')
      }
      if (res.newSource === true) {
        checkLIst.push('sourceMaterial')
      }
      this.setState({
        photo11,
        photo169,
        photo32,
        detailImgsMd5,
        sourceMaterial,
        mobileDetailImgsMd5,
        checkLIst,
        verified: res.verified,
        itemId: res.itemId
      })
    }
  }
  getImgUploadFile = (arr = []) => {
    arr.map((item, i) => {
      let str = `${item.photo}`.split('/');
      item.uid = i + 1;
      item.name = str[str.length - 1];
      item.status = 'done';
      item.url = `${item.photo}`;
    })
    return arr
  }

  getMaterList = (arr = [], type = 1) => {
    let list = [];
    arr.map((item, i) => {
      let str = `${item}`.split('/');
      list.push({
        uid: i + 1,
        name: str[str.length - 1],
        status: 'done',
        url: type === 0 ? `${getFileUrl(item)}` : `${item}`,
        postUrl: item
      })
    })
    return list
  }

  getArr = (arr) => {
    let list = [];
    arr.map(item => {
      list.push(item.response ? `${getFileUrl(item.response.entry.filePath)}` : getFileUrl(item.url));
    })
    return list
  }
  onRemove = (v, name) => {
    const detailImgsMd5 = this.state[name]
    detailImgsMd5.splice(v, 1);
    this.setState({
      [name]: detailImgsMd5,
    })
  }
  onChangeUp = (v, name) => {
    const detailImgsMd5 = this.state[name]
    let obj = detailImgsMd5[v];
    detailImgsMd5.splice(v - 1, 0, obj);
    detailImgsMd5.splice(v + 1, 1);
    this.setState({
      [name]: detailImgsMd5,
    })
  }
  onChangeDown = (v, name) => {
    const detailImgsMd5 = this.state[name]
    let obj = detailImgsMd5[v];
    detailImgsMd5.splice(v, 1);
    detailImgsMd5.splice(v + 1, 0, obj);
    this.setState({
      [name]: detailImgsMd5,
    })
  }
  golist = () => {
    this.props.history.push(`/market/activityList`);
  }
  tabChange = (key) => {
    this.setState({
      detailName: key
    })
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.getDetail(id);
    }
  }

  render() {
    const {
      options, detailImgsMd5,
      mobileDetailImgsMd5,
      sourceMaterial, loading, checkLIst, verified,
      detailName
    } = this.state;
    const renderPhoto = (type, name, size, bli) => {
      return (
        <div className={styles.photo_outrow}>

          <div className={styles.photo_row}>
            {
              this.state[name].length > 0 ? (
                this.state[name].map((item, i) => {
                  return (
                    <div className={`${styles.item}`}>
                      <div className={`${styles.photo_box}`}>
                        {item.photo ? (
                          <img src={`${getFileUrl(item.photo)}`} alt="" width="160" key={i} />
                        ) : (
                            <div style={{ width: '160px', height: '160px', background: "#f2f0f5" }}></div>
                          )}
                        <div className={styles.photo_box_bottom}>
                          {item.main === 1 ? (
                            <span className={styles.red}>商品主图</span>
                          ) : (
                              verified === false ? <span onClick={() => this.setMain(type, i)}>设为主图</span> : <span>不可操作</span>
                            )}
                          {verified === false && <span className={styles.red} onClick={() => this.cancelPhoto(type, i)}>删除图片</span>}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : null
            }
          </div>
          <Upload
            // action={until.baseUrl}
            // name="file"
            // headers={tokenObj}
            // accept=".jpg,.jpeg,.png"
            // fileList={this.state[name]}
            // beforeUpload={(e) => beforeUpload(e, type)}
            // onChange={(e) => this.handleChange(e, type)}
            // showUploadList={false}
            // multiple
            disabled={verified}
            {
            ...getUploadProps({
              accept: ".jpg,.jpeg,.png",
              fileList: this.state[name],
              beforeUpload: (e) => beforeUpload(e, type),
              showUploadList: false,
              multiple: true,
              onChange: (e) => this.handleChange(e, type),
            })
            }
          >
            {this.state[name].length < 1 ?
              (
                <div className={`${styles.no_photo} ${type === 3 ? styles.photo_box_533 : ''} ${type === 2 ? styles.photo_box_mid : ''}`}>
                  上传{bli}素材
              </div>
              ) : null
            }
            <Button type="primary" className={styles.btn} disabled={this.state[name].length >= 5 || verified}>上传图片</Button>
          </Upload>
          <p className={styles.gray_font}>按住CTRL可同时批量选择多张图片上传，最多可以上传5张图片，建议尺寸{size}px</p>
        </div>
      )
    }
    const content = (
      <div>
        cccccc
      </div>
    );
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner} >
        <Step current={1} />
        <Spin spinning={loading}>
          <div className={`main-content pagination-page ${styles.content}`}>
            <div className={styles.card_box}>
              <Card title="商品素材" bordered={false}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <Checkbox.Group options={options} value={checkLIst} onChange={this.onCheckChange} disabled={verified} />
                </div>
                {
                  renderPhoto(1, 'photo11', '800*800', '1:1')
                }
                {
                  renderPhoto(2, 'photo169', '800*450', "16:9")
                }
                {
                  renderPhoto(3, 'photo32', '800*533', "3:2")
                }
              </Card>
            </div>
            <div className={`${styles.card_box} ${styles.card_allbox}`}>
              <Card title="商详图" bordered={false}>
                <section className={styles.detail_photo}>
                  <Tabs defaultActiveKey={detailName} onChange={this.tabChange}>
                    <TabPane tab="电脑端详情" key="detailImgsMd5" style={{ padding: '20px 40px' }}>
                      <PreviewImage
                        onChangeUp={(v) => this.onChangeUp(v, 'detailImgsMd5')}
                        onChangeDown={(v) => this.onChangeDown(v, 'detailImgsMd5')}
                        onRemove={(v) => this.onRemove(v, 'detailImgsMd5')}
                        images={this.getArr(detailImgsMd5)}
                        scope={(o) => {
                          this.showPreview1 = o.showPreview;
                        }}
                      />
                    </TabPane>
                    <TabPane tab="移动端详情" key="mobileDetailImgsMd5" style={{ padding: '20px' }}>
                      <PreviewImage
                        onChangeUp={(v) => this.onChangeUp(v, 'mobileDetailImgsMd5')}
                        onChangeDown={(v) => this.onChangeDown(v, 'mobileDetailImgsMd5')}
                        onRemove={(v) => this.onRemove(v, 'mobileDetailImgsMd5')}
                        images={this.getArr(mobileDetailImgsMd5)}
                        scope={(o) => {
                          this.showPreview2 = o.showPreview;
                        }}
                      />
                    </TabPane>
                  </Tabs>
                  <Popover content={content} title={false} placement="right" >
                    <span className={styles.shuom}>移动端上传说明</span>
                  </Popover>
                </section>
                <div className={styles.card_allbox_button_box}>
                  {detailName === 'detailImgsMd5' &&
                    <Button type="primary" ghost onClick={() => this.showPreview1()}>预览</Button>
                  }
                  {detailName === 'mobileDetailImgsMd5' &&
                    <Button type="primary" ghost onClick={() => this.showPreview2()}>预览</Button>
                  }
                  <Upload
                    disabled={verified}
                    {
                    ...getUploadProps({
                      accept: ".jpg,.jpeg,.png",
                      fileList: this.state[detailName],
                      beforeUpload: (e) => beforeUpload(e, 4),
                      showUploadList: false,
                      onChange: (e) => this.detailImgChange(e, detailName),
                    })
                    }
                  >
                    <Button type="primary" disabled={verified}>上传图片</Button>
                  </Upload>
                </div>
                <p className={styles.gray_font}>上传商详图建议宽度800px高度不限，单张图片不超过1MB</p>
              </Card>
            </div>
            <div className={`${styles.card_box} ${styles.card_allbox}`}>
              <Card title="分享素材" bordered={false}>
                <div className={styles.sucai_box}>
                  <Upload
                    // action={until.baseUrl}
                    // accept=".zip,.rar"
                    // headers={tokenObj}
                    // fileList={sourceMaterial}
                    // onChange={this.sourceChange}
                    // beforeUpload={beforeUploadOtherFile}
                    disabled={verified}
                    {
                    ...getUploadProps({
                      accept: ".zip,.rar",
                      fileList: sourceMaterial,
                      beforeUpload: beforeUploadOtherFile,
                      showUploadList: true,
                      onChange: this.sourceChange,
                    })
                    }
                  >
                    <Button type="primary" disabled={verified}>上传素材包</Button>
                  </Upload>
                  <p className={`${styles.gray_font} ${styles.download}`}>最大支持：100MB</p>
                </div>
              </Card>
            </div>
            <div className={styles.card_allbox_button_box} style={{ borderTop: '1px solid #f0f2f5', paddingTop: '30px' }}>
              <Button type="primary" ghost onClick={this.goBack}>
                上一步，设置活动力度
              </Button>
              {/* 未通过审核 */}
              {verified === false && <Button type="primary" onClick={this.sub}>完成，提交商品</Button>}
              {/* 通过审核 */}
              {verified === true && <Button type="primary" onClick={this.golist}>返回列表</Button>}
            </div>
          </div>
        </Spin>
      </section >
      /** Layout-admin:End */
    );
  }
}

export default OrderList;
