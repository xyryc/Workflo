/* eslint-disable react/prop-types */
import { useDroppable } from "@dnd-kit/core";

export function Droppable({ id, children }) {
  const { setNodeRef, isOver, over } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-area w-full h-full min-h-[200px] min-w-[300px] p-4 border-2 rounded-lg transition-all duration-200 ease-in-out ${
        isOver ? "bg-blue-200 border-blue-500" : "bg-gray-100 border-gray-300"
      }`}
    >
      {children}
    </div>
  );
}
