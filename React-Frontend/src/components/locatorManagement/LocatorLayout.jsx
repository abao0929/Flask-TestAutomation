import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Content, Sider } = Layout;

const siderItems = [
  {
    key: '/locators',
    icon: <LaptopOutlined />,
    label: <Link to="/locatormanagement/locators">LocatorList</Link>,
  },
  {
    key: '/pages',
    icon: <LaptopOutlined />,
    label: <Link to="/locatormanagement/pages">PageList</Link>,
  }
];

const LocatorLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: colorBgContainer }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={siderItems}
          style={{ height: '100%', borderInlineEnd: 0 }}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb
          // items={[{ title: 'Locators' }]}
          style={{ margin: '16px 0' }}
        />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LocatorLayout;
