/* eslint-disable react/no-deprecated */
import React from 'react';
import { Steps, Button } from 'antd';
import { Common } from '@jxkang/utils';
import Events from '@jxkang/events';
import Step1 from './components/step1';
import Step2 from './components/step2';
import Step3 from './components/step3';
import Step4 from './components/step4';
import styles from './index.module.styl';

const { Step } = Steps;

@Events
class addGoods extends React.Component {
  constructor(props) {
    super(props);

    const stepNum = props.match.params.step || 1;

    this.state = {
      current: stepNum ? stepNum * 1 : 0,
      nextText: '下一页',
      preText: '',
      isDisabled: 'disabled',
      stepOne: [],
      showStyle: 0,
      steps: [{
        title: '查看商品分类',
      },
      {
        title: '查看商品信息',
      },
      {
        title: '查看商品属性',
      },
      {
        title: '查看商品素材',
      }],
      itemId: props.match.params.id,
    };
  }


  reLoadCurren=() => {
    const { current } = this.state;
    this.getStateText(current);
  }

  next = () => {
    const { history } = this.props;
    const { itemId, current } = this.state;
    const currentState = current + 1;
    this.setState({
      current: currentState,
    });
    if (currentState !== 5) {
      history.push(`/goods/lookdetail/${currentState}${itemId ? `/${itemId}` : ''}`);
      this.forceUpdate();
    } else {
      history.push('/goods/list');
    }
  }

  goNextText=(data) => {
    const { history } = this.props;
    const { itemId } = this.state;
    this.setState({
      current: data,
    });
    history.push(`/goods/lookdetail/${data}${itemId ? `/${itemId}` : ''}`);
    this.getStateText(data);
  }


  postAllInner=(data) => {
    const { history } = this.props;
    history.push(data);
    this.setState({
      current: data,
    });
    this.getStateText(data);
  }

  compoleteAllForm=() => {
    this.stepForm4.compoleteAllForm();
  }

  prev = () => {
    const { history } = this.props;
    const { current, itemId } = this.state;
    const currentState = current - 1;
    this.setState({
      current: currentState,
    });
    history.push(`/goods/lookdetail/${currentState}${itemId ? `/${itemId}` : ''}`);
    this.forceUpdate();
    // this.getStateText(current);
  }

  getStateText = (current) => {
    if (current === 1) {
      this.setState({ current, nextText: '下一页', preText: '', showStyle: 0 });
    } else if (current === 2) {
      this.setState({ current, nextText: '下一页', preText: '上一页', showStyle: 1 });
    } else if (current === 3) {
      this.setState({ current, nextText: '下一页', preText: '上一页', showStyle: 1 });
    } else if (current === 4) {
      this.setState({ current, preText: '上一页', nextText: '关闭', showStyle: 0 });
    }
  }

  getfirStep = (data) => {
    this.setState({
      isDisabled: data,
    });
  }

  stepOneData =(data) => {
    this.setState({
      stepOne: data,
    });
  }

  /**
   * layout的props属性
   */
  setLayoutProps = () => {
    return {
      customWarper: true,
    };
  }

  render() {
    const { current, nextText, preText, steps, isDisabled, stepOne, showStyle, itemId } = this.state;
    const nextStyle = {
      marginLeft: '10px',
    };
    return (
      /** Layout-admin:Start */
      <section className={styles.contentInner}>
        <div>
          <Steps current={current - 1} className={styles.stepStyle}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div>
            {
              Common.seek()
                .equal(
                  current === 1,
                <Step1
                  itemId={itemId}
                  getfirStep={(data) => this.getfirStep(data)}
                  stepOneData={(data) => this.stepOneData(data)}
                  ref={(el) => this.stepForm1 = el}
                />
                )
                .equal(
                  current === 2,
                <Step2
                  onRef={(el) => this.stepForm2 = el}
                  itemId={itemId}
                  getfirStep={(data) => this.getfirStep(data)}
                  stepOne={stepOne}
                  reLoadCurrent={(data) => this.reLoadCurren(data)}
                />
                )
                .equal(
                  current === 3,
                <Step3
                  itemId={itemId}
                  getfirStep={(data) => this.getfirStep(data)}
                  enterNext={() => this.goNextText(4)}
                  onRef={(el) => this.stepForm3 = el}
                  reLoadCurrent={() => this.reLoadCurren()}
                />
                )
                .equal(
                  current === 4,
                <Step4
                  ref={(el) => this.stepForm4 = el}
                  getfirStep={(data) => this.getfirStep(data)}
                  itemId={itemId}
                  postAllInner={() => this.postAllInner(0)}
                  reLoadCurrent={(data) => this.reLoadCurren(data)}
                />
                )
                .get()
            }
          </div>
          {/* 底部按钮 */}
          <div className={styles.stepsAction}>
            <div>
              {
                Common.seek()
                  .equal(
                    current === 1,
                  <Button type="primary" onClick={() => this.next()}>
                    {nextText}
                  </Button>
                  )
                  .equal(
                    current === 2,
                    (
                      <>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                          {preText}
                        </Button>
                        <Button disabled={isDisabled}
                          type="primary"
                          style={showStyle === 1 ? nextStyle : {}}
                          onClick={() => this.next()}
                        >
                          {nextText}
                        </Button>
                      </>
                    )
                  )
                  .equal(
                    current === 3,
                    (
                      <>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                          {preText}
                        </Button>
                        <Button disabled={isDisabled} type="primary" style={showStyle === 1 ? nextStyle : {}} onClick={() => this.next()}>
                          {nextText}
                        </Button>
                      </>
                    )
                  )
                  .equal(
                    current == 4,
                    (
                      <>
                        <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                          {preText}
                        </Button>
                        <Button disabled={isDisabled} type="primary" style={showStyle === 1 ? nextStyle : {}} onClick={() => this.next()}>
                          {nextText}
                        </Button>
                      </>
                    )
                  )
                  .get()
              }
            </div>
          </div>
        </div>
      </section>
      /** Layout-admin:End */
    );
  }
}

export default addGoods;
