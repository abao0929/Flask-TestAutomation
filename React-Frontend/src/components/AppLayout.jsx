import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Sider } = Layout;


const headerItems = [
  {
    key: '/locatormanagement',
    icon: <LaptopOutlined />,
    label: <Link to="/locatormanagement">Locator_management</Link>,
  },
  {
    key: '/operateprocess',
    icon: <LaptopOutlined />,
    label: <Link to="/operateprocess">Operate_Process</Link>,
  }
]

const AppLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" style={{ color: "#fff", fontWeight: "bold", marginRight: 20, fontSize: 20 }}>
          TestAutomation
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[window.location.pathname]}
          items={headerItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Outlet />
    </Layout>
  );
};

export default AppLayout;
