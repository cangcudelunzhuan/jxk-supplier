import React from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Icon, message, Upload, Switch, Checkbox, Button } from 'antd';
import { Catalog, SelectCity } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Events from '@jxkang/events';
import Model, { getUploadProps } from '@/model';
import { getFileUrl } from '@/utils/index';
import styles from './index.module.styl';

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
      brandList: '',
      warehourse: '',
      loading: false,
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
    };

    this.editBegin = !this.props.itemId;

    this.cityItemIds = getItemRctIds();
  }

  // 设置默认值
  componentDidMount() {
    const stepOne = JSON.parse(sessionStorage.getItem('stepOne')) || '';
    const { itemId } = this.props;
    this.setState({
      stepOne,
    });
    // 获取品牌名称
    this.getBrandList();
    // 获取仓库地址
    this.getWarehouse();
    // 获取标签列表
    this.getTagPage();
    //  获取商品详情  图片
    if (itemId) {
      this.getData(itemId);
    }
    // 监听父组件点击下一步提交表单
    this.on('handleSubmitStepOne', () => {
      this.handleSubmit();
    });
    // 监听品牌是否成功，刷新品牌种类
    this.on('brandAddSuccess', () => {
      this.getBrandList();
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
  getTagPage=() => {
    Model.goods.getTagPage().then((res) => {
      if (res) {
        this.setState({
          dataMes: res.records,
        });
      }
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
          const nweImgArr = res.records.map((v) => {
            v.uid = v.id;
            v.response = { entry: { filePath: v.url, originName: v.name } };
            v.url = getFileUrl(v.url);
            return v;
          });
          this.setState({
            inspection: nweImgArr,
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
    const otherId = { itemId };

    Model.goods.productDetail(otherId).then((res) => {
      if (!res) {
        return false;
      }
      const { inspection, produceQualification } = this.state;
      res.recommendType = (res.recommendType || []).map((v) => {
        return String(v);
      });
      res.postsaleType = (res.postsaleType || []).map((v) => {
        return String(v);
      });
      res.inspection = inspection;
      res.produceQualification = produceQualification;
      res.directConfirm = res.directConfirm === 1;
      res.directShelf = res.directShelf === 1;
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

      this.editBegin = true;
      this.setState({
        stepOne: [
          { id: res.firstCatId, catName: res.firstCatName },
          { id: res.secondCatId, catName: res.secondCatName },
          { id: res.catId, catName: res.catName },
        ],
        dataMes: res.tagList,
        formData,
      });
      if (res) {
        this.props.form.setFieldsValue(
          res
        );
      }
    });
  }

  // 获取品牌列表
  getBrandList = () => {
    const currentData = {
      pageNo: 1,
      pageSize: 10000,
    };
    Model.goods.getBrandMes(currentData).then((res) => {
      if (res) {
        const brandList = res.records.map((v) => {
          return (
            <Option value={v.id}>{v.brandName}</Option>
          );
        });
        this.setState({
          brandList,
        });
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
    const { formData } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      fieldsValue = Common.clone(fieldsValue);
      const { inspection, produceQualification, dataMes } = this.state;
      const { itemId } = this.props;
      const newInspection = inspection.map((v) => {
        // const boolValue = v.response.entry.indexOf('https://') > -1;
        let otherEntry;
        if (v.response) {
          otherEntry = { name: v.response.entry.originName, url: `${v.response.entry.filePath}` };
        }
        return otherEntry;
      });
      const newOroduceQualification = produceQualification.map((v) => {
        // const boolValue = v.response.entry.indexOf('https://') > -1;
        let otherEntry;
        if (v.response) {
          otherEntry = { name: v.response.entry.originName, url: `${v.response.entry.filePath}` };
        }
        return otherEntry;
      });
      const { stepOne } = this.state;
      // 标签信息处理
      const AllArr = (dataMes || []).map((v, i) => {
        const newAllArr = (fieldsValue[`recommendType_${i}`] || []).map((item) => {
          const newArr = item ? item.split('-') : '';
          return newArr[1];
        });
        // delete fieldsValue[`recommendType_${i}`];
        return { [v.id]: newAllArr };
      });
      const obj1 = {};
      (AllArr || []).map((item) => {
        obj1[Object.keys(item)] = item[Object.keys(item)];
        return item;
      });
      if (JSON.stringify(obj1) !== '{}') {
        fieldsValue.tagMap = obj1;
      }
      fieldsValue.directConfirm = fieldsValue.directConfirm === true ? 1 : 0;
      fieldsValue.directShelf = fieldsValue.directShelf === true ? 1 : 0;
      fieldsValue.itemId = itemId || null;
      fieldsValue.urls = [
        { type: 'inspection', urlObjects: newInspection },
        { type: 'produceQualification', urlObjects: newOroduceQualification },
      ];
      delete (fieldsValue.inspection);
      delete (fieldsValue.produceQualification);
      fieldsValue.firstCatId = stepOne[0].id;
      fieldsValue.secondCatId = stepOne[1].id;
      fieldsValue.catId = stepOne[2].id;

      // 2020-06-10 新需求 添加含税税点、不发货区域
      if (formData.hasTax && !fieldsValue.tax) {
        return message.warn('请输入含税税点');
      }
      if (formData.hasTax && (fieldsValue.tax >= 0 || fieldsValue.tax <= 100)) {
        fieldsValue.tax /= 100;
      } else {
        delete fieldsValue.tax;
      }

      if (Array.isArray(formData.noArea) && JSON.stringify(formData.noArea) !== '[{}]') {
        if (cityVerif(formData.noArea)) {
          return message.warn('不发货区域数据选填错误，请修改地区范围后再操作');
        }
        fieldsValue.noArea = mergeCity(formData.noArea);
      }

      if (itemId) {
        this.editorNewGoods(fieldsValue);
      } else {
        this.addNewGoods(fieldsValue);
      }
    });
  };

  // 表单提交
  addNewGoods = (currentData) => {
    Model.goods.addNewGoods(currentData).then((res) => {
      if (res) {
        this.emit('stepTowPostSuccess', { itemId: res.itemId });
      }
    });
  }

  editorNewGoods = (currentData) => {
    const { itemId } = this.props;
    Model.goods.editorNewGoods(currentData).then((res) => {
      if (res) {
        this.emit('stepTowPostSuccess', { itemId });
      }
    });
  }

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
  showAddVis = () => {
    this.emit('showStepTowModal');
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

  handlerChange = (name, value) => {
    const { formData } = this.state;
    formData[name] = value;
    this.setState({ formData });
  }

  handlerAddNoArea = () => {
    const { formData } = this.state;
    formData.noArea.push({});
    this.setState({ formData });
  }

  handlerDelNoArea = (index) => {
    const { formData } = this.state;
    formData.noArea.splice(index, 1);

    this.cityItemIds[0] = this.cityItemIds[1]();

    this.setState({ formData });
  }

  onChangeNoAreaCity = (index, value, cityIndex) => {
    const { formData } = this.state;
    if (cityIndex === 0) {
      formData.noArea[index] = value;
    } else if (cityIndex === 1) {
      formData.noArea[index].childs = [value];
    } else if (cityIndex === 2) {
      formData.noArea[index].childs[0].childs = [value];
    }

    this.setState({ formData });
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

  onCleanArea = () => {
    const { formData } = this.state;
    formData.noArea = [{}];

    this.cityItemIds[0] = this.cityItemIds[1]();

    this.setState({ formData });
  }

  onCheckCity = () => {
    const { formData } = this.state;
    const vResult = cityVerif(formData.noArea);
    if (vResult) {
      message.warn(`检测到"${vResult.areaName}"选填有误,请重新修改数据`);
    } else {
      message.success('数据检测无误');
    }
  }

  render() {
    const { formData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { brandList, warehourse, inspection,
      produceQualification, editorFormShow, editorArr, stepOne, dataMes } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">文件上传</div>
      </div>
    );

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
            <Form.Item label="商品分类">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {stepOne[0] ? stepOne[0].catName : ''}
                  <Icon type="right" />
                  {stepOne[1] ? stepOne[1].catName : ''}
                  <Icon type="right" />
                  {stepOne[2] ? stepOne[2].catName : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => this.editorForm(stepOne)}>
                  <div className={styles.iconStyle}>
                    <Icon type="form" style={{ fontSize: '16px', color: '#1890FF', marginRight: '6px' }} />
                    <span className={styles.editorStyle}>编辑</span>
                  </div>
                  {/* <span className={styles.editorStyle}>添加/查看扩展分类</span> */}
                </div>
              </div>
            </Form.Item>
            <Form.Item label="商品名称">
              {getFieldDecorator('itemTitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称',
                  },
                ],
              })(<Input placeholder="请输入商品名称" maxLength={50} />)}
            </Form.Item>
            <Form.Item label="商品品牌">
              <Row type="flex" align="middle">
                <Col span={20}>
                  {getFieldDecorator('brandId', {
                    rules: [{ required: true, message: '请选择商品品牌' }],
                  })(
                    <Select placeholder="请选择商品品牌">
                      {brandList}
                    </Select>
                  )}
                </Col>
                <Col span={4}>
                  <div className={styles.add_btn} onClick={this.showAddVis}>新增</div>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="商品介绍">
              {getFieldDecorator('itemDescription', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品介绍',
                  },
                ],
              })(<TextArea maxLength="500" autoSize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item label="是否含税">
              <Switch checked={formData.hasTax} onChange={(e) => this.handlerChange('hasTax', e)} />
            </Form.Item>
            <Form.Item label="含税税点%">
              {getFieldDecorator('tax')(<InputNumber min={0} max={100} disabled={!formData.hasTax} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="运费模版">
              <span style={{ color: '#F5222D' }}>一件包邮</span>
            </Form.Item>
            <Form.Item label="不发货区域">
              {
                Array.isArray(formData.noArea) && formData.noArea.length && this.editBegin && formData.noArea.map((v, idx, o) => (
                  <div key={this.cityItemIds[0] + idx}>
                    <div className={styles.handler_city}>
                      {
                        o.length === idx + 1 && idx + 1 < 31 ? <a onClick={this.handlerAddNoArea}>新增</a> : <a onClick={() => this.handlerDelNoArea(idx)}>删除</a>
                      }
                    </div>
                    <SelectCity
                      placeholder={formData.noArea[idx]?.areaName ? [
                        formData.noArea[idx]?.areaName,
                        formData.noArea[idx]?.childs ? formData.noArea[idx].childs[0]?.areaName : undefined,
                        formData.noArea[idx]?.childs && formData.noArea[idx].childs[0]?.childs ? formData.noArea[idx]?.childs[0]?.childs[0]?.areaName : undefined,
                      ] : undefined}
                      value={formData.noArea[idx]?.areaCode ? [
                        formData.noArea[idx]?.areaCode,
                        formData.noArea[idx]?.childs ? formData.noArea[idx].childs[0]?.areaCode : undefined,
                        formData.noArea[idx]?.childs && formData.noArea[idx].childs[0]?.childs ? formData.noArea[idx]?.childs[0]?.childs[0]?.areaCode : undefined,
                      ] : undefined}
                      onChange={(...args) => this.onChangeNoAreaCity(idx, ...args)}
                    />
                  </div>
                ))
              }
              <Button onClick={this.onCleanArea}>清空所有不发货区域</Button>
              <Button className="ml10" type="primary" onClick={this.onCheckCity}>数据验证</Button>
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
            <Form.Item label="商品关键词">
              {getFieldDecorator('itemKeyword')(<TextArea autoSize={{ minRows: 4, maxRows: 6 }} />)}
              <div style={{ lineHeight: '1.4', color: '#999999', fontSize: '10px', padding: '10px 0' }}>
                商品关键词请用空格分隔；有两个功能，一是可以作为站内关键词查询，在前台搜索框输入关键词后，
                能够搜索到该商品；二是作为搜索引擎收录使用
              </div>
            </Form.Item>
            <Form.Item label="商品备注">
              {getFieldDecorator('itemRemarks')(<TextArea autoSize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item label="退货地址">
              {getFieldDecorator('refundStockId', {
                rules: [
                  { required: true, message: '请选择退货仓库' },
                ],
              })(<Select placeholder="请选择退货仓库">{warehourse}</Select>)}
            </Form.Item>
            <Form.Item label="检验报告">
              <div>
                {getFieldDecorator('inspection', {
                  getValueFromEvent: this.inspectionFile,
                  rules: [
                    { required: true, message: '请上传检验报告' },
                  ],
                })(
                  <Upload
                    {
                      ...getUploadProps({
                        listType: 'picture-card',
                        fileList: inspection,
                        showUploadList: true,
                        onChange: this.handlemanyChange,
                      })
                    }
                  >
                    {inspection.length >= 8 ? null : uploadButton}
                  </Upload>
                )}
              </div>
            </Form.Item>
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
                      {
                      ...getUploadProps({
                        listType: 'picture-card',
                        fileList: produceQualification,
                        showUploadList: true,
                        onChange: this.handleQuaChange,
                      })
                    }
                    >
                      {produceQualification.length >= 8 ? null : uploadButton}
                    </Upload>
                  )
                }
              </div>
            </Form.Item>
            <div className={styles.innerBox} style={{}}>
              <div style={{ width: '17%' }} />
              <div style={{ display: 'flex' }}>
                <Form.Item>
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '8px', width: '200px' }}>审核通过直接上架</div>
                    {
                    getFieldDecorator('directShelf', {
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
          onOk={(data) => { this.changeItem(data); }}
        />
      </section>
    );
  }
}

export default FromTable;

/**
 * 以前代码需谨慎修改，稍作不注意可能造成其它bug或死循环
 * 数据提交前合并省市区
 */
function mergeCity(citys) {
  // 散列处理
  function hashDeal(d) {
    const hashData = [];
    const reference = {};
    function hash(data) {
      data.forEach((item) => {
        if (!reference[item.areaCode]) {
          const iitem = Common.clone(item);
          delete iitem.childs;
          hashData.push(iitem);
          reference[item.areaCode] = true;
        }

        if (Array.isArray(item.childs) && item.childs.length) {
          hash(item.childs);
        }
      });
    }

    if (Array.isArray(d) && d.length) {
      hash(d);
    }

    return hashData;
  }

  // 树形化处理
  function treeDeal(d) {
    const srouce = Common.clone(d);
    const result = [];
    let copyCount = 0;

    srouce.forEach((item) => {
      if (item.parentCode == '0') {
        result.push(item);
      }
    });

    result.forEach((v) => {
      srouce.splice(srouce.findIndex((vv) => vv.areaCode == v.areaCode), 1);
    });

    // ============================

    function loopLeaf(ldata) { // ldata -> loop data
      if (ldata) {
        const fitem = srouce.filter((item) => {
          if (item.parentCode == ldata.areaCode) {
            return true;
          }
          return false;
        });
        if (fitem) {
          ldata.childs = ldata.childs || [];
          ldata.childs = ldata.childs.concat(fitem);
          copyCount += fitem.length;
        }
      }
    }

    function loop(data) {
      data.forEach((item) => {
        if (Array.isArray(item.childs) && item.childs.length) {
          loop(item.childs);
        } else {
          loopLeaf(item);
        }
      });
    }

    if (Array.isArray(srouce) && srouce.length) {
      // 控制好，while里面有递归，很容易出现死循环
      while (copyCount < srouce.length) {
        loop(result);
      }
    }

    return result;
  }

  const hashData = hashDeal(citys);

  const treeData = treeDeal(hashData);

  return treeData;
}

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


/**
 * 提交时的数据验证
 */
function cityVerif(city) {
  city = Common.clone(city);
  const result = [];
  let cur = null;

  function loop(d) {
    d.forEach((item) => {
      if (item.parentCode == '0') { cur = item; }
      if (Array.isArray(item.childs) && item.childs.length) {
        loop(item.childs);
      } else {
        if (item.level == 2) { // 祖父id
          item.grandId = cur.areaCode;
        }
        result.push(item);
      }
    });
  }

  loop(city);

  // 数据开始对比
  let ret = null;
  result.some((v) => {
    const areaCode = v.areaCode;
    if (result.find((vv) => areaCode === vv.grandId || areaCode === vv.parentCode)) {
      ret = v;
      return true;
    }
    return false;
  });

  return ret;
}

/**
 * 生成列表临时id
 */
function getItemRctIds() {
  let itemIds = `1-${Date.now().toString().slice(5)}`;
  return [itemIds, function () {
    const sv = itemIds.split('-');
    itemIds = `${sv[0] * 1 + 1}-${sv[1]}-`;
    return itemIds;
  }];
}
