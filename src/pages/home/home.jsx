import React from 'react';
import styles from './index.module.styl';

class Home extends React.Component {
  render() {
    return (
      /** Layout-admin:Start */
      <section>
        <h1 className={`animated rubberBand ${styles.h1}`}>欢迎进入京小康后端管理系统</h1>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default Home;
