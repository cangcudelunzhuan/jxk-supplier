import React from 'react';
import { Row, Form, Button, Col } from 'antd';
import { BoxTitle, Paginator, FormControl } from '@jxkang/web-cmpt';
import { Common } from '@jxkang/utils';
import utils, { getFileUrl } from '@/utils';
import Model from '@/model';
import styles from './index.module.styl';


@Form.create()
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormData: {},
      pageListColumns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: '商品图片',
          dataIndex: 'skuImg',
          key: 'skuImg',
          render(item) {
            return <img style={{ width: '56px', height: '56px', borderRadius: '4px' }} src={getFileUrl(item)} alt="" />;
          },
        }, {
          title: '商品名称',
          sorter: true,
          dataIndex: 'itemName',
          key: 'itemName',
        }, {
          title: '规格',
          dataIndex: 'propsValue',
          key: 'propsValue',
          render(item) {
            return (
              <div>
                <span>属性：</span>
                {/* <span>{(item || []).join('/')}</span> */}
                <span>{item}</span>
              </div>
            );
          },
        }, {
          title: '业务关联单号',
          dataIndex: 'bizId',
          key: 'bizId',
        }, {
          title: '库存信息',
          render(item) {
            return (
              <div>
                <div>
                  数量：
                  <span>{item.financeType < 0 ? -(item.operationQty) : item.operationQty}</span>
                </div>
                <div>
                  剩余：
                  <span>{item.stockQty}</span>
                </div>
              </div>
            );
          },
        }, {
          title: '操作类型',
          render: (item) => (
            <div className="page-list-handler">
              <div>{item.operationType ? item.operationType.message : ''}</div>
            </div>
          ),
        }, {
          title: '操作信息',
          render: (item) => (
            <div className="page-list-handler">
              <div>{item.operation}</div>
              <div>{utils.timeStampTurnTimeDetail(item.operationDate)}</div>
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {

  }

  dateOnChange = () => {

  }

  handleChange = () => {

  }

  onSearchList = () => {
    const { searchFormData } = this.state;
    const params = Common.clone(searchFormData);
    console.log(searchFormData);
    if (params.dateTime && params.dateTime.length) {
      const df = 'yyyy-mm-dd hh:ii:ss';
      params.operationDateStart = Common.dateFormat(params.dateTime[0].valueOf(), df);
      params.operationDateEnd = Common.dateFormat(params.dateTime[1].valueOf(), df);
      delete params.dateTime;
    } else {
      params.operationDateStart = '';
      params.operationDateEnd = '';
    }
    this.fetchGrid.fetch(params);
  }

  render() {
    const { pageListColumns, searchFormData } = this.state;
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner}>
        <div className={`pagination-page ${styles.content}`}>
          <section className={styles.form_box}>
            <FormControl.Wrapper value={searchFormData}>
              <div className={styles.field_box}>
                <Row type="flex" align="middle">
                  <Col><div className={styles.field}>商品搜索：</div></Col>
                  <Col style={{ marginRight: '20px' }}>
                    <FormControl type="text" name="goodsName" placeholder="商品名称/商品货号" width={200} />
                  </Col>
                  <Col><div className={styles.field}>操作类型：</div></Col>
                  <Col style={{ marginRight: '20px' }}>
                    <FormControl type="select"
                      name="operationType"
                      placeholder="选择操作类型"
                      dataSource={[
                        { label: '全部', value: '' },
                        { label: '库存调整', value: 'ADJUST_QTY' },
                        { label: '冻结', value: 'FROZEN_QTY' },
                        { label: '解冻', value: 'UNFREEZE_QTY' },
                        { label: '销售', value: 'SALES_QTY' },
                        { label: '划拨', value: 'TRANSFER_QTY' },
                        { label: '渠道销售', value: 'CHANNEL_SALES_QTY' },
                      ]}
                      width={200}
                    />
                  </Col>

                  <Col><div className={styles.field}>操作时间：</div></Col>
                  <Col>
                    <FormControl type="date-range" showTime name="dateTime" style={{ width: 380 }} />
                    <Button type="primary" className="ml10" onClick={this.onSearchList}>搜索</Button>
                  </Col>
                </Row>
                {/* <Row type="flex" align="middle" className="mb30 mt25">

            </Row> */}
              </div>
            </FormControl.Wrapper>
          </section>

          <div className={styles.title_box}>
            <BoxTitle
              title="数据列表"
              className={styles.box_title}
              titleTop={5}
            />
          </div>
          <Paginator
            url={Model.goods.getWarehouseFlowListByParam}
            columns={pageListColumns}
            scope={(el) => this.fetchGrid = el}
          />
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default OrderList;
