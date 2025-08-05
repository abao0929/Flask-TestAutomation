import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button, Input, Card, Typography, Space, Row, Col, message, Select,
} from "antd";
const { Text } = Typography;

// 单个可排序项
function SortableItem({ locator, onRemove, index, onInputChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: locator._uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 12,
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 6,
    boxShadow: "0 2px 6px #f0f1f3",
    padding: 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      {...attributes}
      {...listeners}
    >
      <Row align="middle" wrap={false} gutter={8}>
        <Col flex="36px">
          <Text strong style={{
            display: "inline-block",
            minWidth: 28,
            textAlign: "center",
            background: "#f0f2f5",
            borderRadius: 4,
            padding: "2px 0",
          }}>
            {index + 1}
          </Text>
        </Col>
        <Col>
          <Text type="secondary">name:</Text> <Text>{locator.name}</Text>
        </Col>
        <Col>
          <Text type="secondary">method:</Text> <Text>{locator.method}</Text>
        </Col>
        <Col>
          <Text type="secondary">value:</Text> <Text>{locator.value}</Text>
        </Col>
        <Col>
          <Text type="secondary">page:</Text> <Text>{locator.page}</Text>
        </Col>
        <Col>
          <Text type="secondary">operate:</Text> <Text>{locator.operate}</Text>
        </Col>
        {locator.operate === "input" && (
          <Col flex="120px">
            <Input
              placeholder="请输入内容"
              size="small"
              value={locator.inputValue || ""}
              onChange={e => onInputChange(locator._uid, e.target.value)}
              style={{ minWidth: 90 }}
            />
          </Col>
        )}
        <Col style={{ marginLeft: "auto" }}>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => onRemove(locator._uid)}
          >
            移除
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default function CustomOperateProcess() {
  const [locators, setLocators] = useState([]);
  const [pages, setPages] = useState([]);
  const [operates, setOperates] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedOperate, setSelectedOperate] = useState("");
  const [selected, setSelected] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 获取所有 pages、operates
  useEffect(() => {
    axios.get("/api/page").then(res => setPages(res.data));
    axios.get("/api/locator/operate").then(res => setOperates(res.data?.operates || []));
  }, []);

  // 获取所有或筛选后的 locators
  const fetchLocators = (page, operate) => {
    const params = {};
    if (page) params.page = page;
    if (operate) params.operate = operate;
    const url = (params.page || params.operate)
      ? "/api/locator/filter"
      : "/api/locator";
    axios.get(url, { params }).then(res => setLocators(res.data));
  };

  // 初始化/筛选
  useEffect(() => {
    fetchLocators(selectedPage, selectedOperate);
  }, [selectedPage, selectedOperate]);

  // 多次添加（每次唯一 _uid）
  const addToSelected = locator => {
    const _uid = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    setSelected([...selected, { ...locator, _uid, inputValue: "" }]);
  };

  const removeFromSelected = _uid => {
    setSelected(selected.filter(item => item._uid !== _uid));
  };

  const handleInputChange = (_uid, value) => {
    setSelected(selected =>
      selected.map(item =>
        item._uid === _uid ? { ...item, inputValue: value } : item
      )
    );
  };

  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selected.findIndex(item => item._uid === active.id);
      const newIndex = selected.findIndex(item => item._uid === over.id);
      setSelected(arrayMove(selected, oldIndex, newIndex));
    }
  };

  return (
    <Row gutter={24} style={{ height: 700 }}>
      {/* 左侧候选区 */}
      <Col span={7} style={{ height: "100%", overflowY: "auto" }}>
        <Card
          title="所有可选元素"
          style={{ height: "100%", background: "#f9fbfc" }}
        >
          {/* 顶部筛选框 */}
          <Space style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 140 }}
              value={selectedPage}
              onChange={v => setSelectedPage(v)}
              placeholder="筛选页面"
              allowClear
            >
              <Select.Option value="">全部页面</Select.Option>
              {pages.map(p => (
                <Select.Option value={p.name} key={p.name}>{p.name}</Select.Option>
              ))}
            </Select>
            <Select
              style={{ width: 140 }}
              value={selectedOperate}
              onChange={v => setSelectedOperate(v)}
              placeholder="筛选操作类型"
              allowClear
            >
              <Select.Option value="">全部操作类型</Select.Option>
              {operates.map(o => (
                <Select.Option value={o.value} key={o.value}>{o.name}</Select.Option>
              ))}
            </Select>
          </Space>
          {/* 卡片流式展示 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {locators.length === 0 && <Text type="secondary">暂无数据</Text>}
            {locators.map(locator => (
              <Card
                key={locator.id}
                hoverable
                onClick={() => addToSelected(locator)}
                style={{
                  margin: "8px 0",
                  borderRadius: 8,
                  cursor: "pointer",
                  borderColor: "#e6f4ff",
                  transition: "box-shadow 0.2s",
                }}
              >
                <Space direction="vertical" size={4}>
                  <Text strong>{locator.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>page: {locator.page}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>operate: {locator.operate}</Text>
                </Space>
              </Card>
            ))}
          </div>
        </Card>
      </Col>

      {/* 右侧可排序区 */}
      <Col span={17} style={{ height: "100%" }}>
        <Card
          title="已添加 & 可排序区"
          style={{ height: "100%", overflowY: "auto" }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selected.map(item => item._uid)}
              strategy={verticalListSortingStrategy}
            >
              {selected.length === 0 ? (
                <Text type="secondary">请点击左侧卡片添加元素</Text>
              ) : (
                selected.map((locator, idx) => (
                  <SortableItem
                    key={locator._uid}
                    locator={locator}
                    index={idx}
                    onRemove={removeFromSelected}
                    onInputChange={handleInputChange}
                  />
                ))
              )}
            </SortableContext>
          </DndContext>
        </Card>
      </Col>
    </Row>
  );
}
