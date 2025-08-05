import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 单个可排序项组件
function SortableItem({ locator, onRemove, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: locator._uid }); // 使用唯一 uid

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    marginBottom: "8px",
    background: "#f3f6fa",
    border: "1px solid #b8c1c8",
    borderRadius: "6px",
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  };

  // 展示所有字段
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span><b>{index + 1}.</b></span>
      <span>name: {locator.name}</span>
      <span>method: {locator.method}</span>
      <span>value: {locator.value}</span>
      <span>page: {locator.page}</span>
      <span>operate: {locator.operate}</span>
      <button
        onClick={() => onRemove(locator._uid)}
        style={{
          marginLeft: "10px", background: "#f66", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer"
        }}
      >
        移除
      </button>
    </div>
  );
}

export default function CustomOperateProcess() {
  const [locators, setLocators] = useState([]);
  const [selected, setSelected] = useState([]);

  // 获取 locator 列表
  const fetchLocators = () => {
    axios.get("/api/locator").then(res => setLocators(res.data));
  };

  useEffect(() => { fetchLocators(); }, []);

  // dnd-kit 传感器
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // 多次添加：每次点都复制对象并加唯一标识
  const addToSelected = locator => {
    // 增加一个 _uid 字段（不和 id 冲突，每次唯一）
    const _uid = Date.now().toString() + Math.random().toString(36).slice(2, 8);
    setSelected([...selected, { ...locator, _uid }]);
  };

  // 移除
  const removeFromSelected = _uid => {
    setSelected(selected.filter(item => item._uid !== _uid));
  };

  // 拖拽排序
  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selected.findIndex(item => item._uid === active.id);
      const newIndex = selected.findIndex(item => item._uid === over.id);
      setSelected(arrayMove(selected, oldIndex, newIndex));
    }
  };

  return (
    <div style={{
      display: "flex", height: "500px", border: "1px solid #d2d5d9", borderRadius: "8px",
      background: "#f8fafc", overflow: "hidden"
    }}>
      {/* 左侧候选区 */}
      <div style={{
        flex: "1 1 0", minWidth: "220px", borderRight: "1px solid #e2e6ea",
        padding: "18px", background: "#fff", overflowY: "auto"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "12px" }}>所有可选元素</div>
        {locators.length === 0 && <div>加载中...</div>}
        {locators.map(locator => (
          <div key={locator.id}
            style={{
              padding: "10px", marginBottom: "10px", background: "#f3f6fa",
              border: "1px solid #dbe4ee", borderRadius: "5px", cursor: "pointer"
            }}
            onClick={() => addToSelected(locator)}
            title="点击添加到右侧"
          >
            {locator.name}
          </div>
        ))}
      </div>

      {/* 右侧可排序区 */}
      <div style={{ flex: "3 1 0", padding: "24px", overflowY: "auto" }}>
        <div style={{ fontWeight: 600, marginBottom: "16px" }}>已添加&可排序区</div>
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
              <div style={{ color: "#8b98a5" }}>请从左侧点击添加元素</div>
            ) : (
              selected.map((locator, idx) => (
                <SortableItem
                  key={locator._uid}
                  locator={locator}
                  index={idx}
                  onRemove={removeFromSelected}
                />
              ))
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
