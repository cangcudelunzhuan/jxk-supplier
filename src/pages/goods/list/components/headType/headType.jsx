import React from 'react';
import {} from 'antd';
import styles from './index.module.styl';

const NumberList = (props) => {
  const { numbers } = props;
  const listItems = numbers.map((item) => (
    <div className={styles.title_top} key={item.toString()}>
      <div>
        <span>
          {item.name}
          (
        </span>
        <span className={styles.red_color}>{item.num}</span>
        <span>)</span>
      </div>
    </div>
  )
  );
  return (
    <div className={styles.all_eve}>{listItems}</div>
  );
};

class headType extends React.Component {
  render() {
    const { typeArr } = this.props;
    return (
      <section className={styles.contentInner}>
        <NumberList numbers={typeArr} />
      </section>
    );
  }
}

export default headType;
