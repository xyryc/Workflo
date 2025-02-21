import { useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  rectIntersection,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import { TaskItem } from "./TaskItem";
import toast from "react-hot-toast";
import { Droppable } from "./Droppable";

const Tasklist = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/tasks?email=${user?.email}`
      );
      return data;
    },
  });

  // Local state for categorized tasks
  const [categorizedTasks, setCategorizedTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  // 🛠 Update categorizedTasks when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      setCategorizedTasks({
        "To-Do": tasks.filter((task) => task.category === "To-Do"),
        "In Progress": tasks.filter((task) => task.category === "In Progress"),
        Done: tasks.filter((task) => task.category === "Done"),
      });
    }
  }, [tasks]);

  // API call to update task category
  const updateTaskCategory = useMutation({
    mutationFn: async ({ taskId, category }) => {
      await axiosSecure.patch(`/tasks/${taskId}`, { category });
      toast.success(`Task ${category}!`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Handle Drag End
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Check if the destination is valid
    const sourceCategory = Object.keys(categorizedTasks).find((cat) =>
      categorizedTasks[cat]?.some((task) => task._id === active.id)
    );

    // Ensure over.id is a valid category (not a task ID)
    const destinationCategory =
      over && !over.id.startsWith("task_") ? over.id : null;

    console.log(
      "Source Category:",
      sourceCategory,
      "Destination Category:",
      destinationCategory
    );

    if (
      !sourceCategory ||
      !destinationCategory ||
      !categorizedTasks[destinationCategory]
    ) {
      toast.error("Not allowed!");
      return;
    }

    if (sourceCategory !== destinationCategory) {
      const movedTask = categorizedTasks[sourceCategory].find(
        (task) => task._id === active.id
      );

      // Update state to move the task
      setCategorizedTasks((prev) => ({
        ...prev,
        [sourceCategory]: prev[sourceCategory].filter(
          (task) => task._id !== active.id
        ),
        [destinationCategory]: [
          ...(prev[destinationCategory] || []),
          movedTask,
        ],
      }));

      // Call the mutation to update task category in the backend
      updateTaskCategory.mutate({
        taskId: active.id,
        category: destinationCategory,
      });
    }
  };

  const deleteTask = useMutation({
    mutationFn: async (taskId) => {
      await axiosSecure.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted!");
    },
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(categorizedTasks).map((category) => (
          <Droppable key={category} id={category}>
            <h2 className="font-bold text-lg mb-4 p-2 bg-gray-200 rounded-md shadow-md">
              {category}
            </h2>

            <SortableContext
              items={categorizedTasks[category].map((task) => task._id)}
            >
              <ul className="min-h-[200px] min-w-[300px] border border-black/10 p-2 space-y-2 rounded-xl">
                {categorizedTasks[category].map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onDelete={(taskId) => deleteTask.mutate(taskId)}
                  />
                ))}
              </ul>
            </SortableContext>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
};

export default Tasklist;
