/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DeleteTask from "./DeleteTask";
import UpdateTask from "./UpdateTask";
import { ListTodo, SquareCheck } from "lucide-react";

export const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 200ms ease-in-out",
    zIndex: transform ? 999 : "auto", // Ensures the dragged item stays on top
  };

  return (
    <div className="flex justify-between border border-black/20 shadow-md rounded-md overflow-hidden">
      <li
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="p-2 w-full cursor-grab transition-all duration-200 ease-in-out text-neutral-800"
        style={style}
      >
        <p className="flex gap-1 mb-1 ">
          <ListTodo className="aspect-auto w-5" /> {task.title}
        </p>
        <p className="text-xs text-gray-700 uppercase">
          {new Date(task.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </p>

        <blockquote className="italic text-sm mt-2">
          {task.description}
        </blockquote>
      </li>

      {/* update and delete */}
      <div className="flex flex-col gap-1.5 p-0.5 ">
        <UpdateTask id={task._id} className="bg-neutral-600" />
        <DeleteTask id={task._id} className="bg-neutral-600" />
      </div>
    </div>
  );
};
