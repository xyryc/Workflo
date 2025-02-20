import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Tasklist = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/tasks");
      return data;
    },
  });

  // Categorize tasks based on category
  const categorizedTasks = {
    "To-Do": tasks.filter((task) => task.category === "todo"),
    "In Progress": tasks.filter((task) => task.category === "in_progress"),
    Done: tasks.filter((task) => task.category === "done"),
  };

  return (
    <div className="flex gap-4">
      {Object.keys(categorizedTasks).map((category) => (
        <div key={category} className="border p-4 rounded-lg">
          <h2 className="font-bold text-lg">{category}</h2>
          <ul>
            {categorizedTasks[category].map((task) => (
              <li key={task._id} className="p-2 border border-black">
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Tasklist;
