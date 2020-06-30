import React from 'react';
import Events from '@jxkang/events';
import AddBrand from './components/addbrand';
import FormTable from './components/formtable';

@Events
class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    // this.props.onRef.bind(this);
  }

  componentDidMount() {
    this.props.reLoadCurrent();
    this.props.getfirStep('');
  }

  render() {
    const { stepOne, itemId } = this.props;
    return (
      <div>
        <AddBrand />
        <FormTable stepOne={stepOne} itemId={itemId} />
      </div>
    );
  }
}

export default Step2;
