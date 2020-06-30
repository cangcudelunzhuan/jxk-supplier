import React, { useState } from 'react';
import classnames from 'classnames';
import { NavLink } from 'dva/router';
import { Common } from '@jxkang/utils';
import { Icon } from '@jxkang/web-cmpt';
import menu from './menu-data';
import styles from './index.module.styl';

const g = globalThis;

const Menu = function () {
  const [clickCount, setClickCount] = useState(0);
  const menuData = Common.clone(menu);
  const currentMenu = JSON.parse(g.sessionStorage.getItem('sup_CurrentMenu') || '[]');

  const onMenuClick = (indexs) => {
    if (indexs === null) {
      g.sessionStorage.removeItem('sup_CurrentMenu');
    } else {
      g.sessionStorage.setItem('sup_CurrentMenu', JSON.stringify(indexs));
    }
  };

  const onOpenMenu = (indexs) => {
    //
    // 主菜单展开与收缩
    if (indexs.length === 1 && indexs[0] === currentMenu[0]) {
      indexs = null;
    } else if (indexs.length === 2 && indexs[1] === currentMenu[1]) { // 二级菜单展开与收缩
      indexs = indexs.slice(0, 1);
    }
    //
    onMenuClick(indexs);
    setClickCount(clickCount + 1);
  };

  const MenuLink = ({ data, className, icon, kinship }) => (data.url ? (
    <NavLink to={data.url} className={className} activeClassName={styles.active} onClick={() => onMenuClick(kinship)} target={data.target || null}>
      {icon}
      {data.name}
      {data.children && data.children.length ? <Icon type="jiantou" size="small" className={styles.menu_status_icon} /> : null}
    </NavLink>
  ) : (
    <span className={className} onClick={() => onOpenMenu(kinship)}>
      {icon}
      {data.name}
      {data.children && data.children.length ? <Icon type="jiantou" size="small" className={styles.menu_status_icon} /> : null}
    </span>
  ));

  return (
    <aside className={styles.aside_menu}>
      {
      menuData.map((item, index) => (
        <dl key={index} className={currentMenu[0] === index ? styles.current_menu_main : null}>
          <dt>
            {
              MenuLink({
                data: item,
                className: styles.main_menu_label,
                icon: <Icon type={item.icon} className={styles.menu_icon} />,
                kinship: [index],
              })
              }
          </dt>
          { // 二级菜单
              Array.isArray(item.children) && item.children.map((v, idx) => (
                <dd key={idx} className={classnames('animated', 'flipInX', { [styles.current_menu_2]: currentMenu[1] === idx })}>
                  {MenuLink({ data: v, kinship: [index, idx] })}
                  { // 三级菜单
                    Array.isArray(v.children) && v.children.length
                      ? (
                        <section className={classnames('animated', 'flipInX', styles.leaf_menu)}>
                          {
                            v.children.map((vv, i) => (
                              <div key={i} className={currentMenu[2] === i ? styles.current_menu_3 : null}>{MenuLink({ data: vv, kinship: [index, idx, i] })}</div>
                            ))
                          }
                        </section>
                      )
                      : null
                  }
                </dd>
              ))
            }
        </dl>
      ))
}
    </aside>
  );
};

export default Menu;
