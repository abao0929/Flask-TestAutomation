import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  message,
  Table,
  Space,
  Button,
  Select,
  Form,
  Input,
  Modal,
  Row,
  Col,
} from "antd";

function LocatorList() {
  const [locators, setLocators] = useState([]);
  const [methods, setMethods] = useState([]);
  const [operates, setOperates] = useState([]);
  const [pages, setPages] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // 新增：筛选项
  const [selectedPage, setSelectedPage] = useState("");      // "" 代表无筛选
  const [selectedOperate, setSelectedOperate] = useState(""); // "" 代表无筛选

  // 获取所有 pages
  const fetchPages = () => {
    axios.get("/api/page").then((res) => setPages(res.data));
  };

  // 获取 methods
  const fetchMethods = () => {
    axios.get("/api/locator/method").then((res) => {
      setMethods(res.data?.methods || []);
    });
  };

  // 获取 operates
  const fetchOperates = () => {
    axios.get("/api/locator/operate").then((res) => {
      setOperates(res.data?.operates || []);
    });
  };

  // 获取所有 locators
  const fetchLocators = () => {
    axios.get("/api/locator").then((res) => setLocators(res.data));
  };

  // 根据筛选项获取
  const fetchFilteredLocators = (page, operate) => {
    // page/operate 为空字符串时不带参数
    const params = {};
    if (page) params.page = page;
    if (operate) params.operate = operate;
    axios.get("/api/locator/filter", { params }).then((res) => setLocators(res.data));
  };

  // 初始化数据
  useEffect(() => {
    fetchPages();
    fetchMethods();
    fetchOperates();
    fetchLocators();
  }, []);

  // 筛选项变化时重新获取
  useEffect(() => {
    if (selectedPage || selectedOperate) {
      fetchFilteredLocators(selectedPage, selectedOperate);
    } else {
      fetchLocators();
    }
  }, [selectedPage, selectedOperate]);

  // 编辑
  const editRecord = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  // 新增
  const addRecord = () => {
    setEditingRecord(null);
    setModalVisible(true);
  };

  // 取消
  const closeModal = () => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // 删除
  const deleteRecord = (id) => {
    Modal.confirm({
      title: "确认删除？",
      content: "此操作不可撤销，是否继续？",
      onOk: () =>
        axios
          .delete(`/api/locator/${id}`)
          .then((res) => {
            if (res.data.success) {
              message.success("删除成功");
              // 删除后自动刷新当前筛选
              if (selectedPage || selectedOperate) {
                fetchFilteredLocators(selectedPage, selectedOperate);
              } else {
                fetchLocators();
              }
            } else {
              message.error(res.data.msg || "删除失败");
            }
          })
          .catch((err) => {
            message.error(err.response?.data?.msg || "请求失败");
          }),
    });
  };

  // 保存
  const submitModal = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        // 编辑模式
        axios
          .put(`/api/locator/edit/${editingRecord.id}`, values)
          .then((res) => {
            if (res.data.success) {
              message.success("编辑成功");
              setModalVisible(false);
              setEditingRecord(null);
              // 编辑后自动刷新当前筛选
              if (selectedPage || selectedOperate) {
                fetchFilteredLocators(selectedPage, selectedOperate);
              } else {
                fetchLocators();
              }
            } else {
              message.error(res.data.msg || "编辑失败");
            }
          });
      } else {
        // 新增模式
        axios.post("/api/locator/add", values).then((res) => {
          if (res.data.success) {
            message.success("添加成功");
            setModalVisible(false);
            // 新增后自动刷新当前筛选
            if (selectedPage || selectedOperate) {
              fetchFilteredLocators(selectedPage, selectedOperate);
            } else {
              fetchLocators();
            }
          } else {
            message.error(res.data.msg || "添加失败");
          }
        });
      }
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "方式", dataIndex: "method", key: "method" },
    { title: "值", dataIndex: "value", key: "value" },
    { title: "页面", dataIndex: "page", key: "page" },
    { title: "操作类型", dataIndex: "operate", key: "operate" },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => editRecord(record)}
          >
            编辑
          </Button>
          <Button danger size="small" onClick={() => deleteRecord(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // Modal中自动处理编辑/新增模式
  useEffect(() => {
    if (modalVisible) {
      if (editingRecord) {
        form.setFieldsValue(editingRecord);
      } else {
        form.resetFields();
      }
    }
  }, [modalVisible, editingRecord, form]);

  return (
    <div>
      {/* 顶部筛选框 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            style={{ width: 160 }}
            value={selectedPage}
            onChange={value => setSelectedPage(value)}
            allowClear
            placeholder="筛选页面"
            // 需要有“无”（全部）的选项
          >
            <Select.Option value="">全部页面</Select.Option>
            {pages.map(p => (
              <Select.Option value={p.name} key={p.name}>{p.name}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Select
            style={{ width: 160 }}
            value={selectedOperate}
            onChange={value => setSelectedOperate(value)}
            allowClear
            placeholder="筛选操作类型"
          >
            <Select.Option value="">全部操作类型</Select.Option>
            {operates.map(o => (
              <Select.Option value={o.value} key={o.value}>{o.name}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={addRecord}>
            新增 Locator
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={locators}
        rowKey="id"
        pagination={false}
        bordered
      />

      <Modal
        title={editingRecord ? "编辑" : "新增"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={submitModal}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="方式"
            name="method"
            rules={[{ required: true, message: "请选择方式" }]}
          >
            <Select
              placeholder="请选择方式"
              options={methods.map((m) => ({
                label: m.name,
                value: m.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "请输入值" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Page"
            name="page"
            rules={[{ required: true, message: "请输入页面" }]}
          >
            <Select
              placeholder="请选择页面"
              options={pages.map((p) => ({
                label: p.name,
                value: p.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="操作类型"
            name="operate"
            rules={[{ required: true, message: "请选择操作类型" }]}
          >
            <Select
              placeholder="请选择操作类型"
              options={operates.map((o) => ({
                label: o.name,
                value: o.value,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LocatorList;
