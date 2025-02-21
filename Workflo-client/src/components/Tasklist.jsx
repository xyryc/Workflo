import { useContext, useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Handle Drag End
  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log("Over ID:", over.id);
    console.log("Available Categories:", Object.keys(categorizedTasks));

    if (!over) return;

    const sourceCategory = Object.keys(categorizedTasks).find((cat) =>
      categorizedTasks[cat]?.some((task) => task._id === active.id)
    );

    const destinationCategory = over.id;

    console.log(categorizedTasks[destinationCategory]);

    if (
      !sourceCategory ||
      !destinationCategory ||
      !categorizedTasks[destinationCategory]
    ) {
      toast.error("Invalid drag operation:", {
        sourceCategory,
        destinationCategory,
      });
      return;
    }

    if (sourceCategory !== destinationCategory) {
      const movedTask = categorizedTasks[sourceCategory].find(
        (task) => task._id === active.id
      );

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

      updateTaskCategory.mutate({
        taskId: active.id,
        category: destinationCategory,
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        {Object.keys(categorizedTasks).map((category) => (
          <Droppable key={category} id={category}>
            <h2 className="font-bold text-lg mb-2">{category}</h2>
            <SortableContext
              items={categorizedTasks[category].map((task) => task._id)}
            >
              <div className="min-h-[200px] p-2 space-y-2">
                {categorizedTasks[category].map((task) => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
};

export default Tasklist;
