import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Upload } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LocatorList = () => {
  const [locators, setLocators] = useState([]);
  const [meta, setMeta] = useState({ methods: [], operates: [], pages: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50, total: 0 });
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 获取常量数据
  useEffect(() => {
    axios.get('/api/locator/meta').then(res => setMeta(res.data));
    fetchLocators(1);
  }, []);

  // 获取列表
  const fetchLocators = (page = 1) => {
    setLoading(true);
    axios.get('/api/locator', { params: { page } }).then(res => {
      setLocators(res.data.locators);
      setPagination({
        current: page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    }).finally(() => setLoading(false));
  };

  // 新增/编辑
  const onFinish = values => {
    const api = editing
      ? axios.put(`/api/locator/${editing.id}`, values)
      : axios.post('/api/locator', values);

    api.then(res => {
      message.success(res.data.msg);
      setVisible(false);
      fetchLocators(pagination.current);
    }).catch(err => {
      message.error(err.response?.data?.msg || '操作失败');
    });
  };

  // 删除
  const handleDelete = id => {
    Modal.confirm({
      title: "确认删除？",
      onOk: () => {
        axios.delete(`/api/locator/${id}`).then(res => {
          message.success(res.data.msg);
          fetchLocators(pagination.current);
        }).catch(err => {
          message.error(err.response?.data?.msg || '删除失败');
        });
      }
    });
  };

  // 上传Excel
  const handleUpload = info => {
    if (info.file.status !== 'uploading') return;
    const formData = new FormData();
    formData.append('excel_file', info.file.originFileObj);
    axios.post('/api/locator/upload', formData).then(res => {
      message.success(res.data.msg);
      fetchLocators(pagination.current);
    }).catch(err => {
      message.error(err.response?.data?.msg || '导入失败');
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "名称", dataIndex: "name" },
    { title: "定位方式", dataIndex: "method" },
    { title: "定位值", dataIndex: "value" },
    { title: "页面", dataIndex: "page" },
    { title: "操作类型", dataIndex: "operate" },
    {
      title: "操作", render: (_, record) => (
        <>
          <Button onClick={() => { setEditing(record); setVisible(true); form.setFieldsValue(record); }} type="link">编辑</Button>
          <Button danger onClick={() => handleDelete(record.id)} type="link">删除</Button>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setEditing(null); setVisible(true); form.resetFields(); }}>新增定位</Button>
      <Upload showUploadList={false} customRequest={({ file, onSuccess }) => { handleUpload({ file }); onSuccess(); }}>
        <Button style={{ marginLeft: 8 }}>批量导入Excel</Button>
      </Upload>
      <Table
        columns={columns}
        dataSource={locators}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: fetchLocators
        }}
        style={{ marginTop: 20 }}
      />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title={editing ? "编辑定位" : "新增定位"}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          initialValues={editing || {}}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="method" label="定位方式" rules={[{ required: true }]}>
            <Select>
              {meta.methods.map(m => <Option value={m} key={m}>{m}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="value" label="定位值" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="page" label="页面" rules={[{ required: true }]}>
            <Select>
              {meta.pages.map(p => <Option value={p} key={p}>{p}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="operate" label="操作类型" rules={[{ required: true }]}>
            <Select>
              {meta.operates.map(o => <Option value={o} key={o}>{o}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">提交</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LocatorList;
