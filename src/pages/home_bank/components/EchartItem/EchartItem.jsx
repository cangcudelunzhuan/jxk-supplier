import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.module.styl';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
class EchartItem extends Component {
  constructor(props) {
    super(props);
    // this.props.onRef(this);
    this.state = {
      active: 1,
    };
  }

  getOption = () => {
    const initOPtion = {
      smooth: false,
    };
    const propsOption = this.props.propsOption || initOPtion;
    const option = {
      title: {
        text: '',
        x: 'left',
        // show: false
        textStyle: {
          // 文字颜色
          color: '#ccc',
          // 字体风格,'normal','italic','oblique'
          fontStyle: 'normal',
          // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
          fontWeight: 'bold',
          // 字体系列
          fontFamily: 'sans-serif',
          // 字体大小
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '5%',
        right: '2%',
        bottom: '1%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // 网格样式
        splitLine: {
          show: false,
        },
        axisLine: { // x轴样式
          lineStyle: {
            color: 'rgba(102, 102, 102, 1)', // 颜色
            width: 0, // 粗细
          },
        },
        axisTick: { show: false }, // 去掉刻度
        axisPointer: {
          lineStyle: { // 指示线
            type: 'dashed',
            width: 2,
            color: '#1890FF',
          },
          label: {
            formatter(params) {
              return `降水量  ${params.value}`;
            },
            textStyle: {
              fontSize: 12,
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false }, // 去掉刻度
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(231, 235, 239, 1)'],
            width: 1,
            type: 'solid',
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(102, 102, 102, 1)', // 颜色
            width: 0, // 粗细
          },
        },
      },
      series: [
        {
          name: '订单量',
          smooth: propsOption.smooth,
          type: 'line', // 这块要定义type类型，柱形图是bar,饼图是pie
          data: [1000, 2000, 1500, 3000, 2000, 1200, 800],
          symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
          itemStyle: {
            normal: {
              color: '#1890FF', // 点颜色
              borderColor: 'rgba(24, 144, 255, 0.17)', // 点边线的颜色
            },
          },
          lineStyle: {
            normal: {
              color: '#1890FF', // 线条颜色
            },
          },
          areaStyle: { // 块样式
            normal: {
              color: 'rgba(24, 144, 255, 0.2)',
            },
          },
        },
      ],
    };
    return option;
  }

  dateChange = () => {

  }

  checkType = (i) => {
    this.setState({
      active: i,
    });
  }

  render() {
    const { active } = this.state;
    return (
      <div className={styles.chart_outbox}>
        <div className={styles.chart_outbox_left}>
          <div className={styles.left_title}>本月订单总数</div>
          <div className={styles.left_num}>10000</div>
          <div className={styles.left_bottom}>
            <span className={`${styles.num} ${styles.red}`}>10%</span>
            同比上月
          </div>
        </div>
        <div className={styles.chart_outbox_right}>
          <div className={styles.chart_toolbox}>
            <div className={styles.chart_title}>近一周订单统计</div>
            <section className={styles.chart_toolbox_right}>
              <ul className={styles.chart_kind_box}>
                {
                  ['今日', '本周', '本月'].map((item, i) => {
                    return (
                      <li className={active === i + 1 ? styles.active : ''}
                        onClick={() => this.checkType(i + 1)}
                        key={i}
                      >
                        {item}
                      </li>
                    );
                  })
                }
              </ul>
              <RangePicker onChange={this.dateChange}
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
              />
            </section>

          </div>
          <div className={styles.chart_innerbox}>
            <ReactEcharts option={this.getOption()} style={{ height: '350px', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }
}
export default EchartItem;
