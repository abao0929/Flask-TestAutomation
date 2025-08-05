import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "16px",
    marginBottom: "8px",
    background: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}

export default function ProcessManagement() {
  const [items, setItems] = useState([
    "item-1",
    "item-2",
    "item-3",
    "item-4",
    "item-5",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={event => {
        const { active, over } = event;
        if (active.id !== over?.id) {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          setItems(arrayMove(items, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map(id => (
          <SortableItem key={id} id={id}>
            {id}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
