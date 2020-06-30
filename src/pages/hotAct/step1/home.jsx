import React from 'react';
import { Card, Form, Row, Input, Button, Table, DatePicker, InputNumber, Switch, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { renderFieldAllLine } from '@/utils/formConfig.js';
import { formatDateTime } from '@/utils/filter';
import Step from '../components/Step/index';
import styles from './index.module.styl';
import { getSKUList } from '@/utils/tools';
import Model from '@/model';

const { RangePicker } = DatePicker;

@Form.create()
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      stockQty: 0,
      itemId: '',
      visiblePop: false,
      verified: false,
      // nextAble: true,
      skuList: [
      ],
      columns: [
        {
          title: '市场价',
          dataIndex: 'scribingPrice',
          width: 150,
          render: (text) => {
            return `￥ ${text}`;
          },
        },
        {
          title: '建议零售价',
          dataIndex: 'retailPrice',
          width: 150,
          render: (text) => {
            return `￥ ${text}`;
          },
        },
        {
          title: '普通买家价',
          dataIndex: 'tradePrice',
          width: 150,
          render: (text, record) => {
            return (
              <InputNumber
                min={0}
                formatter={(value) => `￥${value}`}
                parser={(value) => value.replace('￥', '')}
                onChange={(e) => this.tableChange(record, e, 'tradePrice')}
                value={text}
                defaultValue={text}
                disabled={this.state.verified}
              />
            );
          },
        },
        {
          title: '超级卖家价',
          dataIndex: 'vipTradePrice',
          width: 150,
          render: (text, record) => {
            return (
              <InputNumber
                min={0}
                formatter={(value) => `￥${value}`}
                parser={(value) => value.replace('￥', '')}
                onChange={(e) => this.tableChange(record, e, 'vipTradePrice')}
                value={text}
                defaultValue={text}
                disabled={this.state.verified}
              />
            );
          },
        },
        {
          title: '活动库存',
          dataIndex: 'stockQty',
          width: 150,
          render: (text, record) => {
            return (
              <InputNumber
                min={0}
                max={this.state.verified ? text : record.maxStockQty}
                formatter={(value) => `${value}`}
                parser={(value) => value.replace('.', '')}
                onChange={(e) => this.tableChange(record, e, 'stockQty')}
                defaultValue={text}
                value={text}
                disabled={this.state.verified}
              />
            );
          },
        },
        {
          title: '是否参加',
          dataIndex: 'isAct',
          width: 80,
          // fixed: 'right',
          render: (text, record) => {
            return (
              <Switch defaultChecked={text} checked={text} disabled={this.state.verified} onChange={(e) => this.onSwChange(e, record)} />
            );
          },
        },
      ],
      columnsNew: [],
    };
  }

  onSwChange = (v, record) => {
    const { skuList } = this.state;
    const i = skuList.findIndex((r) => r.skuId === record.skuId);
    skuList[i].isAct = v;
    this.setState({
      skuList,
    });
  }

  // 删除活动力度
  toCancel = (record) => {
    const { skuList } = this.state;
    const i = skuList.findIndex((r) => r.index === record.index);
    skuList.splice(i, 1);
    this.setState({
      skuList,
    });
  }

  tableChange = (record, e, key) => {
    const value = e;
    const { skuList } = this.state;
    skuList.map((item) => {
      if (item.index === record.index) {
        item[key] = value;
      }
      return '';
    });
    this.setState({
      skuList,
    });
  }

  goNext = () => {
    this.sub();
  }

  goNext2 = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/hotAct/step2/${id}`);
  }


  // 获取sku集
  SkuLIst = async (itemId) => {
    const res = await Model.marketing.getItemSkuList({ itemId });
    const { columns } = this.state;
    if (res && res.skuList) {
      // const specs = res.specs;
      const skuList = res.skuList;
      const specs = skuList[0].propsValue || [];
      const { list, col } = getSKUList(skuList, columns, specs, itemId);
      list.map((item) => item.maxStockQty = item.stockQty);
      this.setState({
        skuList: list,
        columnsNew: col,
        // nextAble: false,
      });
    } else {
      this.setState({
        skuList: [],
        columnsNew: columns,
      });
    }
  }

  dateOnChange = (m, d, key) => {
    if (key === 'date1') {
      this.props.form.setFieldsValue({
        date2: [],
      });
    }
  }

  sub = () => {
    // e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = this.props.match.params;
        if (id && id !== 'add') {
          values.activityId = id;
        }
        values.preheatTimeBegin = moment(values.date1[0]).valueOf();
        values.preheatTimeEnd = moment(values.date1[1]).valueOf();
        values.timeBegin = moment(values.date2[0]).valueOf();
        values.timeEnd = moment(values.date2[1]).valueOf();
        if (values.timeBegin - values.preheatTimeEnd < 0) {
          message.error('销售时间不可早于预热结束时间');
          return;
        }
        this.getId(values);
      }
    });
  }

  getId = async (values) => {
    const { skuList } = this.state;
    if (skuList.length <= 0) {
      message.error('找不到此商品，请重新选择');
      return;
    }
    const hotItemSkus = skuList.filter((r) => r.isAct === true);
    values.hotItemSkus = hotItemSkus;
    const res = await Model.marketing.inActivityHot(values);
    if (res) {
      const { id } = this.props.match.params;
      if (id !== 'add') {
        // 详情
        this.props.history.push(`/hotAct/step2/${id}`);
        // this.getDetail(id);
      } else {
        // 新增
        this.props.history.push(`/hotAct/step2/${res}`);
      }
    }
  }

  getDetail = async (id) => {
    const res = await Model.marketing.inHotDetail({ activityId: id });
    const { columns } = this.state;
    if (res) {
      const itemRes = await Model.marketing.getItemPriceAndStockQty({ itemId: res.itemId });
      if (itemRes) {
        if (itemRes) {
          this.setState({
            itemName: itemRes.itemName,
            stockQty: itemRes.stockQty,
            itemId: itemRes.itemId,
            visiblePop: true,
          });
        }
      }
      this.props.form.setFieldsValue({
        date2: [moment(formatDateTime(res.timeBegin), 'YYYY-MM-DD HH:mm') || '', moment(formatDateTime(res.timeEnd), 'YYYY-MM-DD HH:mm') || ''],
        date1: [moment(formatDateTime(res.preheatTimeBegin), 'YYYY-MM-DD HH:mm') || '', moment(formatDateTime(res.preheatTimeEnd), 'YYYY-MM-DD HH:mm') || ''],
        itemId: res.itemId,
      });
      const reslist = res.hotItemSkus;
      // const { skuList } = this.state;
      const skuRes = await Model.marketing.getItemSkuList({ itemId: res.itemId });
      if (!skuRes || !skuRes.skuList) {
        return;
      }
      // const specs = skuRes.specs;
      const skuList = skuRes.skuList || [];
      const specs = skuList[0].propsValue || [];
      const { list, col } = getSKUList(skuList, columns, specs);
      list.map((sku) => {
        reslist.map((li) => {
          if (`${sku.skuId}` === `${li.skuId}`) {
            sku.isAct = true;
            sku.tradePrice = li.tradePrice;
            sku.vipTradePrice = li.vipTradePrice;
            sku.maxStockQty = sku.stockQty;
            sku.stockQty = li.stockQty;
            const item = {
              ...sku,
            };
            sku = item;
          } else {
            sku.maxStockQty = sku.stockQty;
            sku.isAct = false;
          }
          return reslist;
        });
        return list;
      });
      this.setState({
        skuList: list,
        // nextAble: false,
        columnsNew: col,
        verified: res.verified,
      });
    } else {
      this.setState({
        columnsNew: columns,
      });
    }
  }

  getPrice = async (e) => {
    const { value } = e.target;
    if (value) {
      const res = await Model.marketing.getItemPriceAndStockQty({ itemId: value });
      if (res) {
        this.setState({
          itemName: res.itemName,
          stockQty: res.stockQty,
          itemId: res.itemId,
          visiblePop: true,
          // nextAble: false,
        });
        this.SkuLIst(res.itemId);
      } else {
        this.setState({
          visiblePop: false,
          skuList: [],
        });
      }
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id && id !== 'add') {
      this.getDetail(id);
    }
  }

  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { skuList, columnsNew,
      // nextAble,
      itemName,
      itemId,
      stockQty,
      visiblePop,
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
    const disabledDate = (current) => {
      return current < moment(moment().format('YYYY/MM/DD'));
    };
    const disabledDate2 = (current) => {
      const date1 = this.props.form.getFieldValue('date1');
      if (date1 && date1[1]) {
        return current < moment(moment(date1[1]).format('YYYY/MM/DD'));
      }
      return disabledDate(current);
    };
    const disabledTime2 = (current, type) => {
      const date1 = this.props.form.getFieldValue('date1');
      if (current && type === 'start' && date1 && moment(date1[1]).format('YYYY/MM/DD') === moment(current[0]).format('YYYY/MM/DD')) {
        const h = moment(date1[1]).format('HH');
        const m = moment(date1[1]).format('mm');
        const s = moment(date1[1]).format('ss');
        const thish = moment(current[0]).format('HH');
        const thism = moment(current[0]).format('mm');
        const H = new Array(24).keys();
        const M = new Array(60).keys();
        const S = new Array(60).keys();
        const hlist = Array.from(H).filter((item) => Number(item) < h);
        const mlist = thish === h ? Array.from(M).filter((item) => Number(item) < m) : [];
        const slist = ((thish === h) && (thism === m)) ? Array.from(S).filter((item) => Number(item) < s) : [];
        return {
          disabledHours: () => hlist,
          disabledMinutes: () => mlist,
          disabledSeconds: () => slist,
        };
      }
      return '';
    };
    const formItemLayout12 = {
      labelCol: { span: 5 },
      wrapperCol: { span: 8 },
    };
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner}>
        <Step current={0} />
        <div className={`main-content pagination-page ${styles.content}`}>
          <div className={styles.card_box}>
            <Form {...formItemLayout12} onSubmit={this.sub} labelAlign="left">
              <Card title="设置时间1" bordered={false}>
                <Row gutter={8}>
                  {renderFieldAllLine(getFieldDecorator, '活动预热时间：', 'date1',
                    <RangePicker onChange={(m, d) => this.dateOnChange(m, d, 'date1')}
                      showTime={{ format: 'HH:mm:ss' }}
                      placeholder="请选择"
                      locale={locale}
                      style={{ width: '100%' }}
                      disabledDate={disabledDate}
                      disabled={verified}
                    />, { rules: [{ required: true, message: '必填' }] }
                  )}
                </Row>
                <Row gutter={8}>
                  {renderFieldAllLine(getFieldDecorator, '活动销售时间：', 'date2',
                    <RangePicker onChange={(m, d) => this.dateOnChange(m, d, 'date2')}
                      showTime={{ format: 'HH:mm:ss' }}
                      placeholder="请选择"
                      locale={locale}
                      disabledDate={disabledDate2}
                      disabledTime={disabledTime2}
                      style={{ width: '100%' }}
                      disabled={verified}
                    />, { rules: [{ required: true, message: '必填' }] }
                  )}
                </Row>
              </Card>
              <Card title="设置商品ID" bordered={false}>
                <div className={styles.id_box}>
                  <Row gutter={8} className={styles.has_Popover_content}>
                    {renderFieldAllLine(getFieldDecorator, '设置本次参与活动的商品ID：', 'itemId',
                      <Input
                        // onBlur={this.getPrice}
                        onChange={this.getPrice}
                        disabled={verified}
                      />,
                      { rules: [{ required: true, message: '必填' }] }
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
                <Table dataSource={skuList}
                  // scroll={{ x: '830px' }}
                  rowKey="skuId"
                  columns={columnsNew}
                  pagination={false}
                />
              </Card>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {/* 未通过审核可编辑 */}
                {verified === false && (
                  <Button type="primary"
                    onClick={this.goNext}
                  >
                    下一步，添加商品素材
                  </Button>
                )}
                {/* 通过审核不可编辑 */}
                {verified === true && (
                  <Button type="primary"
                    onClick={this.goNext2}
                  >
                    查看商品素材
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default OrderList;
