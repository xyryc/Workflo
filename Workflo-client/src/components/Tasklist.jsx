import { useContext, useState, useEffect } from "react";
import {
  DndContext,
  useSensors,
  useSensor,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  rectIntersection,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

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
  const [categorizedTasks, setCategorizedTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/tasks?email=${user?.email}`);
      return data;
    },
  });

  useEffect(() => {
    if (tasks.length > 0) {
      setCategorizedTasks({
        "To-Do": tasks
          .filter((task) => task.category === "To-Do")
          .sort((a, b) => a.order - b.order), // Sort by order

        "In Progress": tasks
          .filter((task) => task.category === "In Progress")
          .sort((a, b) => a.order - b.order), // Sort by order

        Done: tasks
          .filter((task) => task.category === "Done")
          .sort((a, b) => a.order - b.order), // Sort by order
      });
    }
  }, [tasks]);

  // update task orer and category
  const updateTask = useMutation({
    mutationFn: async ({ taskId, newCategory, tasks }) => {
      return await axiosSecure.put(`/tasks/update-order-category`, {
        taskId,
        newCategory,
        tasks,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task moved successfully!");
    },
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceCategory = Object.keys(categorizedTasks).find((cat) =>
      categorizedTasks[cat]?.some((task) => task._id === active.id)
    );
    const destinationCategory = over.id.startsWith("task_")
      ? sourceCategory
      : over.id; // Ensure it's a valid category

    if (!sourceCategory || !destinationCategory) {
      toast.error("Invalid move!");
      return;
    }

    // Get the moved task
    const movedTask = categorizedTasks[sourceCategory].find(
      (task) => task._id === active.id
    );
    if (!movedTask) return;

    // Remove the task from the source category
    let updatedSourceTasks = categorizedTasks[sourceCategory].filter(
      (task) => task._id !== active.id
    );

    // Prevent duplicate addition to the destination
    let updatedDestinationTasks = categorizedTasks[destinationCategory].filter(
      (task) => task._id !== active.id
    );

    // Add the task to the destination category
    updatedDestinationTasks = [
      ...updatedDestinationTasks,
      { ...movedTask, category: destinationCategory },
    ];

    // Recalculate the order for the destination category
    updatedDestinationTasks.forEach((task, index) => {
      task.order = index;
    });

    // Update state with correctly modified lists
    setCategorizedTasks((prev) => ({
      ...prev,
      [sourceCategory]: updatedSourceTasks,
      [destinationCategory]: updatedDestinationTasks,
    }));

    // Send update to the backend
    updateTask.mutate({
      taskId: active.id,
      newCategory: destinationCategory,
      tasks: updatedDestinationTasks.map(({ _id, order }) => ({ _id, order })),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(categorizedTasks).map((category) => (
          <Droppable key={category} id={category}>
            <h2 className="font-bold text-lg mb-4 p-2 rounded-md shadow-md text-neutral-800">
              {category}
            </h2>

            <SortableContext
              items={categorizedTasks[category].map((task) => task._id)}
            >
              <ul className="min-h-[200px] min-w-[300px] border border-black/10 p-2 space-y-2 rounded-xl">
                {categorizedTasks[category].map((task) => (
                  <TaskItem key={task._id} task={task} />
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
