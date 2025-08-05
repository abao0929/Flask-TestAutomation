import React, { useEffect, useState} from "react";
import axios from "axios"
import { message, Table, Space, Button, Select, Form, Input, Modal } from "antd";

function LocatorModal({ visible, onCancel, onOk, record, form, title}) {
    React.useEffect(() => {
        if(visible){
            if (record) {
                form.setFieldsValue(record);
            }
            else {
                form.resetFields();
            }
        }
    }, [visible, record, form]);

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            onOk={onOk}
            okText="保存"
            cancelText="取消"
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "请输入名称" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="方式" name="method" rules={[{ required: true, message: "请选择方式" }]}>
                    <Select>
                        <Select.Option value="XPATH">XPATH</Select.Option>
                        <Select.Option value="ID">ID</Select.Option>
                        <Select.Option value="CLASS_NAME">CLASS_NAME</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Value" name="value" rules={[{ required: true, message: "请输入值" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Page" name="page" rules={[{ required: true, message: "请输入页面" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="操作类型" name="operate" rules={[{ required: true, message: "请选择操作类型" }]}>
                    <Select>
                        <Select.Option value="click">click</Select.Option>
                        <Select.Option value="input">input</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

function LocatorList() {
    const [locators, setLocators] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const fetchLocators = () => {
        axios.get("/api/locator").then(res => setLocators(res.data));
    };

    useEffect(() => {
        fetchLocators();
    }, []);
    
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
        axios.delete(`/api/locator/${id}`)
            .then(res => {
            if (res.data.success) {
                message.success("删除成功");
                fetchLocators();
            } else {
                message.error(res.data.msg || "删除失败");
            }
            })
            .catch(err => {
            message.error(err.response?.data?.msg || "请求失败");
            })
        });
    };

    // 保存
    const submitModal = () => {
        form.validateFields().then(values => {
        if (editingRecord) {
            // 编辑模式
            axios.put(`/api/locator/edit/${editingRecord.id}`, values)
            .then(res => {
                if (res.data.success) {
                message.success("编辑成功");
                setModalVisible(false);
                setEditingRecord(null);
                fetchLocators();
                } else {
                message.error(res.data.msg || "编辑失败");
                }
            });
        } else {
            // 新增模式
            axios.post("/api/locator/add", values)
            .then(res => {
                if (res.data.success) {
                message.success("添加成功");
                setModalVisible(false);
                fetchLocators();
                } else {
                message.error(res.data.msg || "添加失败");
                }
            });
        }
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '方式', dataIndex: 'method', key: 'method' },
        { title: '值', dataIndex: 'value', key: 'value' },
        { title: '页面', dataIndex: 'page', key: 'page' },
        { title: '操作类型', dataIndex: 'operate', key: 'operate' },
        { 
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" size="small" onClick={() => editRecord(record)}>
                        编辑
                    </Button>
                    <Button danger size="small" onClick={() => deleteRecord(record.id)}>
                        删除
                    </Button>
                </Space>
                
            )
        }
    ];


    return (
        <div>
            <Button type="primary" style={{ marginBottom: 16 }} onClick={addRecord}>
                新增 Locator
            </Button>
            <Table
                columns={columns}
                dataSource={locators}
                rowKey="id"
                pagination={false}
                bordered
            />
            <LocatorModal
            visible={modalVisible}
            onCancel={closeModal}
            onOk={submitModal}
            record={editingRecord}
            form={form}
            title={editingRecord?"编辑":"新增"}
            />
        </div>
    );
}

export default LocatorList;