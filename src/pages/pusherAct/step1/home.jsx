import React from 'react';

import { Form, Row, Input, Button, DatePicker, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Events from '@jxkang/events';
import { formatDateTime } from '@/utils/filter';
import regExp from '@/utils/regExp';
import { renderFieldAllLine } from '@/utils/formConfig.js';
import Step from '../components/Step/index';
import styles from './index.module.styl';
import Model from '@/model';

const formItemLayout12 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 6 },
};
const { RangePicker } = DatePicker;

@Form.create()
@Events
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: '',
      verified: false,
    };
  }


  componentDidMount() {
    const { id } = this.props.match.params;
    if (id && id !== 'add') {
      this.getDetail(id);
    }
  }

  getDetail = async (id) => {
    const res = await Model.marketing.inRecruitDetail({ activityId: id });
    if (res) {
      this.props.form.setFieldsValue({
        date1: [moment(formatDateTime(res.recruitTimeBegin), 'YYYY-MM-DD HH:mm') || '', moment(formatDateTime(res.recruitTimeEnd), 'YYYY-MM-DD HH:mm') || ''],
        date2: [moment(formatDateTime(res.timeBegin), 'YYYY-MM-DD HH:mm') || '', moment(formatDateTime(res.timeEnd), 'YYYY-MM-DD HH:mm') || ''],
        leastNumber: res.leastNumber,
      });
      this.setState({
        verified: res.verified,
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

  goNext = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = this.props.match.params;
        if (id && id !== 'add') {
          values.activityId = id;
        }
        values.recruitTimeBegin = moment(values.date1[0]).valueOf();
        values.recruitTimeEnd = moment(values.date1[1]).valueOf();
        values.timeBegin = moment(values.date2[0]).valueOf();
        values.timeEnd = moment(values.date2[1]).valueOf();
        if (values.timeBegin - values.recruitTimeEnd < 0) {
          message.error('销售时间不可早于招募结束时间');
          return;
        }
        this.getId(values);
      }
    });
  }

  getId = (values) => {
    Model.marketing.inActRecruit(values).then((res) => {
      if (res) {
        const { id } = this.props.match.params;
        if (id !== 'add') {
          this.props.history.push(`/pusherAct/step2/${id}`);
        } else {
          this.props.history.push(`/pusherAct/step2/${res}`);
        }
      }
    });
  }

  goNext2 = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/pusherAct/step2/${id}`);
  }

  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { size, verified } = this.state;
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
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner}>
        <Step current={0} />
        <div className={`main-content pagination-page ${styles.content}`}>
          <Form {...formItemLayout12} style={{ padding: '70px 30%' }}>
            <Row gutter={16} className={styles.step1_row}>
              {renderFieldAllLine(getFieldDecorator, '活动招募时间：', 'date1',
                <RangePicker onChange={(m, d) => this.dateOnChange(m, d, 'date1')}
                  showTime={{ format: 'HH:mm:ss' }}
                  placeholder="请选择"
                  locale={locale}
                  style={{ width: '300px' }}
                  size={size}
                  disabledDate={disabledDate}
                  disabled={verified}
                />, { rules: [{ required: true, message: '必填' }] }
              )}
            </Row>
            <Row gutter={16} className={styles.step1_row}>
              {renderFieldAllLine(getFieldDecorator, '活动销售时间：', 'date2',
                <RangePicker onChange={(m, d) => this.dateOnChange(m, d, 'date2')}
                  showTime={{ format: 'HH:mm:ss' }}
                  placeholder="请选择"
                  locale={locale}
                  size={size}
                  disabledDate={disabledDate2}
                  disabledTime={disabledTime2}
                  style={{ width: '300px' }}
                  disabled={verified}
                />,
                {
                  rules: [
                    { required: true, message: '必填' },
                  ],
                }
              )}
            </Row>
            <Row gutter={16} className={styles.step1_row}>
              {renderFieldAllLine(getFieldDecorator, '最低参与人数：', 'leastNumber',
                <Input size={size} style={{ width: '300px' }} disabled={verified} />,
                {
                  rules: [
                    { required: true, ...regExp.number },
                  ],
                }
              )}
            </Row>
          </Form>
          <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #f0f2f5', paddingTop: '30px' }}>
            {/* 未通过 */}
            {verified === false && (
              <Button type="primary" onClick={(e) => this.goNext(e)}>
                下一步，添加商品素材
              </Button>
            )}
            {/* 通过 */}
            {verified === true && (
              <Button type="primary" onClick={this.goNext2}>
                查看下一步
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
