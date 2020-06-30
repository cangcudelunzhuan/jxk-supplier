/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-18 12:30:50
 * @Description: 商品新增/修改 规格SKU生成 代码重构
 */
import React, { Fragment } from 'react';
import { Table, Button, Modal } from 'antd';
import { BoxTitle, FormControl, Icon } from '@jxkang/web-cmpt';
import { getFileUrl } from '@/utils/index';
import Controller from './controller';
import styles from './index.module.styl';

class StepThree extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);

    this.defaultColumns = [
      {
        title: '内部编码',
        dataIndex: 'innerSkuId',
        key: 'innerSkuId',
        width: '80',
        render: (text, recored, index) => {
          return (
            <FormControl
              width={80}
              required
              maxLength={20}
              verifMessage="请输入内部编码"
              name={`formData.${index}.innerSkuId`}
            />
          );
        },
      }, {
        title: '商品图片',
        dataIndex: 'skuImg',
        key: 'skuImg',
        width: '80',
        render: (text, recored, index) => (
          <>
            <FormControl
              type="file"
              onChange={(src) => this.onUploadImg(src, recored, index)}
            >
              {
              text ? <img className={styles.sku_img} src={getFileUrl(text)} alt="商品图片" /> : (
                <div className={styles.sku_upload}>
                  <Icon antd="antd" type={text ? 'loading' : 'plus'} />
                </div>
              )
            }
            </FormControl>
            <FormControl
              type="empty"
              required
              name={`formData.${index}.skuImg`}
              verifMessage="请上传商品图片"
            />
          </>
        ),
      }, {
        title: '市场价',
        dataIndex: 'scribingPrice',
        width: '80',
        key: 'scribingPrice',
        render: (text, recored, index) => (
          <FormControl
            width={80}
            validator={this.inputValidator}
            name={`formData.${index}.scribingPrice`}
          />
        ),
      }, {
        title: '建议零售价',
        dataIndex: 'retailPrice',
        width: '100',
        key: 'retailPrice',
        render: (text, recored, index) => (
          <FormControl
            width={80}
            validator={this.inputValidator}
            name={`formData.${index}.retailPrice`}
          />
        ),
      }, {
        title: '普通买家',
        dataIndex: 'tradePrice',
        width: '100',
        key: 'tradePrice',
        render: (text, recored, index) => (
          <FormControl
            width={80}
            validator={this.inputValidator}
            name={`formData.${index}.tradePrice`}
          />
        ),
      }, {
        title: '超级买家',
        dataIndex: 'vipTradePrice',
        width: '100',
        key: 'vipTradePrice',
        render: (text, recored, index) => (
          <FormControl
            validator={this.inputValidator}
            width={80}
            name={`formData.${index}.vipTradePrice`}
          />
        ),
      }, {
        title: '商品首批库存',
        dataIndex: 'stockQty',
        width: '100',
        key: 'stockQty',
        render: (text, recored, index) => (
          <FormControl
            validator={this.inputsoockValidator}
            width={100}
            name={`formData.${index}.stockQty`}
          />
        ),
      }, {
        title: '操作',
        render: (text, recored, index) => (
          <span
            className="link_btn"
            onClick={() => this.removeSkuItem(index)}
          >
            删除
          </span>
        ),
      },
    ];

    this.state = {
      // 生成sku列表数据
      columns: this.defaultColumns,
      // 添加临时规格弹框
      addSpecifVisible: false,
      // 规格数据源
      specSource: [],
      // 所选规格数据（三个）
      selectSpecif: [],
      // 生成的最终sku数据
      skuTableData: {
        formData: [],
      },
    };

    /**
     * 临时数据
     */
    this.itemCacheData = {
      // 临时规格名称
      addItemSpecifName: '',
      // 添加规格 临时值 <value, index>
      addItemSpecifValue: [],
    };

    Controller(this);
  }

  componentDidMount() {
    // 获取原始规格列表
    this.getSpecList();
    // 编辑情况、取历史数据
    this.getHistorySKU();

    this.props.reLoadCurrent();
    this.props.getfirStep('');
  }

  render() {
    const {
      columns,
      addSpecifVisible,
      specSource,
      selectSpecif,
      skuTableData,
    } = this.state;
    // const { itemId } = this.props;
    const numMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const { addItemSpecifValue } = this.itemCacheData;
    const SpecifPlaceholder = selectSpecif[selectSpecif.length - 1]?.specsName ?? '请选择规格类别';

    return (
      <section>
        <BoxTitle
          title="规格/价格/库存"
        />
        {/** 添加规格类别 */}
        <div className={styles.type_box}>
          <span>添加规格类别：</span>
          <FormControl
            type="select"
            placeholder={SpecifPlaceholder}
            width={320}
            dataSource={specSource}
            onChange={this.onChangeItem}
          />
          <Button
            className="ml10"
            disabled={selectSpecif.length >= 3}
            onClick={this.onShowAddItemSpace}
          >
            新增临时规格
          </Button>
        </div>
        {/** 所选规格列表 */}
        <div className={styles.specs_wraper}>
          <h5 className={styles.specs_title}>
            <i className="required" />
            商品规格：
          </h5>
          <div>
            {
              selectSpecif.map((item, idx) => (
                <div key={idx} className={styles.specs_items}>
                  <div className={styles.specs_info_box}>
                    <i className={styles.specs_del}
                      title="删除"
                      onClick={() => this.removeSpecs(idx, item)}
                    >
                      &times;
                    </i>
                    <i className="required" />
                    <span className={styles.specs_title}>
                      规格
                      {numMap[idx]}
                      ：
                      {item.specsName}
                    </span>
                    {
                      item.specsValues.map((v, i) => (
                        <Fragment key={`${v.specsValueId}-${v.parentId}-${v.specsValue}`}>
                          <FormControl
                            type="checkbox"
                            defaultChecked={v.checked}
                            onChange={(e) => this.handleChangeSpecsValue(idx, i, e)}
                          >
                            {v.specsValue}
                          </FormControl>
                          {`${v.specsValueId}`.indexOf('item') > -1 ? <a onClick={() => this.handleRemoveSpecsValueItem(idx, i)} className={styles.remove_item}>删除</a> : null}
                        </Fragment>
                      ))
                    }
                  </div>
                  <div className={styles.specs_add_box}>
                    <FormControl
                      type="text"
                      width={100}
                      trim
                      placeholder="请输入规格"
                      value={addItemSpecifValue[1] === idx ? addItemSpecifValue[0] : null}
                      onChange={(v) => {
                        this.itemCacheData.addItemSpecifValue = [v, idx];
                        this.setState({});
                      }}
                    />
                    <Button
                      type="primary"
                      className="ml10"
                      onClick={() => this.handleAddSpecsValue(idx)}
                    >
                      增加
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="mt10">
            <Button onClick={this.createSKUdetailed}>生成SKU清单</Button>
            {/*
              itemId ? <Button className="ml20" onClick={this.clearHisSKU}>清除内存历史SKU</Button> : null
            */}
          </div>
        </div>
        {/** 生成的SKU列表集合 */}
        <div className={styles.table_box}>
          <FormControl.Wrapper
            ref={(el) => { this.myForm = el; }}
            value={skuTableData}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={skuTableData.formData}
              pagination={false}
            />
          </FormControl.Wrapper>
        </div>
        {/** 生成的临时规格 */}
        <Modal
          visible={addSpecifVisible}
          title="新增临时规格"
          onOk={this.handlerAddItemSpecif}
          onCancel={() => this.setState({ addSpecifVisible: false })}
        >
          <div>
            <div className="pb5">
              <span className="required" />
              <i className="ml3">添加属性类型：</i>
            </div>
            <FormControl
              placeholder="请选择规格名称"
              width="100%"
              trim
              onChange={(v) => this.itemCacheData.addItemSpecifName = v}
            />
          </div>
        </Modal>
      </section>
    );
  }
}

export default StepThree;
