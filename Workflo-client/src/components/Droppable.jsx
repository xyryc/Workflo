import { useDroppable } from "@dnd-kit/core";

export function Droppable({ id, children }) {
  const { setNodeRef, isOver, over } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area ${isOver ? "bg-blue-200" : "bg-gray-100"}`}
    >
      {children}
    </div>
  );
}
