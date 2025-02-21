/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 200ms ease-in-out",
    zIndex: transform ? 999 : "auto", // Ensures the dragged item stays on top
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 border border-black bg-white cursor-grab shadow-md rounded-md transition-all duration-200 ease-in-out"
      style={style}
    >
      {task.title}
    </li>
  );
};
