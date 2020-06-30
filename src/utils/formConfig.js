/* eslint-disable react/react-in-jsx-scope */
import { Form, Col } from 'antd';
/**
 * gutter 通用删格间距 （8-16-24-32-40-48）
 */
const gutter = 8;


/**
 * 通用form中的label与wraper比例
 */
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

/**
 * 通用form中的label与wraper比例
 */
const formItemLayout12 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

/**
 * 通用form中的label与wraper比例
 */
const formItemLayout13 = {
  labelCol: { span: 13 },
  wrapperCol: { span: 11 },
};

/**
 * @method renderField3 form表单渲染 3列布局
 */
const renderField3 = (getFieldDecorator, label, key, component, options = {}) => {
  return (
    <Col span={8}>
      <Form.Item label={label}>
        {key ? getFieldDecorator(key, options)(component) : component}
      </Form.Item>
    </Col>
  );
};

/**
 * @method renderField form表单渲染 2列布局
 */
const renderField = (getFieldDecorator, label, key, component, options = {}) => {
  return (
    <Col span={12}>
      <Form.Item label={label}>
        {key ? getFieldDecorator(key, options)(component) : component}
      </Form.Item>
    </Col>
  );
};

/**
 * @method renderField form表单渲染 1列布局
 */

const renderFieldAllLine = (getFieldDecorator, label, key, component, options = {}) => {
  return (
    <Col span={24}>
      <Form.Item
        label={label}
      >
        {key ? getFieldDecorator(key, options)(component) : component}
      </Form.Item>
    </Col>
  );
};

export {
  formItemLayout12,
  formItemLayout13,
  formItemLayout,
  renderField,
  renderFieldAllLine,
  gutter,
  renderField3,
};
