import React from 'react';
import { Card, Tabs, Button, Spin, message } from 'antd';
import { PreviewImage } from '@jxkang/web-cmpt';
// import Step from '../components/Step/index';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import {
  backFun,
} from '@/utils/uploadImgConfig';
import Config from '@/config';
import { getFileUrl, downLoadurl, getPathName } from '@/utils/index';
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
      detailImgsMd5: [],
      detailImgsPhone: [],
      sourceMaterial: [],
      loading: false,
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
  }
  detailPcImgChange = (info,type) => {
    const list = [...info.fileList];
    list.map(item => {
      if (item.response) {
        list.url = `${item.response.entry.filePath}`;
      }
    })
    this.setState({ detailImgsMd5: list });
    backFun(info.file.status, this)
  }

  detailPhoneImgChange = (info,type) => {
    const list = [...info.fileList];
    list.map(item => {
      if (item.response) {
        list.url = `${item.response.entry.filePath}`;
      }
    })
    this.setState({ detailImgsPhone: list });
    backFun(info.file.status, this)
  }
  sourceChange = (info) => {
    const sourceMaterial = [...info.fileList].slice(-1);
    this.setState({ sourceMaterial });
    backFun(info.file.status, this)
  }

  // 调用上传接口
  postCurrentData=(currentData)=>{
    Model.goods.postHistoryList(currentData).then(res=>{
      // if(res){
        message.success('提交成功');
        this.props.postAllInner(0);
      // }
    })
  }
  // 上传商品素材附件
  dealData = (dealArr,type='',itemId)=>{
    const newObj ={};
    const oneToOne = (dealArr || []).map((v)=>{
        return {url:v.photo || v.url, main:v.main|| 0}
    })
    newObj.urlObjects = oneToOne;
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

  getMaterList = (arr = []) => {
    let list = [];
    arr.map((item, i) => {
      let str = `${item}`.split('/');
      list.push({
        uid: i + 1,
        name: str[str.length - 1],
        status: 'done',
        url: `${item}`,
      })
    })
    return list
  }

  getArr = (arr) => {
    let list = [];
    arr.map(item => {
      list.push(item.response ? `${item.response.entry.filePath}` : getFileUrl(item.url));
    })
    return list
  }
  onRemove = (v,type) => {
    const { detailImgsMd5, detailImgsPhone} = this.state
    if(type==='pc'){
      detailImgsMd5.splice(v, 1);
      this.setState({
        detailImgsMd5,
      })
    }else{
      detailImgsPhone.splice(v, 1);
      this.setState({
        detailImgsPhone,
      })
    }
  }
  onChangeUp = (v,type) => {
    const { detailImgsMd5 ,detailImgsPhone} = this.state;
    if(type==='pc'){
    let obj = detailImgsMd5[v];
    detailImgsMd5.splice(v - 1, 0, obj);
    detailImgsMd5.splice(v + 1, 1);
    this.setState({
      detailImgsMd5,
    })
  }else{
    let obj = detailImgsPhone[v];
    detailImgsPhone.splice(v - 1, 0, obj);
    detailImgsPhone.splice(v + 1, 1);
    this.setState({
      detailImgsPhone,
    })
  }
  };
  onChangeDown = (v,type) => {
    const { detailImgsMd5 ,detailImgsPhone} = this.state;
    if(type==='pc'){
    let obj = detailImgsMd5[v];
    detailImgsMd5.splice(v, 1);
    detailImgsMd5.splice(v + 1, 0, obj);
    this.setState({
      detailImgsMd5,
    })
  }else{
    let obj = detailImgsPhone[v];
    detailImgsPhone.splice(v, 1);
    detailImgsPhone.splice(v + 1, 0, obj);
    this.setState({
      detailImgsPhone,
    })
  }
  }

  imgDetail=()=>{
    const {itemId} = this.props;
    const currentData = {
      bizId:itemId,
      bizType:'item',
      type:"oneToOne,sixteenToNine,threeToTwo,pcDetail,phoneDetail,sourceDetail"
    }
    Model.goods.imgDetail(currentData).then(res=>{
      if(res){
        const {photo11,photo169,photo32,detailImgsMd5,detailImgsPhone,sourceMaterial} = this.state;
      (res.records || []).map((v)=>{
        if(v.type === 'oneToOne'){
          photo11.push({photo:v.url});
          this.setState({
            photo11:photo11
          })
      }else
      if(v.type === 'sixteenToNine'){
        photo169.push({photo:v.url});
        this.setState({
          photo169:photo169
        })
      }else
      if(v.type === 'threeToTwo'){
        photo32.push({photo:v.url});
        this.setState({
          photo32:photo32
        })
      }else
      if(v.type === 'pcDetail'){
        detailImgsMd5.push({url:(v.url)});
        this.setState({
          detailImgsMd5:detailImgsMd5
        })
      }else
      if(v.type === 'phoneDetail'){
        detailImgsPhone.push({url:(v.url)});
        this.setState({
          detailImgsPhone:detailImgsPhone
        })
      } else if(v.type === "sourceDetail"){
        sourceMaterial.push(
          {
            uid:-1,
            name: v.url.split('/').pop(),
            status:'done',
            url:v.url
          }
        )
        this.setState({
          sourceMaterial:sourceMaterial,
        })
      }
      return  v;
      })
    }
    })
  }

  componentDidMount() {
    this.props.reLoadCurrent();
    this.imgDetail();
  }

  downLoadPhoneImg=(phoneImg)=>{
    const {itemId} = this.props;
    for(let i=0;i<phoneImg.length;i+=1){
      Common.winOpen({
        url: `${downLoadurl}/${itemId}_phone_${i}.jpg`,
        type: 'post',
        target: 'ifm',
        params: {
          ossUri:getPathName(phoneImg[i].url),
          host: Config.imgHost,
        },
      });
    }
  }

  downLoadPcImg=(pcImg)=>{
    const {itemId} = this.props;
    for(let i=0;i<pcImg.length;i+=1){
      Common.winOpen({
        url: `${downLoadurl}/${itemId}_pc_${i}.jpg`,
        type: 'post',
        target: 'ifm',
        params: {
          ossUri:pcImg[i].url,
          host: Config.imgHost,
        },
      });
    }
  }

  downloadOnly=(imgUrl,index,inx)=>{
    console.log(imgUrl,index);
    const {itemId} = this.props;
    Common.winOpen({
      url: `${downLoadurl}/${itemId}_${index}_${inx}.${imgUrl.split('.').pop()}`,
      type: 'post',
      target: 'ifm',
      params: {
        ossUri:getPathName(imgUrl.split('?')[0]),
        host: Config.imgHost,
      },
    });
  }


  render() {
    const {  detailImgsMd5, sourceMaterial, loading, detailImgsPhone } = this.state;
    const renderPhoto = (type, name, size, bli) => {
      return (
        <div className={styles.photo_outrow}>

          <div className={styles.photo_row}>
            {
              this.state[name].length > 0 ? (
                this.state[name].map((item, i) => {
                  return (
                    <div className={`${styles.item}`}>
                      <div style={{marginBottom:'10px',color:'#000'}}>{`${bli}素材`}</div>
                      <div className={`${styles.photo_box}`}>
                        {item.photo ? (
                          <img src={`${getFileUrl(item.photo)}`} alt="" width="160" key={i} />
                        ) : (
                            <div style={{ width: '160px', height: '160px', background: "#f2f0f5" }}></div>
                          )}
                        <div className={styles.photo_box_bottom}>
                          {/* {item.main === 1 ? (
                            <span className={styles.red}>商品主图</span>
                          ) : (
                              <span onClick={() => this.setMain(type, i)}>设为主图</span>
                            )} */}
                          {/* <a className={styles.red} href={getFileUrl(item.photo)} download="">下载图片</a> */}
                          <a className={styles.red} onClick={()=>this.downloadOnly(item.photo,bli,i)}>下载图片</a>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : null
            }
          </div>
        </div>
      )
    }
    const content = (
      <div>
        cccccc
      </div>
    );
    return (
      <section className={styles.contentInner} >
        {/* <Step current={1} /> */}
        <Spin spinning={loading}>
          <div className={`main-content pagination-page ${styles.content}`}>
            <div className={styles.card_box}>
              <Card title="商品素材" bordered={false}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
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
                  <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                    <TabPane tab="电脑端详情" key="1" style={{ padding: '20px 40px' }}>
                      <PreviewImage
                        onChangeUp={(index)=>this.onChangeUp(index,'pc')}
                        onChangeDown={(index)=>this.onChangeDown(index,'pc')}
                        onRemove={(index)=>this.onRemove(index,'pc')}
                        images={this.getArr(detailImgsMd5)}
                        scope={(o) => {
                          this.showPreview = o.showPreview;
                        }}
                      />
                      <div className={styles.card_allbox_button_box}>
                        <Button type="primary" ghost onClick={() => this.showPreview()}>预览</Button>
                        <Button disabled={detailImgsMd5.length!==0?'':'disabled'} onClick={()=>{this.downLoadPcImg(detailImgsMd5)}}  type="primary">批量下载</Button>
                      </div>
                        <p className={styles.gray_font}>上传商详图建议宽度800px高度不限，单张图片不超过1MB</p>
                    </TabPane>
                    <TabPane tab="移动端详情" key="2" style={{ padding: '20px' }}>
                      <PreviewImage
                        onChangeUp={(e)=>this.onChangeUp(e,v)}
                        onChangeDown={(e)=>this.onChangeDown(e,v)}
                        onRemove={(e)=>this.onRemove(e)}
                        images={this.getArr(detailImgsPhone)}
                        scope={(o) => {
                          this.showPreview2 = o.showPreview;
                        }}
                      />
                      <div className={styles.card_allbox_button_box}>
                        <Button type="primary" ghost onClick={() => this.showPreview2()}>预览</Button>
                        <Button disabled={detailImgsPhone.length!==0?'':'disabled'} onClick={()=>{this.downLoadPhoneImg(detailImgsPhone)}} type="primary">批量下载</Button>
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
                  {(sourceMaterial.map(v=>{
                   return  <a href={getFileUrl(v.url)}>{v.name} 点击下载</a>
                  }))}
                </div>
              </Card>
            </div>
          </div>
        </Spin>
      </section >
    );
  }
}

export default OrderList;
