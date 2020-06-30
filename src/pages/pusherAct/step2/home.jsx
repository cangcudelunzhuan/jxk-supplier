import React from 'react';

import { Card, Form, Select, Row, Input, Button, Table, Modal, Switch, InputNumber, message } from 'antd';
import Events from '@jxkang/events';
import { renderField } from '@/utils/formConfig.js';
// import ActAward from '../components/actAward/index';
import { formatPoint } from '@/utils/filter';
import Model from '@/model';
import { getSKUList } from '@/utils/tools';
import regExp from '@/utils/regExp';
import styles from './index.module.styl';
import Step from '../components/Step/index';

@Form.create()
@Events
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      leastNumber: 1,
      addAwardLIst: [
      ],
      isCanAdd: true,
      visiblePop: false,
      originalPrice: 0,
      itemName: '',
      stockQty: 0,
      openRecord: {},
      visibleModal: false,
      // loading: false,
      dataSource: [
      ],
      skuList: [
      ],
      columns: [
        {
          title: '参与人数≥',
          dataIndex: 'number',
          width: 150,
          render: (text, record) => {
            const { getFieldDecorator } = this.props.form;
            return (
              <div className={styles.tableInput}>
                {renderField(getFieldDecorator, '', `number${record.id}`,
                  <InputNumber
                    min={this.state.leastNumber}
                    formatter={(value) => `${value}`}
                    parser={(value) => value.replace('.', '')}
                    onChange={(e) => this.tableChange(record, e, 'number')}
                    disabled={this.state.verified}
                  />,
                  {
                    rules: [
                      { required: true, ...regExp.NUmber },
                      {
                        validator: (r, v, c) => this.validFunction(r, v, c, record.id),
                      },
                    ],
                  }
                )}
              </div>
            );
          },
        },
        {
          title: '原价',
          dataIndex: 'originalPrice',
        },
        {
          title: '折扣价',
          dataIndex: 'discount',
          width: 150,
          render: (text, record) => {
            const { getFieldDecorator } = this.props.form;
            return (
              <div className={styles.tableInput}>
                {renderField(getFieldDecorator, '', `discount${record.id}`,
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace('%', '')}
                    onChange={(e) => this.tableChange(record, e, 'discount')}
                    disabled={this.state.verified}
                  />, { rules: [{ required: true, ...regExp.ratioNumber }] }
                )}
              </div>
            );
          },
        },
        {
          title: '实际价格',
          dataIndex: 'discountPrice',
        },
        {
          title: '操作',
          dataIndex: '',
          key: '',
          render: (text, record) => {
            return (
              <div>
                <span className={styles.table_btn} onClick={() => this.openModal(record)}>查看各规格价格</span>
                <span className={styles.table_btn} onClick={() => this.deleteDiscount(record)}>删除</span>
              </div>
            );
          },
        },
      ],

      columns2: [
        {
          title: 'SKU编号',
          dataIndex: 'skuId',
          width: 100,
        },
        {
          title: 'vip价格',
          dataIndex: 'vipTradePrice',
        },
        {
          title: '建议零售价',
          dataIndex: 'retailPrice',
        },
        {
          title: '商品库存',
          dataIndex: 'stockQty',
        },
        {
          title: '库存预警值',
          dataIndex: 'stockQtyWarn',
        },
        {
          title: '参与活动',
          dataIndex: 'isAct',
          render: (text, record) => {
            return (
              <Switch defaultChecked={text} disabled={this.state.verified} checked={text} onChange={(e) => this.onSwChange(e, record)} />
            );
          },
        },
      ],
    };
  }

  validFunction = (rule, value, callback, id) => {
    if (id !== 1) {
      const valuePre = Number(this.props.form.getFieldValue(`number${id - 1}`));
      if (valuePre >= value) {
        callback('必须大于上一个阶梯'); // 校验未通过
      }
    }
    callback(); // 校验通过
  }


  onSwChange = (v, record) => {
    const { skuList } = this.state;
    const i = skuList.findIndex((r) => r.index === record.index);
    skuList[i].isAct = v;
    this.setState({
      skuList,
    });
  }

  // 查看规格
  openModal = async (record) => {
    if (!record.discount) {
      message.error('请先填写折扣');
      return;
    }
    const { columns2 } = this.state;
    const itemId = this.props.form.getFieldValue('itemId');
    if (itemId) {
      const res = await Model.marketing.getItemSkuList({ itemId });
      if (res && res.skuList) {
        // const specs = res.specs || [];
        const skuList = res.skuList || [];
        const specs = skuList[0].propsValue;
        const { list, col } = getSKUList(skuList, columns2, specs, itemId);
        // record.stepPriceSkus.map((item) => {
        //   list.map((it) => {
        //     if (item.skuId === it.skuId) {
        //       it.isAct = true;
        //     }
        //     return '';
        //   });
        //   return '';
        // });
        list.map((item) => {
          const i = record.stepPriceSkus.findIndex((r) => `${r.skuId}` === `${item.skuId}`);
          item.isAct = (i >= 0);
          return '';
        });
        list.map((item) => {
          // eslint-disable-next-line no-mixed-operators
          item.vipTradePrice = formatPoint(parseFloat(item.vipTradePrice) * parseFloat(record.discount) / 100);
          return '';
        });
        this.setState({
          visibleModal: true,
          openRecord: record,
          skuList: list,
          columns2: col,
        });
        this.props.form.setFieldsValue({
          openRecordDiscount: record.discount,
        });
      } else {
        message.error('此商品尚无规格数据');
      }
    }
  }


  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  }

  tableChange = (record, value, key) => {
    const { dataSource } = this.state;
    dataSource.map((item) => {
      if (item.id === record.id) {
        item[key] = value;
        if (key === 'discount') {
          // eslint-disable-next-line no-mixed-operators
          item.discountPrice = formatPoint(parseFloat(this.state.originalPrice) * parseFloat(value || 0) / 100);
        }
      }
      return dataSource;
    });
    this.setState({
      dataSource,
    });
  }

  // 规格弹出的输入框变动
  openDiscountChange = async (e) => {
    const value = e || 0;
    if (value) {
      const { columns2, openRecord } = this.state;
      const itemId = this.props.form.getFieldValue('itemId');
      // const openRecordDiscount = this.props.form.getFieldValue('openRecordDiscount');
      if (itemId) {
        const res = await Model.marketing.getItemSkuList({ itemId });
        if (res && res.skuList) {
          const skuList = res.skuList || [];
          const specs = skuList[0].propsValue;
          const { list, col } = getSKUList(skuList, columns2, specs, itemId);
          (openRecord.stepPriceSkus || []).map((item) => {
            list.map((it) => {
              if (item.skuId === it.skuId) {
                it.isAct = true;
              }
              return '';
            });
            return '';
          });
          list.map((item) => {
            // eslint-disable-next-line no-mixed-operators
            item.vipTradePrice = formatPoint(parseFloat(item.vipTradePrice) * parseFloat(value) / 100);
            return '';
          });
          this.setState({
            skuList: list,
            columns2: col,
          });
        }
      }
    }
  }

  goPrev = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/pusherAct/step1/${id}`);
  }

  goNext = () => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.setAction();
      }
    });
  }

  goNext2 = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/pusherAct/step3/${id}`);
  }

  setAction = async () => {
    const { addAwardLIst, dataSource } = this.state;
    const { id } = this.props.match.params;
    const itemId = this.props.form.getFieldValue('itemId');
    const otherRewards = [];
    let flag = true;
    addAwardLIst.map((item) => {
      const values = this[`EditFormitem${item.id}`].getFormData();
      if (values) {
        otherRewards.push(values);
      } else {
        flag = false;
      }
      return flag;
    });
    if (flag === false) {
      return;
    }
    const productRes = await Model.marketing.getItemPriceAndStockQty({ itemId });
    if (productRes) {
      const params = {
        activityId: id,
        itemId,
        baseReward: 0,
        otherRewards,
        stepPrices: dataSource,
        itemName: productRes.itemName,
      };
      const res = await Model.marketing.inActSetRecruitDetail(params);
      if (res) {
        this.props.history.push(`/pusherAct/step3/${id}`);
      }
    } else {
      message.error('商品不存在，请重新选择');
    }
  }

  addDiscount = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        const { dataSource } = this.state;
        if (dataSource.length > 4) {
          message.error('最多可添加5条>_<');
          return;
        }
        this.getAddHotLIst();
      }
    });
  }

  getAddHotLIst = async () => {
    const itemId = this.props.form.getFieldValue('itemId');
    const res = await Model.marketing.getItemSkuList({ itemId });
    const { dataSource, originalPrice, leastNumber, columns2 } = this.state;
    let stepPriceSkus = [];
    if (res && res.skuList) {
      const skuList = res.skuList || [];
      const specs = skuList[0].propsValue;
      const { list } = getSKUList(skuList, columns2, specs, itemId);
      list.map((item) => item.originalPrice = item.vipTradePrice);
      stepPriceSkus = list;
    }
    dataSource.push({
      number: leastNumber,
      originalPrice,
      discount: '',
      discountPrice: '',
      stepPriceSkus,
      id: dataSource.length + 1,
    });
    this.setState({
      dataSource,
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({
        [`number${dataSource.length}`]: leastNumber,
      });
    }, 0);
  }

  deleteDiscount = (record) => {
    const { dataSource } = this.state;
    const i = dataSource.findIndex((fruit) => fruit.id === record.id);
    dataSource.splice(i, 1);
    this.setState({
      dataSource,
    });
  }

  addAward = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        const { addAwardLIst } = this.state;
        addAwardLIst.push(
          {
            id: new Date().getTime(),
            rewardName: '',
            type: 0,
            conditionType: '',
            otherRewardDetails: [
              {
                conditionValueStart: '',
                conditionValueEnd: '',
                rewardContent: '',
                photos: [],
              },
            ],
          },
        );
        this.setState({
          addAwardLIst,
        });
      }
    });
  }

  deleteAward = (id) => {
    const { addAwardLIst } = this.state;
    const i = addAwardLIst.findIndex((r) => r.id === id);
    addAwardLIst.splice(i, 1);
    this.setState({
      addAwardLIst,
    });
  }


  checkedChange = (type, id) => {
    const { addAwardLIst } = this.state;
    addAwardLIst.map((item) => {
      if (id === item.id) {
        item.status = type === 'add';
      }
      return addAwardLIst;
    });
  }

  getDetail = async (id) => {
    const res = await Model.marketing.inRecruitDetail({ activityId: id });
    if (res) {
      let price = 0;
      if (res.itemId) {
        const itemRes = await Model.marketing.getItemPriceAndStockQty({ itemId: res.itemId });
        if (itemRes) {
          price = itemRes.price;
          if (itemRes) {
            this.setState({
              itemName: itemRes.itemName,
              originalPrice: price,
              stockQty: itemRes.stockQty,
              itemId: itemRes.itemId,
              visiblePop: true,
              isCanAdd: true,
            });
          }
        }
      }
      const list = res.otherRewards || [];
      list.map((item) => {
        // item.status = item.status !== false;
        item.id = item.rewardOptionId;
        return list;
      });
      const stepPrices = res.stepPrices || []; // 人数及价格的表格
      const number = {}; // 人数价格表的number字段集合
      const discount = {}; // 折扣集合
      stepPrices.map((item, i) => {
        item.id = i + 1;
        number[`number${i + 1}`] = item.number;
        discount[`discount${i + 1}`] = item.discount;
        item.originalPrice = item.originalPrice || price;
        return stepPrices;
      });
      this.setState({
        dataSource: stepPrices,
        addAwardLIst: list,
        leastNumber: res.leastNumber,
        verified: res.verified,
      });
      this.props.form.setFieldsValue({
        itemId: res.itemId || '',
        baseReward: 0,
        ...number,
        ...discount,
      });
    }
  }

  getPrice = (v) => {
    const { value } = v.target;
    this.setState({
      dataSource: [],
      addAwardLIst: [],
    });
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.stockQty(value);
      }
    });
  }

  stockQty = async (value) => {
    // const itemId = this.props.form.getFieldValue('itemId');
    if (!value) {
      return;
    }
    const res = await Model.marketing.getItemPriceAndStockQty({ itemId: value });
    if (res) {
      const { dataSource } = this.state;
      dataSource.map((item) => item.originalPrice = res.price || 0);
      this.setState({
        itemName: res.itemName,
        originalPrice: res.price || 0,
        stockQty: res.stockQty,
        itemId: res.itemId,
        visiblePop: true,
        dataSource,
        isCanAdd: true,
      });
      this.props.form.setFieldsValue({
        ItemId: res.ItemId,
      });
    } else {
      this.setState({
        visiblePop: false,
        dataSource: [],
        addAwardLIst: [],
        itemName: '',
        originalPrice: 0,
        stockQty: 0,
        itemId: '',
        isCanAdd: false,
      });
    }
  }

  // 弹出确认按钮
  handleOk = () => {
    const { openRecord, dataSource, skuList } = this.state;
    const inputV = this.props.form.getFieldValue('openRecordDiscount');
    const i = dataSource.findIndex((r) => r.id === openRecord.id);
    const stepPriceSkus = [];
    // eslint-disable-next-line no-mixed-operators
    let discountPrice = formatPoint(parseFloat(openRecord.originalPrice) * parseFloat(inputV) / 100);
    skuList.map((item) => {
      if (item.isAct === true) {
        stepPriceSkus.push({
          skuId: item.skuId,
          // eslint-disable-next-line no-mixed-operators
          originalPrice: formatPoint(item.vipTradePrice / parseFloat(inputV) * 100),
        });
        if (item.vipTradePrice < discountPrice) {
          discountPrice = item.vipTradePrice;
        }
      }
      return stepPriceSkus;
    });
    dataSource[i].stepPriceSkus = stepPriceSkus;
    dataSource[i].discount = inputV;
    dataSource[i].discountPrice = discountPrice;
    // vipTradePrice
    this.setState({
      visibleModal: false,
      dataSource,
    });
    this.props.form.setFieldsValue({
      [`discount${openRecord.id}`]: inputV,
    });
    // this.tableChange(openRecord, inputV, 'discount');
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.getDetail(id);
      // setTimeout(() => {
      //   this.getPrice();
      // }, 100);
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource, columns,
      // addAwardLIst,
      columns2,
      skuList,
      itemName,
      stockQty,
      // originalPrice,
      itemId,
      visiblePop,
      isCanAdd,
      verified,
    } = this.state;
    const content = (
      <div>
        商品ID：
        {itemId}
        <br />
        商品名称：
        {itemName}
        <br />
        商品总数库存量：
        {stockQty}
      </div>
    );
    const formItemLayout12 = {
      labelCol: { span: 9 },
      wrapperCol: { span: 8 },
    };
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner}>
        <Step current={1} />
        <div className={`main-content pagination-page ${styles.content}`}>
          <div className={styles.card_box}>
            <Form {...formItemLayout12} onSubmit={this.sub} colon={false} labelAlign="left">
              <Card title="选择商品" bordered={false}>
                <div className={styles.id_box}>
                  <Row gutter={8} className={styles.has_Popover_content}>
                    {renderField(getFieldDecorator, '设置本次参与活动的商品ID：', 'itemId',
                      <Input
                        // onBlur={this.getPrice}
                        onChange={this.getPrice}
                        disabled={verified}
                      />, { rules: [{ required: true, ...regExp.NUmber }] }
                    )}
                    <div className={styles.props_box}>
                      <div className={`${styles.contents_box}  ${visiblePop === true ? styles.active : null}`}>
                        {content}
                      </div>
                    </div>
                  </Row>
                </div>
              </Card>
              <Card title="活动力度" bordered={false}>

                <Row gutter={8} style={{ marginBottom: '20px' }}>
                  {renderField(getFieldDecorator, '基础奖励：', 'baseReward',
                    <Select onChange={this.handleChange} disabled={verified}>
                      <Select.Option value={0}>阶梯价</Select.Option>
                    </Select>
                  )}
                </Row>
                <Table dataSource={dataSource}
                  rowKey="id"
                  columns={columns}
                  pagination={false}
                />
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  {verified === false && (
                    <Button type="primary" onClick={this.addDiscount} ghost disabled={!isCanAdd}>
                      新增一行
                    </Button>
                  )}
                </div>
                {/* 额外奖励 */}
                {/* {addAwardLIst.map((item) => {
                  return (
                    <ActAward data={item}
                      key={item.id}
                      checkedChange={this.checkedChange}
                      verified={verified}
                      delete={() => { this.deleteAward(item.id); }}
                      onRef={(r) => this[`EditFormitem${item.id}`] = r}
                    />
                  );
                })}
                <div className={styles.add_extra}>
                  {verified === false && (
                    <Button type="primary" onClick={this.addAward} disabled={!isCanAdd}>
                      新增活动奖励
                    </Button>
                  )}
                </div> */}
              </Card>

              <Modal
                title="编辑库存/售价信息"
                width="900px"
                visible={this.state.visibleModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                zIndex={10000}
              >
                <div className={styles.modal_top}>
                  <span>商品货号SPU：No999999</span>
                  <span className={styles.modal_top_right}>
                    <p>折扣</p>
                    {renderField(getFieldDecorator, '', 'openRecordDiscount',
                      <InputNumber
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace('%', '')}
                        // onBlur={this.openDiscountChange}
                        onChange={this.openDiscountChange}
                        disabled={verified}
                      />
                    )}
                  </span>
                </div>
                <Table dataSource={skuList}
                  rowKey="skuId"
                  columns={columns2}
                  pagination={false}
                />
              </Modal>
            </Form>
          </div>
          <div className={styles.step_btn}>
            <Button type="primary" onClick={this.goPrev} ghost>
              上一步，设置活动时间
            </Button>
            {/* 未通过 */}
            {verified === false && (
              <Button type="primary" onClick={this.goNext}>
                下一步，添加商品素材
              </Button>
            )}
            {/* 通过 */}
            {verified === true && (
              <Button type="primary" onClick={this.goNext2}>
                查看商品素材
              </Button>
            )}
          </div>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default OrderList;
