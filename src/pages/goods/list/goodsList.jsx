import React from 'react';
import { Row, Col, Card, Input, Button, Select, Switch, message, Modal, Table, Icon } from 'antd';
import { BoxTitle, Paginator, DropHandler, FormControl, Catalog, ShowImage } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import Model from '@/model';
import utils, { getFileUrl } from '@/utils/index';
import HeadType from './components/headType/headType';
import styles from './index.module.styl';

const { confirm } = Modal;
const { Option } = Select;

class goodsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeArr: [],
      pageListColumns: [
        {
          title: '编号（SPU）',
          dataIndex: 'itemId',
          sorter: true,
          width: '100',
          key: 'itemId',
        }, {
          title: '商品图片',
          width: 100,
          render: (item) => (
            <div className={styles.photoMes}>
              {item.mainImgUrl ? (
                <ShowImage>
                  <img title="图片详情" src={getFileUrl(item.mainImgUrl)} alt="" />
                </ShowImage>
              ) : ''}
            </div>
          ),
        }, {
          title: '商品名称',
          width: 200,
          render: (item) => (
            <div style={{ width: '100%' }}>
              <div>{item.itemTitle}</div>
              <div>
                品牌：
                {item.brandName}
              </div>
            </div>
          ),
        }, {
          title: '销量',
          dataIndex: 'salesQty',
          key: '',
        }, {
          title: '审核状态',
          render: (item) => (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

                {item.verifyStatus === 4 ? (
                  <>
                    <div className={`${styles.roundStyle} ${styles.passStyle}`} />
                    <div style={{ fontSize: '12px' }}>已通过</div>
                  </>
                ) : ''}

                {item.verifyStatus === 2 ? (
                  <>
                    <div className={`${styles.roundStyle} ${styles.inVerify}`} />
                    <div style={{ fontSize: '12px' }}>待审核</div>
                  </>
                ) : ''}

                {item.verifyStatus === 1 ? (
                  <>
                    <div className={`${styles.roundStyle} ${styles.notSubmit}`} />
                    <div style={{ fontSize: '12px' }}>未提交</div>
                  </>
                ) : ''}

                {item.verifyStatus === 3 ? (
                  <>
                    <div className={`${styles.roundStyle} ${styles.failed}`} />
                    <div style={{ fontSize: '12px' }}>未通过</div>
                  </>
                ) : ''}
              </div>
              <div style={{ fontSize: '12px', color: '#1890FF', cursor: 'pointer' }} onClick={() => this.auditDetails(item)}>审核详情</div>
            </div>
          ),
        },
        {
          title: '上/下架',
          render: (item) => (
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={item.shelfStatus === 1}
              onChange={(e) => this.swichChange(e, item)}
            />
          ),
        }, {
          title: 'SKU库存/价格',
          render: (item) => (
            <div>
              <a onClick={() => this.editorSku(item)}>编辑</a>
            </div>
          ),
        }, {
          title: '操作',
          width: 100,
          render: (item) => (
            <div className="page-list-handler">
              <DropHandler width={100} style={{ marginTop: '10px' }}>
                <a href={`/goods/lookdetail/1/${item.itemId}`} target="_blank" rel="noopener noreferrer">查看</a>
                <a onClick={() => { this.editoreItem(item); }}>编辑</a>
                <a onClick={() => { this.postDeal(item); }}>提交审核</a>
                <a onClick={() => { this.deleteItem(item); }}>删除</a>
              </DropHandler>
            </div>
          ),
        },
      ],
      params: {
        goodsName: '',
        itemId: '',
        warehouseId: '',
        verifyStatusList: [],
        shelfStatus: '',
        category1: '',
        category2: '',
        category3: '',
      },
      visible: false,
      tableFormData: {
        formData: [],
      },
      tableDataDetail: {
        formData: [],
      },
      defaultColumns: [
        {
          title: 'skuId',
          dataIndex: 'skuId',
          key: 'skuId',
          width: 120,
        }, {
          title: '内部编码',
          dataIndex: 'innerSkuId',
          key: 'innerSkuId',
          width: 120,
        }, {
          title: '超级卖家价',
          dataIndex: 'vipTradePrice',
          width: 120,
          key: 'vipTradePrice',
          render: (text, recored, index) => (
            <FormControl
              type="text"
              required
              name={`formData.${index}.vipTradePrice`}
              verifMessage="请输入市场价"
            />
          ),
        }, {
          title: '普通卖家价',
          dataIndex: 'tradePrice',
          width: 120,
          key: 'tradePrice',
          render: (text, recored, index) => (
            <FormControl
              type="text"
              required
              name={`formData.${index}.tradePrice`}
              verifMessage="请输入市场价"
            />
          ),
        }, {
          title: '建议零售价',
          dataIndex: 'retailPrice',
          width: 120,
          key: 'retailPrice',
          render: (text, recored, index) => (
            <FormControl
              type="text"
              required
              name={`formData.${index}.retailPrice`}
              verifMessage="请输入建议零售价"
            />
          ),
        }, {
          title: '加减库存',
          width: 240,
          render: (item, records, index) => {
            const { addSbstrctStyle } = this.state;
            return (
              <div style={{ display: 'flex' }}>
                <div className={styles.allBtn}>
                  <div className={styles.addStrct} style={item.addDefalutValue ? addSbstrctStyle : {}} onClick={() => this.addItem(item, index)}>
                    <Icon type="plus-square" />
                  </div>
                  <div className={styles.btnStrct} style={item.subDefalutValue ? addSbstrctStyle : {}} onClick={() => this.substrct(item, index)}>
                    <Icon type="minus-square" />
                  </div>
                </div>
                <Input type="text" placeholder="请输入库存值" value={item.newBtnValue} onChange={(e) => this.onAddchange(e, index, item)} />
                <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this.confirmItem(item, index)}>确认</Button>
              </div>
            );
          },
        }, {
          title: '总库存',
          dataIndex: 'totalStockQty',
          width: 100,
          key: 'totalStockQty',
        }, {
          title: '可用库存',
          dataIndex: 'stockQty',
          width: 100,
          key: 'stockQty',
        }, {
          title: '占用库存',
          dataIndex: 'channelQty',
          width: 100,
          key: 'channelqty',
        }, {
          title: '冻结库存',
          dataIndex: 'frozenQty',
          width: 100,
          key: 'frozenQty',
        }, {
          title: '库存预警值',
          dataIndex: 'stockQtyWarn',
          width: 120,
          key: 'stockQtyWarn',
          render: (text, recored, index) => (
            <FormControl
              type="text"
              required
              name={`formData.${index}.stockQtyWarn`}
              verifMessage="请输入商品首批库存"
            />
          ),
        }, {
          title: '上/下架',
          width: 100,
          render: (item) => {
            const { currentStatus } = this.state;
            return (
              <Switch
                disabled={currentStatus === 1 ? '' : 'disabled'}
                checked={item.shelfStatus === 1}
                onChange={(e) => { this.onChangeItem(e, item); }}
              />
            );
          },
        },
      ],
      // 审核详情弹框
      defaultColumnsDetail: [
        {
          title: '审核时间',
          dataIndex: 'gmtCreated',
          key: 'gmtCreated',
          width: 100,
          render: (text) => {
            return (
              <div>{utils.timeStampTurnTimeDetail(text)}</div>
            );
          },
        }, {
          title: '审核人员',
          dataIndex: 'verifyOperation',
          width: 80,
          key: 'vipTradePrice',
        }, {
          title: '审核结果',
          dataIndex: 'verifyCode',
          width: 80,
          key: 'verifyCode',
          render: (text) => {
            return (
              <div>
                {text == 'FAILED' ? '未通过' : ''}
                {text == 'PASS' ? '已通过' : ''}
              </div>
            );
          },
        }, {
          title: '反馈详情',
          dataIndex: 'verifyContent',
          width: 200,
          key: 'verifyContent',
        },
      ],
      // 批量操作的值
      batchOperatioChangeValue: '',
      // 所有选中的数据的值
      allSelectValue: [],
      // 搜索框的值
      searchValue: '',
      // 搜索类型的值
      visibleDetail: false,
      editorFormShow: false,
      editorArr: [],
      currentClassData: '类目筛选',
      newData: '',
      itemId: '',
      currentStatus: '',
      addSbstrctStyle: {
        background: '#D9D9D9',
      },
      // 记录加减的状态
      subOrAdd: '',
    };
  }


  componentDidMount() {
    this.selectItemStatis();
    const id = this.props.location.query ? this.props.location.query.id : '';
    this.setState({
      newData: { refundStockId: id },
    });
  }

  /**
   * @description: 获取商品统计接口
   * @param {type}
   * @return:
   */

  selectItemStatis = () => {
    Model.goods.selectItemStatis().then((res) => {
      if (res) {
        const currentData = [
          { name: '全部商品', num: res.totalCount },
          { name: '已上架', num: res.upShelfCount },
          { name: '未上架', num: res.downShelfCount },
          { name: '待审核', num: res.inVerifyCount },
          { name: '未通过', num: res.failedCount },
        ];
        this.setState({
          typeArr: currentData,
        });
      }
    });
  }


  /**
   * @description: 底部批量操作
   * @param {e}
   * @return: 无
   */
  batchOperatioChange = (e) => {
    this.setState({
      batchOperatioChangeValue: e,
    });
  }

  /**
   * @description: 选中表格中的某个值的出发事件
   * @param {key,value}
   * @return:无
   */
  changeallvalue = (key, value) => {
    this.setState({
      allSelectValue: value,
    });
  }

  /**
   * @description: 批量操作 0上架 1下架  2 批量删除
   * @param {type}
   * @return:
   */
  confirmOperate = () => {
    const that = this;
    const { batchOperatioChangeValue, allSelectValue } = this.state;
    const newArr = (allSelectValue || []).map((v) => {
      return v.itemId;
    });
    confirm({
      title: '确认对选中商品进行当前操作?',
      okType: 'danger',
      onOk() {
        if (batchOperatioChangeValue === '2') {
          Model.goods.deleteItem(newArr).then((res) => {
            if (res) {
              message.success('删除成功');
              that.setState({
                allSelectValue: [],
              });
              that.fetchGrid.fetch();
            }
          });
        }
        if (batchOperatioChangeValue === '0') {
          const currentData = {
            itemIds: newArr,
            shelfStatus: 'ON_SALES',
          };
          Model.goods.shelfItem(currentData).then((res) => {
            if (res) {
              message.success('上架成功');
              that.fetchGrid.fetch();
            }
          });
        }
        if (batchOperatioChangeValue === '1') {
          const currentData = {
            skuIds: newArr,
            shelfStatus: 'DOWN_SALES',
          };
          Model.goods.shelfItem(currentData).then((res) => {
            if (res) {
              message.success('下架成功');
              that.fetchGrid.fetch();
            }
          });
        }
      },
    });
  }

  /**
   * @description: 搜索框值的变化
   * @param {e}
   * @return: 返回值
   */
  changeItem = (e) => {
    this.setState({
      searchValue: utils.trimAllSpace(e.target.value),
    });
  }

  /**
   * @description: 点击搜索按钮查询值
   * @param {type}
   * @return:无
   */
  searchValue = () => {
    const { searchValue, params } = this.state;
    params.goodsName = searchValue;
    this.setState({
      params,
    }, () => {
      this.fetchGrid.fetch(params);
    });
  }


  /**
   * @description:状态筛选
   * @param {Object}
   * @return:
  */
  rejHandleChange = (e) => {
    const { params } = this.state;
    params.verifyStatusList = e;
    this.setState({
      params,
    });
  }

  /**
    * @description:监听加减函数
    * @param {type}
    * @return:
    */

  onAddchange = (e, index) => {
    const { tableFormData } = this.state;
    const newBtnValue = e.target.value.trim();
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(newBtnValue) && reg.test(newBtnValue)) || newBtnValue === '' || newBtnValue === '-') {
      console.log('newBtnValue', newBtnValue);
      tableFormData.formData[index].newBtnValue = newBtnValue;
      this.setState({
        tableFormData,
      });
    }
  }

  addItem = (item, index) => {
    const { tableFormData } = this.state;
    // (tableFormData.formData)[index].addSubValue = Number((tableFormData.formData)[index].stockQty);
    // (tableFormData.formData)[index].stockQty = Number((tableFormData.formData)[index].stockQty) + Number(btnValue);
    (tableFormData.formData)[index].addDefalutValue = false;
    (tableFormData.formData)[index].subDefalutValue = true;
    this.setState({
      // tableFormData,
      subOrAdd: 1,
    });
  }

  substrct = (item, index) => {
    const { tableFormData } = this.state;
    // (tableFormData.formData)[index].stockQty = Number((tableFormData.formData)[index].stockQty) - Number(btnValue);
    (tableFormData.formData)[index].addDefalutValue = true;
    (tableFormData.formData)[index].subDefalutValue = false;
    this.setState({
      // tableFormData,
      subOrAdd: 0,
    });
  }

  confirmItem = (item, index) => {
    const { subOrAdd, tableFormData } = this.state;
    console.log(item.newBtnValue);
    if (!item.newBtnValue) {
      message.warning('请输入库存值');
      return false;
    }
    const currentData = {
      skuPrimaryId: item.skuPrimaryId,
      skuId: item.skuId,
      financeType: subOrAdd === 1 ? 1 : -1,
      stockStepQty: item.newBtnValue,
    };
    Model.goods.updateStockQty(currentData).then((res) => {
      if (res) {
        message.success('库存已修改');
        if (subOrAdd === 1) {
          (tableFormData.formData)[index].stockQty = Number((tableFormData.formData)[index].stockQty) + Number(item.newBtnValue);
          (tableFormData.formData)[index].totalStockQty = Number((tableFormData.formData)[index].totalStockQty) + Number(item.newBtnValue);
          tableFormData.formData[index].newBtnValue = '';
        } else {
          (tableFormData.formData)[index].stockQty = Number((tableFormData.formData)[index].stockQty) - Number(item.newBtnValue);
          (tableFormData.formData)[index].totalStockQty = Number((tableFormData.formData)[index].totalStockQty) - Number(item.newBtnValue);
          tableFormData.formData[index].newBtnValue = '';
        }
        this.fetchGrid.fetch();
        this.setState({
          tableFormData,
        });
      }
    });
  }

  batchUpdatePrice = () => {
    const { tableFormData } = this.state;
    Model.goods.batchUpdatePrice(tableFormData.formData).then((res) => {
      if (res) {
        message.success('提交成功');
        this.setState({
          visible: false,
        });
      }
    });
  }

  // 审核筛选数据监听
  handleChange = (value) => {
    const { params } = this.state;
    params.shelfStatus = value;
    this.setState({
      params,
    });
  }

  swichChange = (e, currentData) => {
    this.shelfItem([currentData.itemId], e == true ? 'ON_SALES' : 'DOWN_SALES');
  }

  dealData = (value) => {
    return value;
  }

  editorSku = (data, type) => {
    if (type !== 1) {
      this.setState({
        currentStatus: data.shelfStatus,
      });
    }
    this.setState({
      itemId: data.itemId,
    }, () => {
      this.getSkuDetail();
    });
  }

  //  获取库存信息
  getSkuDetail = () => {
    const { itemId } = this.state;
    const currentData = {
      itemId,
    };
    Model.goods.getSimpleItemSkuList(currentData).then((res) => {
      const { tableFormData, defaultColumns } = this.state;
      tableFormData.formData = res.records;
      const newArr = (res.records.length !== 0 ? res.records[0].propsValue : []).map((v, i) => {
        return {
          title: v.specsName,
          dataIndex: `dynamic_${i}`,
          width: 80,
          key: `dynamic_${i}`,
        };
      });

      res.records.map((v) => {
        v.propsValue.map((item, i) => {
          v[`dynamic_${i}`] = item.propertyValue;
          return { [`dynamic_${i}`]: item.propertyValue };
        });
        v.addDefalutValue = true;
        v.subDefalutValue = true;
        v.addsubValue = v.stockQty;
        return v;
      });

      const stateData = defaultColumns.find((v) => {
        return String(v.dataIndex).indexOf('dynamic') > -1;
      });
      let allArrData;
      if (stateData) {
        allArrData = defaultColumns;
      } else {
        allArrData = [...newArr, ...defaultColumns];
      }
      this.setState({
        visible: true,
        tableFormData,
        defaultColumns: allArrData,
      });
    });
  }

  // 商品上下架
  shelfItem = (skuIds, boolData) => {
    const currentData = {
      itemIds: skuIds,
      shelfStatus: boolData,
    };
    Model.goods.shelfItem(currentData).then((res) => {
      if (res) {
        this.fetchGrid.fetch();
      }
    });
  }

  // 删除数据
  deleteItem = (data) => {
    const that = this;
    confirm({
      title: '确认删除当前商品?',
      okType: 'danger',
      onOk() {
        Model.goods.deleteItem([data.itemId]).then((res) => {
          if (res) {
            message.success('删除成功');
            that.fetchGrid.fetch();
          }
        });
      },
    });
  }

  /**
   * @description: sku上下架
   * @param {Object}
   * @return: 无
   */
  onChangeItem = (e, item) => {
    const currentData = {
      skuPrimaryIds: [item.skuPrimaryId],
      shelfStatus: e === false ? 'DOWN_SALES' : 'ON_SALES',
    };
    Model.goods.shelfItemSku(currentData).then((res) => {
      if (res) {
        this.editorSku(item, 1);
      }
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  hideModalDetail = () => {
    this.setState({
      visibleDetail: false,
    });
  };

  // 提交审核
  postDeal = (data) => {
    // submitItem
    const current = {
      itemId: data.itemId,
    };
    Model.goods.submitItem(current).then((res) => {
      if (res) {
        message.success('提交成功');
        this.fetchGrid.fetch();
      }
    });
  }

  /**
   * @description: 查看商品详情
   * @param {Object}
   * @return:无
   */
  lookDetail = (data) => {
    const { history } = this.props;
    history.push(`/goods/lookdetail/1/${data.itemId}`);
  }

  /**
   * @description: 跳转编辑
   * @param {Object}
   * @return:无
   */
  editoreItem = (data) => {
    const { history } = this.props;
    history.push(`/goods/add/1/${data.itemId}`);
  }

  // 审核详情
  auditDetails = (data) => {
    this.getItemVerifyList(data.itemId);
  }

  /**
   * @description: 获取审核详情接口数据
   * @param {object}
   * @return: 无
   */
  getItemVerifyList = (itemId) => {
    const currentData = {
      itemId,
    };
    Model.goods.getItemVerifyList(currentData).then((res) => {
      const { tableDataDetail } = this.state;
      tableDataDetail.formData = res.records;
      if (res) {
        this.setState({
          visibleDetail: true,
          tableDataDetail,
        });
      }
    });
  }

  /**
   * @description: 发布新品
   * @param {type}
   * @return:
   */
  goAddGoods = () => {
    const { history } = this.props;
    history.push('/goods/add');
  }

  showClass = () => {
    this.setState({
      editorFormShow: true,
    });
  }

  handleCancel = () => {
    this.setState({
      editorFormShow: false,
    });
  }

  exportGoods = () => {
    const { params } = this.state;
    params.pageSize = 2000;
    Model.goods.getSupplierProductExport(params).then((res) => {
      if (res.type.includes('json')) {
        res.text().then((ret) => {
          ret = JSON.parse(ret);
          message.warning(ret.message);
        });
      } else {
        Common.download(res, '商品列表.xls', 'excel');
      }
    });
  }

  changeClassItem = (currentData) => {
    const { params } = this.state;
    if (currentData.length === 3) {
      const newArr = currentData.map((v) => {
        return { id: v.id, catName: v.catName };
      });
      params.category1 = newArr[0].id;
      params.category2 = newArr[1].id;
      params.category3 = newArr[2].id;
      this.setState({
        editorFormShow: false,
        currentClassData: newArr,
        params,
      });
    }
  }

  cancalItem = () => {
    const { params } = this.state;
    params.category1 = '';
    params.category2 = '';
    params.category3 = '';
    this.setState({
      currentClassData: [],
      params,
    });
  }

  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { typeArr, pageListColumns, tableFormData, defaultColumns,
      visibleDetail, defaultColumnsDetail,
      tableDataDetail, editorFormShow, editorArr, currentClassData, newData, itemId } = this.state;

    return (
      /** Layout-admin:Start */
      <div>
        <HeadType typeArr={typeArr} />
        <Card style={{ width: '100%' }}>
          <section className={styles.headTop}>
            <Row type="flex" alignItems="middle" style={{ marginBottom: '10px' }}>
              <div className={styles.searchLable} style={{ width: '100px', lineHeight: '32px', textAlign: 'center' }}>商品搜索:</div>
              <Input style={{ width: 300 }} onChange={(e) => this.changeItem(e)} placeholder="请输入商品货号或则商品ID" />
            </Row>

            <Row type="flex" style={{ marginBottom: '10px' }}>
              <div className={styles.searchLable} style={{ width: '100px', lineHeight: '32px', textAlign: 'center' }}> 审核筛选：</div>
              <Select
                mode="multiple"
                className={styles.selectStyle}
                placeholder="请选择筛选值"
                showSearch={false}
                onChange={this.rejHandleChange}
                style={{ width: 300 }}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="NOT_SUBMIT">未提交</Select.Option>
                <Select.Option value="IN_VERIFY">待审核</Select.Option>
                <Select.Option value="PASS">已通过</Select.Option>
                <Select.Option value="FAILED">未通过</Select.Option>
              </Select>


              <div className={styles.searchLable} style={{ width: '100px', lineHeight: '32px', textAlign: 'center' }}> 状态筛选：</div>
              <Select defaultValue="" className={styles.selectStyle} onChange={this.handleChange} style={{ width: 300 }}>
                <Option value="">全部</Option>
                <Option value="ON_SALES">上架</Option>
                <Option value="DOWN_SALES">下架</Option>
              </Select>

            </Row>
            <Row type="flex" justify="space-between" style={{ marginBottom: '10px' }}>
              <Col span={14} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100px', lineHeight: '32px', textAlign: 'center' }}> 类目筛选：</div>
                <>
                  {currentClassData.length === 3
                    ? (
                      <span>
                        <i style={{ color: '#F5222D' }}>{currentClassData[0].catName}</i>
                        <Icon type="right" style={{ padding: '0 4px' }} />
                        <i style={{ color: '#F5222D' }}>{currentClassData[1].catName}</i>
                        <Icon type="right" style={{ padding: '0 4px' }} />
                        <i style={{ color: '#F5222D' }}>{currentClassData[2].catName}</i>
                        <Button style={{ marginLeft: '20px' }} onClick={this.cancalItem}>取消</Button>
                      </span>
                    )
                    : <a onClick={this.showClass}>类目筛选</a>}
                </>
                <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.searchValue}>搜索</Button>
                <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.exportGoods}>商品导出</Button>

              </Col>
              <Col>
                <Button type="primary" ghost onClick={this.goAddGoods} style={{ width: '200px' }}>
                  发布新品
                </Button>
              </Col>
            </Row>
          </section>
          <section className={styles.contentBot}>
            <div className="pagination-page">
              {/* 表格 */}
              <BoxTitle
                title="数据列表"
                className={styles.box_title}
              />
              {/* 分页器 */}
              <Paginator
                url={Model.goods.getItemList}
                columns={pageListColumns}
                params={newData}
                tableConfig={{
                  rowSelection: {
                    onChange: (key, e) => {
                      this.changeallvalue(key, e);
                    },
                  },
                }}
                scope={(el) => this.fetchGrid = el}
                onDeal={(e) => this.dealData(e)}
                extra={(
                  <div>
                    <Select placeholder="批量操作" style={{ width: 120, marginRight: '10px' }} onChange={this.batchOperatioChange}>
                      <Option value="0">商品上架</Option>
                      <Option value="1">商品下架</Option>
                      <Option value="2">批量删除</Option>
                    </Select>
                    <Button type="primary" ghost onClick={this.confirmOperate}>确定</Button>
                  </div>
                )}
              />
            </div>
            {/** 列表分页 */}
          </section>
        </Card>
        {/* 编辑库存，售价信息 */}
        <Modal
          title="编辑库存/售价信息"
          visible={this.state.visible}
          onOk={this.batchUpdatePrice}
          width={1080}
          onCancel={this.hideModal}
        >
          <div className={styles.table_box}>
            <sapn>
              商品货号SPU:
              {itemId}
            </sapn>
            <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={tableFormData}>
              <Table
                rowKey="id"
                columns={defaultColumns}
                dataSource={tableFormData.formData}
                pagination={false}
                scroll={{ x: '1080' }}
              />
            </FormControl.Wrapper>
          </div>

        </Modal>

        {/* 审核详情 */}
        <Modal
          title="审核详情"
          visible={visibleDetail}
          onOk={this.hideModalDetail}
          width={660}
          onCancel={this.hideModalDetail}
        >
          <div className={styles.table_box}>
            <FormControl.Wrapper ref={(el) => { this.myForm = el; }} value={tableFormData}>
              <Table
                rowKey="id"
                columns={defaultColumnsDetail}
                dataSource={tableDataDetail.formData}
                pagination={false}
              />
            </FormControl.Wrapper>
          </div>

        </Modal>


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
          onOk={(data) => { this.changeClassItem(data); }}
        />
      </div>
      /** Layout-admin:End */
    );
  }
}

export default goodsList;
