import React from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Icon, message, Upload, Switch, Checkbox } from 'antd';
import { Catalog, SelectCity } from '@jxkang/web-cmpt';
import Events from '@jxkang/events';
import { Common } from '@jxkang/utils';
import Model, { clientHeader } from '@/model';
import until, { getFileUrl } from '@/utils/index';
import styles from './index.module.styl';
// import { getFileUrl } from '@/utils/index';

const { Option } = Select;
const { TextArea } = Input;


@Form.create()
@Events
class FromTable extends React.Component {
  constructor(props) {
    super(props);
    // 状态
    this.state = {
      // 获取品牌数据
      warehourse: '',
      // 检验报告图片上传
      inspection: [],
      // 资质上传
      produceQualification: [],
      formData: {
        hasTax: false,
        noArea: [{}],
      },
      editorFormShow: false,
      editorArr: [],
      stepOne: [],
      // 标签数据
      dataMes: [],
      tokenObj: '',
      brandMes: '', // 品牌信息
    };
  }

  // 设置默认值
  componentDidMount() {
    const stepOne = JSON.parse(sessionStorage.getItem('stepOne')) || [];
    const { itemId } = this.props;
    this.setState({
      stepOne,
    });
    // 获取仓库地址
    this.getWarehouse();
    // 获取标签列表
    this.getTagPage();
    //  获取商品详情  图片
    if (itemId !== '') {
      this.getData(itemId);
    }
    // 监听父组件点击下一步提交表单
    // this.on('handleSubmitStepOne', () => {
    //   this.handleSubmit();
    // });
    // 监听品牌是否成功，刷新品牌种类
    this.setState({
      tokenObj: {
        token: Common.getCookie(globalThis.webConfig.fetchTokenName),
        jdxiaokang_client: clientHeader,
      },
    });
  }

  getData = async (otherId) => {
    Promise.all([
      this.getOneImgDetail(otherId), this.getTowImgDetail(otherId),
    ]).then(
      () => this.getGoodsDetail(otherId)
    );
  }

  /**
   * @description:获取标签列表页面
   * @param {object}
   * @return:无
   */
  getTagPage = () => {
    Model.goods.getTagPage().then((res) => {
      this.setState({
        dataMes: res.records,
      });
    });
  }

  // 回填图片 回填检验报告图片
  getOneImgDetail = (itemId) => {
    return new Promise((resolve) => {
      const otherId = {
        bizId: itemId,
        bizType: 'item',
        type: 'inspection',
      };
      Model.goods.imgDetail(otherId).then((res) => {
        if (res) {
          res.records.map((v) => {
            v.uid = v.id;
            v.response = { entry: { filePath: v.url, originName: v.name } };
            v.url = getFileUrl(v.url);
            return v;
          });
          this.setState({
            inspection: res.records,
          });
          resolve(res);
        }
      });
    });
  }

  // 回填生产资质
  getTowImgDetail = (itemId) => {
    return new Promise((resolve) => {
      const otherId = {
        bizId: itemId,
        bizType: 'item',
        type: 'produceQualification',
      };
      const that = this;
      // let imgArr;
      Model.goods.imgDetail(otherId).then((res) => {
        if (res) {
          res.records.map((v) => {
            v.uid = v.id;
            v.response = { entry: { filePath: v.url, originName: v.name } };
            v.url = getFileUrl(v.url);
            return v;
          });
          that.setState({
            produceQualification: res.records,
          });
          resolve(res);
        }
      });
    });
  }

  /**
   * @description: 获取商品详情
   * @param {id}
   * @return: 无
   */
  getGoodsDetail = (itemId) => {
    const { formData } = this.state;
    const otherId = {
      itemId,
    };
    Model.goods.productDetail(otherId).then((res) => {
      const { inspection, produceQualification } = this.state;
      res.recommendType = (res.recommendType || []).map((v) => {
        return String(v);
      });
      res.postsaleType = (res.postsaleType || []).map((v) => {
        return String(v);
      });
      res.inspection = inspection;
      res.produceQualification = produceQualification;

      // 标签数据回转
      const arrList = (res.tagList || []).map((v, i) => {
        const newArr = (v.tagList || []).map((item) => {
          return item.checked == true ? `${v.id}-${item.id}` : null;
        });
        return { [`recommendType_${i}`]: newArr };
      });
      (arrList || []).map((v) => {
        return (
          res[Object.keys(v)] = v[Object.keys(v)]
        );
      });
      if (res.tax) {
        formData.hasTax = true;
        res.tax *= 100;
      }
      if (Array.isArray(res.noArea) && res.noArea.length) {
        formData.noArea = unpackCity(res.noArea);
      }
      this.setState({
        stepOne: [
          { id: res.firstCatId, catName: res.firstCatName },
          { id: res.secondCatId, catName: res.secondCatName },
          { id: res.catId, catName: res.catName },
        ],
        dataMes: res.tagList,
        brandMes: { brandId: res.brandId, brandName: res.brandName, brandStatus: res.brandStatus },
        formData,
      });
      if (res) {
        this.props.form.setFieldsValue(
          res
        );
      }
    });
  }

  // 获取仓库地址列表
  getWarehouse = () => {
    const currentData = {
      pageNo: 1,
      pageSize: 15,
    };
    Model.goods.getWarehouse(currentData).then((res) => {
      if (res) {
        const warehourse = res.records.map((v) => {
          return (
            <Option value={v.id}>{v.name}</Option>
          );
        });
        this.setState({
          warehourse,
        });
      }
    });
  }

  // 检验报告图片上传
  handlemanyChange = ({ fileList }) => {
    this.setState({ inspection: fileList });
  };

  // 生产厂资质上传
  handleQuaChange = ({ fileList }) => {
    this.setState({ produceQualification: fileList });
  }

  // 表单提交
  handleSubmit = () => {
    this.emit('stepTowPostSuccess');
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  getBase = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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

  changeBranch = (e, name) => {
    const { formData } = this.state;
    formData[name] = e.target.value.trim();
    this.setState({ formData });
  }

  // 检验报告
  inspectionFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 资质上传
  produFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  // 打开新增弹窗
  showAddVis = (brandId, brandName) => {
    this.emit('showStepTowModal', { brandId, brandName });
  }

  // 编辑分类
  editorForm = (res) => {
    const newArr = res.map((v) => {
      return v.id;
    });
    this.setState({
      editorFormShow: true,
      editorArr: newArr,
    }, () => {
      // 初始化默认值
      this.myCatalog.onReset();
    });
  }

  handleCancel = () => {
    this.setState({
      editorFormShow: false,
    });
  }

  changeItem = (data) => {
    if (data.length === 3) {
      sessionStorage.setItem('stepOne', JSON.stringify(data));
      this.setState({
        stepOne: data,
        editorFormShow: false,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { warehourse, inspection, formData,
      produceQualification, editorFormShow, editorArr, stepOne, dataMes, tokenObj, brandMes } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    // 打开子组件Modal
    return (
      <section className={styles.contentInner}>
        <div className={styles.goods_content}>
          <Form {...formItemLayout} style={{ width: '100%;' }}>
            {/* ok */}
            <Form.Item label="商品分类">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {stepOne[0] ? stepOne[0].catName : ''}
                  <Icon type="right" />
                  {stepOne[1] ? stepOne[1].catName : ''}
                  <Icon type="right" />
                  {stepOne[2] ? stepOne[2].catName : ''}
                </div>
                {/* <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => this.editorForm(stepOne)}>
                  <div className={styles.iconStyle}>
                    <Icon type="form" style={{ fontSize: '16px', color: '#1890FF', marginRight: '6px' }} />
                    <span className={styles.editorStyle}>编辑</span>
                  </div>
                </div> */}
              </div>
            </Form.Item>
            {/* ok */}
            <Form.Item label="商品名称">
              {getFieldDecorator('itemTitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称',
                  },
                ],
              })(<Input placeholder="请输入商品名称" />)}
            </Form.Item>
            {/* ok */}
            <Form.Item label="商品品牌">
              <Row type="flex" align="middle">
                <Col>
                  <div className={`${brandMes.brandStatus !== 1 ? styles.brandNameStyle : null}`}>{brandMes.brandName}</div>
                </Col>

                <Col style={{ marginLeft: '10px' }}>
                  <span>
                    品牌ID:
                    {brandMes.brandId}
                  </span>
                </Col>

                <Col span={4}>
                  <div className={styles.add_btn} onClick={() => this.showAddVis(brandMes.brandId, brandMes.brandName)}>查看品牌</div>
                </Col>
              </Row>
            </Form.Item>
            {/* ok */}
            <Form.Item label="商品介绍">
              {getFieldDecorator('itemDescription', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品介绍',
                  },
                ],
              })(<TextArea autoSize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
            {
              formData.hasTax ? (
                <Form.Item label="含税税点%">
                  {getFieldDecorator('tax')(<InputNumber min={0} max={100} disabled style={{ width: '100%' }} />)}
                </Form.Item>
              ) : null
            }
            <Form.Item label="运费模版">
              <span style={{ color: '#F5222D' }}>一件包邮</span>
            </Form.Item>
            <Form.Item label="不发货区域">
              {
                Array.isArray(formData.noArea) && formData.noArea.length > 0 && formData.noArea.map((v, idx) => (
                  <div key={idx}>
                    <SelectCity
                      placeholder={formData.noArea[idx]?.areaName ? [
                        formData.noArea[idx]?.areaName,
                        formData.noArea[idx]?.childs ? formData.noArea[idx].childs[0]?.areaName : undefined,
                        formData.noArea[idx]?.childs && formData.noArea[idx].childs[0]?.childs ? formData.noArea[idx]?.childs[0]?.childs[0]?.areaName : undefined,
                      ] : undefined}
                      disabled={[true, true, true]}
                      onChange={(...args) => this.onChangeNoAreaCity(idx, ...args)}
                    />
                  </div>
                ))
              }
            </Form.Item>
            <Form.Item label="计量单位">
              {getFieldDecorator('unit', {
                rules: [
                  {
                    required: true,
                    message: '请输入计量单位',
                  },
                ],
              })(<Input placeholder="请输入计量单位" />)}
            </Form.Item>
            {(dataMes || []).map((v, i) => (
              <Form.Item label={v.name}>
                {getFieldDecorator(`recommendType_${i}`)(
                  <Checkbox.Group style={{ width: '100%' }}>
                    {
                      (v.tagList || []).map((item) => (
                        <>
                          <Checkbox value={`${item.groupId}-${item.id}`}>{item.name}</Checkbox>
                        </>
                      ))
                    }
                  </Checkbox.Group>,
                )}
              </Form.Item>
            )
            )}
            {/* 8888 */}
            <Form.Item label="商品关键词">
              {getFieldDecorator('itemKeyword')(<TextArea autoSize={{ minRows: 4, maxRows: 6 }} />)}
              <div style={{ lineHeight: '1.4', color: '#999999', fontSize: '10px', padding: '10px 0' }}>
                商品关键词请用空格分隔；有两个功能，一是可以作为站内关键词查询，在前台搜索框输入关键词后，
                能够搜索到该商品；二是作为搜索引擎收录使用
              </div>
            </Form.Item>
            {/* ok */}
            <Form.Item label="商品备注">
              {getFieldDecorator('itemRemarks')(<TextArea autoSize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
            {/* ok */}
            <Form.Item label="退货地址">
              {getFieldDecorator('refundWarehouse', {
                rules: [
                  { required: true, message: '请选择退货仓库' },
                ],
              })(<Select placeholder="请选择退货仓库">{warehourse}</Select>)}
            </Form.Item>
            {/* 8888 */}
            <Form.Item label="检验报告">
              <div>
                {getFieldDecorator('inspection', {
                  getValueFromEvent: this.inspectionFile,
                  rules: [
                    { required: true, message: '请上传检验报告' },
                  ],
                })(
                  <Upload
                    name="file"
                    action={until.baseUrl}
                    listType="picture-card"
                    fileList={inspection}
                    onChange={this.handlemanyChange}
                    headers={tokenObj}
                    accept=".jpg,.png"
                    multiple
                  />
                )}

                {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
              </div>
            </Form.Item>
            {/* 8888 */}
            <Form.Item label="生产厂资质">
              <div>
                {
                  getFieldDecorator('produceQualification', {
                    getValueFromEvent: this.produFile,
                    rules: [
                      { required: true, message: '请上传生产厂资质' },
                    ],
                  })(
                    <Upload
                      action={until.baseUrl}
                      listType="picture-card"
                      fileList={produceQualification}
                      onChange={this.handleQuaChange}
                      headers={tokenObj}
                      accept=".jpg,.png"
                    />
                  )
                }
                {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
              </div>

            </Form.Item>
            <div className={styles.innerBox} style={{}}>
              <div style={{ width: '17%' }} />
              <div style={{ display: 'flex' }}>
                <Form.Item>
                  {/* 8888 */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '8px', width: '200px' }}>保存直接发起审核</div>
                    {getFieldDecorator('directConfirm', {
                      initialValue: true,
                      valuePropName: 'checked',
                    })(
                      <Switch />
                    )}
                  </div>
                </Form.Item>
                <Form.Item>
                  {/* 8888 */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '8px', width: '200px' }}>审核通过直接上架</div>
                    {
                      getFieldDecorator('directshelf', {
                        initialValue: true,
                        valuePropName: 'checked',
                      })(
                        <Switch />
                      )
                    }
                  </div>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <Catalog
          ref={(el) => this.myCatalog = el}
          visible={editorFormShow}
          width={860}
          url={Model.goods.categoryData}
          params={{ pageNo: 1, pageSize: 15 }}
          onDeal={(d) => d.records}
          dataIndex="catName"
          dataValue="id"
          fetchIdKey="parentCid"
          value={editorArr}
          leafKeyName="isParent"
          onCancel={this.handleCancel}
          theme="purple"
          onOk={(data) => { this.changeItem(data); }}
        />
      </section>
    );
  }
}

export default FromTable;

/**
 * 数据展示前拆分省市区
 */
function unpackCity(city) {
  city = Common.clone(city);

  const add = (v) => {
    const d = Common.clone(v);
    delete d.childs;
    return d;
  };

  // 散列处理
  function hashDeal(d) {
    const result = [];
    let itemResult = null;

    function loop(data) {
      data.forEach((item) => { // 1
        if (item.level === 0) {
          itemResult = add(item);
        } else if (item.level === 1) {
          itemResult.childs = [add(item)];
        } else {
          itemResult.childs[0].childs = [add(item)];
        }

        if (Array.isArray(item.childs) && item.childs.length) {
          loop(item.childs); // 2
        } else {
          result.push(Common.clone(itemResult)); // 3
        }
      });
    }

    loop(d);
    return result;
  }


  const hashData = hashDeal(city);

  return hashData;
}
