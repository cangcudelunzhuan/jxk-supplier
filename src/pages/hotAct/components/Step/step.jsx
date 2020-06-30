import React from 'react';

import { Steps } from 'antd';

const { Step } = Steps;
// import styles from './index.module.styl';


class Stepx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { current } = this.props;
    return (
      <Steps size="small" current={current} style={{ marginBottom: '20px' }}>
        <Step title="设置活动时间" />
        <Step title="添加商品素材" />
      </Steps>
    );
  }
}

export default Stepx;
