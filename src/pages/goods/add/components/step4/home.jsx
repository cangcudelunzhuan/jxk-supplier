import React from 'react';
import { Card, Upload, Tabs, Button, Spin, message, Checkbox, Modal } from 'antd';
import { PreviewImage } from '@jxkang/web-cmpt';
// import Step from '../components/Step/index';
import { Common } from '@jxkang/utils';
import Model, { getUploadProps, clientHeader } from '@/model';
import newCommon from '@/model/common';
import Config from '@/config';
import { getUploadImgSort, downLoadurl, getPathName } from '@/utils';
import { beforeUpload, beforeUploadOtherFile, backFun, setSort } from '@/utils/uploadImgConfig';
import { getFileUrl } from '@/utils/index';
import styles from './index.module.styl';

const { TabPane } = Tabs;


class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkLIst: [],
      photo11: [
      ],
      photo169: [
      ],
      photo32: [
      ],
      shortVideo: [
      ],
      videoImg: '',
      detailImgsMd5: [],
      detailImgsPhone: [],
      sourceMaterial: [],
      loading: false,
      tokenObj: '',
      similarPc: false,
      visible: false,
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
    console.log(info);
    let fileName = '';
    if (type === 1) {
      fileName = 'photo11'
    } else if (type === 2) {
      fileName = 'photo169'
    } else if (type === 3) {
      fileName = 'photo32'
    } else if (type === 5) {
      fileName = 'vedioList'
    }
    const list = [...info.fileList].splice(0, 5);
    list.map(item => {
      if (item.response) {
        item.photo = `${item.response.entry.filePath}`
        item.photoName = `${item.response.entry.originName}`
      }
    })
    this.setState({
      [fileName]: list
    })
    backFun(info.file.status, this)
  }

  handleVideoChange = (info) => {
    const list = [...info.fileList].splice(0, 1);
    list.map(item => {
      if (item.response) {
        item.shortVideo = `${item.response.entry.filePath}`
        item.shortVideoName = `${item.response.entry.originName}`
      }
    })
    this.setState({
      shortVideo: [...list],
    })
    // }
    backFun(info.file.status, this);
    if (info.file.status === 'done') {
      const url = `${getFileUrl(this.state.shortVideo[0].shortVideo)}?x-oss-process=video/snapshot,t_0,f_jpg,w_800,h_800,m_fast`
      this.setState({
        videoImg: url,
      })
    }
  }

  detailPcImgChange = (info) => {
    const list = [...info.fileList];
    list.map(item => {
      if (item.response) {
        list.url = `${item.response.entry.filePath}`;
      }
    })

    if (list.every(v => v.response && v.response.entry)) {
      list.sort((a, b) => getUploadImgSort(a.response.entry.originName) < getUploadImgSort(b.response.entry.originName) ? -1 : 1);
    }

    this.setState({ detailImgsMd5: list });
    backFun(info.file.status, this)
  }

  detailPhoneImgChange = (info) => {
    const list = [...info.fileList];
    list.map(item => {
      if (item.response) {
        list.url = `${item.response.entry.filePath}`;
      }
    })

    if (list.every(v => v.response && v.response.entry)) {
      list.sort((a, b) => getUploadImgSort(a.response.entry.originName) < getUploadImgSort(b.response.entry.originName) ? -1 : 1);
    }

    this.setState({ detailImgsPhone: list });
    backFun(info.file.status, this)
  }
  getMaterList = (arr = [], type = 1) => {
    let list = [];
    arr.map((item, i) => {
      list.push({
        uid: i + 1,
        name: item.response.entry.originName,
        status: 'done',
        url: type === 0 ? `${getFileUrl(item.response.entry.filePath)}` : `${item}`,
        postUrl: item.response.entry.filePath
      })
    })
    return list
  }
  sourceChange = (info) => {
    const sourceMaterial = [...info.fileList].slice(-1);
    this.setState({ sourceMaterial: sourceMaterial });
    if (info.file.status === 'done') {
      sourceMaterial[0].url = `${getFileUrl(sourceMaterial[0].response.entry.filePath)}`;
      sourceMaterial[0].postUrl = `${sourceMaterial[0].response.entry.filePath}`;
      sourceMaterial[0].name = `${sourceMaterial[0].response.entry.originName}`;
      this.setState({ sourceMaterial });

    }
  }

  compoleteAllForm = async () => {
    // 1:1   2:1   3:2    电脑端详情  素材包 
    const { photo11, photo169, photo32, detailImgsMd5, sourceMaterial, detailImgsPhone, similarPc, shortVideo } = this.state;
    const { itemId } = this.props;
    let allList = [];
    if (photo11.length <= 0) {
      message.error('请上传1:1素材')
      return
    } else if (detailImgsMd5.length <= 0 && !similarPc) {
      message.error('请上传电脑端详情图片')
      return
    } else if (detailImgsPhone.length <= 0) {
      message.error('请上传移动端详情图片')
      return
    }
    const oneToOne = this.dealData(photo11, 'oneToOne', itemId);
    const sixteenToNine = this.dealData(photo169, 'sixteenToNine', itemId);
    const threeToTwo = this.dealData(photo32, 'threeToTwo', itemId);
    const pcDetail = similarPc ? this.dealPhoneData(detailImgsPhone, 'pcDetail', itemId) : this.dealPCData(detailImgsMd5, 'pcDetail', itemId);
    const phoneDetail = this.dealPhoneData(detailImgsPhone, 'phoneDetail', itemId);
    const sourceDetail = this.dealPCData(sourceMaterial, 'sourceDetail', itemId);
    if (shortVideo.length !== 0) {
      var shortVideoDetail = this.dealVideoDetail(shortVideo, 'shortVideo', itemId);
      allList.push(shortVideoDetail);
    }
    console.log('shortVideoDetail', shortVideoDetail)
    if (sourceDetail.urlObjects.length === 0) {
      allList.push(oneToOne,
        sixteenToNine.urlObjects.length !== 0 ? sixteenToNine : null,
        threeToTwo.urlObjects.length !== 0 ? threeToTwo : null,
        pcDetail, phoneDetail);
    } else {
      allList.push(oneToOne,
        sixteenToNine.urlObjects.length !== 0 ? sixteenToNine : null,
        threeToTwo.urlObjects.length !== 0 ? threeToTwo : null,
        pcDetail,
        phoneDetail,
        sourceDetail);
    }
    const newObj = {};
    let r = allList.filter(item => item);
    newObj.urls = r;
    newObj.itemId = itemId;
    this.postCurrentData(newObj);
  }
  // 调用上传接口
  postCurrentData = (currentData) => {
    Model.goods.postHistoryList(currentData).then(res => {
      message.success('提交成功');
      this.props.postAllInner(0);
      // }
    })
  }

  // 上传商品素材附件
  dealData = (dealArr, type = '', itemId) => {
    const newObj = {};
    let oneToOne = (dealArr || []).map((v) => {
      return { url: v.photo || v.url, main: v.main || 0, name: v.photoName || v.name }
    })
    oneToOne = setSort(oneToOne, itemId, 'url')
    newObj.urlObjects = oneToOne;
    newObj.type = type;
    newObj.bizId = itemId;
    return newObj;
  }
  // pc和移动端
  dealPCData = (dealArr, type = '', itemId) => {
    const newObj = {};
    let oneToOne = (dealArr || []).map((v) => {
      return { url: v.response ? v.response.entry.filePath : v.url ? v.postUrl || v.url : v.photo, main: v.main || 0, name: v.response ? v.response.entry.originName : v.name }
    })
    oneToOne = setSort(oneToOne, itemId, 'url')
    newObj.urlObjects = oneToOne;
    newObj.type = type;
    newObj.bizId = itemId;
    return newObj;
  }

  // 移动端图片上传
  dealPhoneData = (dealArr, type = '', itemId) => {
    const newObj = {};
    let oneToOne = (dealArr || []).map((v) => {
      return { url: v.response ? v.response.entry.filePath : v.url ? v.url : v.photo, main: v.main || 0, name: v.response ? v.response.entry.originName : v.name }
    })
    oneToOne = setSort(oneToOne, itemId, 'url')
    newObj.urlObjects = oneToOne;
    newObj.type = type;
    newObj.bizId = itemId;
    return newObj;
  }

  // 上传视频
  dealVideoDetail = (dealArr, type = '', itemId) => {
    const newObj = {};
    let shortVideo = (dealArr || []).map((v) => {
      return {
        url: v.response ? v.response.entry.filePath : v.url ? v.url : v.shortVideo,
        main: v.main || 0,
        name: v.response ? v.response.entry.originName : v.shortVideoName
      }
    })
    // oneToOne = setSort(oneToOne, itemId, 'url')
    newObj.urlObjects = shortVideo;
    newObj.type = type;
    newObj.bizId = itemId;
    return newObj;
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

  getArr = (arr) => {
    let list = [];
    arr.map(item => {
      list.push(item.response ? `${getFileUrl(item.response.entry.filePath)}` : getFileUrl(item.url));
    })
    return list
  }

  getotherArr = (arr) => {
    let otherlist = [];
    arr.map(item => {
      otherlist.push(item.response ? `${item.response.entry.filePath}` : item.url || item.photo);
    })
    return otherlist
  }

  onRemove = (v, type) => {
    const { detailImgsMd5, detailImgsPhone } = this.state
    if (type === 'pc') {
      detailImgsMd5.splice(v, 1);
      this.setState({
        detailImgsMd5,
      })
    } else {
      detailImgsPhone.splice(v, 1);
      this.setState({
        detailImgsPhone,
      })
    }
  }
  onChangeUp = (v, type) => {
    const { detailImgsMd5, detailImgsPhone } = this.state;
    if (type === 'pc') {
      let obj = detailImgsMd5[v];
      detailImgsMd5.splice(v - 1, 0, obj);
      detailImgsMd5.splice(v + 1, 1);
      this.setState({
        detailImgsMd5,
      })
    } else {
      let obj = detailImgsPhone[v];
      detailImgsPhone.splice(v - 1, 0, obj);
      detailImgsPhone.splice(v + 1, 1);
      this.setState({
        detailImgsPhone,
      })
    }
  }

  onChangeDown = (v, type) => {
    const { detailImgsMd5, detailImgsPhone } = this.state;
    if (type === 'pc') {
      let obj = detailImgsMd5[v];
      detailImgsMd5.splice(v, 1);
      detailImgsMd5.splice(v + 1, 0, obj);
      this.setState({
        detailImgsMd5,
      })
    } else {
      let obj = detailImgsPhone[v];
      detailImgsPhone.splice(v, 1);
      detailImgsPhone.splice(v + 1, 0, obj);
      this.setState({
        detailImgsPhone,
      })
    }
  }

  onDownload = (e) => {

  }

  componentDidMount() {
    const { itemId } = this.props;
    this.props.reLoadCurrent();
    this.props.getfirStep('');
    this.setState({
      tokenObj: {
        token: Common.getCookie(globalThis.webConfig.fetchTokenName),
        jdxiaokang_client: clientHeader,
      },
    });
    if (itemId) {
      this.imgDetail(itemId);
    }
  }

  imgDetail = (itemId) => {
    const currentData = {
      bizId: itemId,
      bizType: 'item',
      type: "oneToOne,sixteenToNine,threeToTwo,pcDetail,phoneDetail,sourceDetail,shortVideo"
    }
    Model.goods.imgDetail(currentData).then(res => {
      if (res && Array.isArray(res.records)) {
        // const { photo11, photo169, photo32, detailImgsMd5, detailImgsPhone, sourceMaterial, shortVideo } = this.state;
        res.records.forEach((v) => {
          if (v.type === 'shortVideo') {
            this.state.shortVideo.push({
              // shortVideo: v.url,
              // shortVideoName: v.name,
              // url: 'xxx.jpg',
              // name: '111'
              
                uid: -1,
                name: v.name,
                shortVideoName: v.name,
                shortVideo: v.url,
                status: 'done',
                url: 'https://test-static.jdxiaokang.com/jdxiaokang/distribution/2020/06/202006181725520320794.jpg'//v.url,
              
            })
            this.state.videoImg = v.url
          } else if (v.type === 'oneToOne') {
            this.state.photo11.push({ photo: v.url, name: v.name });
          } else if (v.type === 'sixteenToNine') {
            this.state.photo169.push({ photo: v.url, name: v.name });
          } else if (v.type === 'threeToTwo') {
            this.state.photo32.push({ photo: v.url, name: v.name });
          } else if (v.type === 'pcDetail') {
            this.state.detailImgsMd5.push({ url: v.url, name: v.name });
          } else if (v.type === 'phoneDetail') {
            this.state.detailImgsPhone.push({ url: v.url, name: v.name });
          } else if (v.type === "sourceDetail") {
            this.state.sourceMaterial.push(
              {
                uid: -1,
                name: v.url.split('/').pop(),
                status: 'done',
                postUrl: v.url,
                url: getFileUrl(v.url)
              }
            )
          }
        });

        this.setState({});
      }
    })
  }

  downLoadPhoneImg = (phoneImg) => {
    const { itemId } = this.props;
    for (let i = 0; i < phoneImg.length; i += 1) {
      let exportData;
      if (phoneImg[i].response) {
        exportData = phoneImg[i].response.entry.filePath;
      } else if (phoneImg[i].url) {
        exportData = phoneImg[i].url;
      }
      Common.winOpen({
        url: `${downLoadurl}/${itemId}_phone_${i}.jpg`,
        type: 'post',
        target: 'ifm',
        params: {
          ossUri: getPathName(exportData),
          host: Config.imgHost,
        },
      });
    }
  }

  downLoadPcImg = (pcImg) => {
    const { itemId } = this.props;
    for (let i = 0; i < pcImg.length; i += 1) {
      let exportData;
      if (pcImg[i].response) {
        exportData = pcImg[i].response.entry.filePath;
      } else if (pcImg[i].url) {
        exportData = pcImg[i].url;
      }
      Common.winOpen({
        url: `${downLoadurl}/${itemId}_pc_${i}.jpg`,
        type: 'post',
        target: 'ifm',
        params: {
          ossUri: getPathName(exportData),
          host: Config.imgHost,
        },
      });
    }
  }

  onConfirmChange = (e) => {
    this.setState({
      similarPc: e.target.checked,
    })
  }

  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };



  render() {
    const { detailImgsMd5, sourceMaterial, loading, detailImgsPhone, tokenObj, shortVideo, videoImg } = this.state;
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
                              <span onClick={() => this.setMain(type, i)}>设为主图</span>
                            )}
                          <span className={styles.red} onClick={() => this.cancelPhoto(type, i)}>删除图片</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : null
            }
          </div>
          <Upload
            {
            ...getUploadProps({
              accept: ".jpg,.jpeg,.png",
              fileList: this.state[name],
              beforeUpload: (e) => beforeUpload(e, type),
              showUploadList: false,
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
            <Button type="primary" className={styles.btn} disabled={this.state[name].length >= 5}>上传图片</Button>
          </Upload>
          <p className={styles.gray_font}>按住CTRL可同时批量选择多张图片上传，最多可以上传5张图片，建议尺寸{size}px</p>
        </div>
      )
    }

    return (
      <section className={styles.contentInner} >
        {/* <Step current={1} /> */}
        <Spin spinning={loading}>
          <div className={`pagination-page ${styles.content}`}>
            <div className={styles.card_box}>
              <Card title="商品素材" bordered={false}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                </div>
                {/* 上传视频信息 */}
                <div className={styles.photo_outrow}>
                  <div className={styles.photo_row}>
                    <div className={`${styles.item}`}>
                      <div className={`${styles.photo_box}`}>
                        {videoImg ? (
                          <img src={`${videoImg}`} alt="" width="160" onClick={this.showModal} />
                        ) : (
                            <div style={{ width: '160px', height: '160px', background: "#f2f0f5" }}>
                              上传视频素材
                            </div>
                          )}
                        {/* <div className={styles.photo_box_bottom}>
                          {item.main === 1 ? (
                            <span className={styles.red}>商品主图</span>
                          ) : (
                              <span onClick={() => this.setMain(type, i)}>设为主图</span>
                            )}
                          <span className={styles.red} onClick={() => this.cancelPhoto(type, i)}>删除图片</span> */}
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                  <Upload
                    action={newCommon.upload()}
                    name='file'
                    accept=".mov,.mp4,.avi,.flv"
                    fileList={shortVideo}
                    showUploadList={true}
                    onChange={(e) => this.handleVideoChange(e)}
                  >
                    {/* <div className={`${styles.no_photo}`} >
                      上传视频素材
                      </div> */}
                    <Button type="primary" className={styles.btn}>上传视频素材</Button>
                  </Upload>

                  <p className={styles.gray_font}>尺寸：建议视频长宽比例1:1；格式：mov、mp4、avi、flv；视频时长最长30s，大小最大10MB</p>
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
                  <Tabs defaultActiveKey="2" onChange={this.tabChange}>
                    <TabPane tab="移动端详情" key="2" style={{ padding: '20px' }}>
                      <Checkbox style={{ paddingBottom: '20px' }} onChange={(e) => this.onConfirmChange(e)}>勾选既视为移动端上传图片和电脑端相同</Checkbox>
                      <PreviewImage
                        onChangeUp={(index) => this.onChangeUp(index, 'mobile')}
                        onChangeDown={(index) => this.onChangeDown(index, 'mobile')}
                        onRemove={(index) => this.onRemove(index, 'mobile')}
                        images={this.getArr(detailImgsPhone)}
                        scope={(o) => {
                          this.showPreview2 = o.showPreview;
                        }}
                      />
                      <div className={styles.card_allbox_button_box}>
                        <Button type="primary" ghost onClick={() => this.showPreview2()}>预览</Button>
                        <Upload
                          {
                          ...getUploadProps({
                            accept: ".jpg,.jpeg,.png",
                            fileList: detailImgsPhone,
                            multiple: true,
                            beforeUpload: (e) => beforeUpload(e, 4),
                            showUploadList: false,
                            onChange: (e) => this.detailPhoneImgChange(e),
                          })
                          }
                        >
                          <Button type="primary">上传图片</Button>
                        </Upload>
                        <Button disabled={detailImgsPhone.length !== 0 ? '' : 'disabled'} onClick={() => { this.downLoadPhoneImg(detailImgsPhone) }} type="primary">批量下载</Button>
                      </div>
                      <p className={styles.gray_font}>上传商详图建议宽度800px高度不限，单张图片不超过1MB</p>
                    </TabPane>

                    <TabPane tab="电脑端详情" key="1" style={{ padding: '20px 40px' }}>

                      <PreviewImage
                        onChangeUp={(index) => this.onChangeUp(index, 'pc')}
                        onChangeDown={(index) => this.onChangeDown(index, 'pc')}
                        onRemove={(index) => this.onRemove(index, 'pc')}
                        images={this.getArr(detailImgsMd5)}
                        scope={(o) => {
                          this.showPreview = o.showPreview;
                        }}
                      />
                      <div className={styles.card_allbox_button_box}>
                        <Button type="primary" ghost onClick={() => this.showPreview()}>预览</Button>
                        <Upload
                          {
                          ...getUploadProps({
                            accept: ".jpg,.jpeg,.png",
                            fileList: detailImgsMd5,
                            multiple: true,
                            beforeUpload: (e) => beforeUpload(e, 4),
                            showUploadList: false,
                            onChange: (e) => this.detailPcImgChange(e),
                          })
                          }
                        >
                          <Button type="primary">上传图片</Button>
                        </Upload>
                        <Button disabled={detailImgsMd5.length !== 0 ? '' : 'disabled'} onClick={() => { this.downLoadPcImg(detailImgsMd5) }} type="primary">批量下载</Button>
                      </div>
                      <p className={styles.gray_font}>上传商详图建议宽度800px高度不限，单张图片不超过1MB</p>
                    </TabPane>

                  </Tabs>
                </section>

              </Card>
            </div>
            <div className={`${styles.card_box} ${styles.card_allbox}`}>
              <Card title="分享素材" bordered={false}>
                <div className={styles.sucai_box}>
                  <Upload
                    {
                    ...getUploadProps({
                      accept: ".zip,.rar",
                      fileList: sourceMaterial,
                      beforeUpload: beforeUploadOtherFile,
                      showUploadList: true,
                      onChange: this.sourceChange,
                      onDownload: this.onDownload
                    })
                    }
                  >
                    <Button type="primary">上传素材包</Button>
                  </Upload>
                  <p className={`${styles.gray_font} ${styles.download}`}>最大支持：100MB</p>
                </div>
              </Card>
            </div>
          </div>
        </Spin>

        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ width: '400px' }}
        >
          <video
            src={shortVideo.length !== 0 ? getFileUrl(shortVideo[0].shortVideo) : ''}
            controls
            autoplay
          >
          </video>
        </Modal>

      </section >
    );
  }
}

export default OrderList;
