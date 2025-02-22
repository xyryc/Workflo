import { useContext } from "react";
import TaskForm from "../components/TaskForm";
import Tasklist from "../components/Tasklist";
import { AuthContext } from "../providers/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center gap-6 h-screen py-10 container mx-auto px-4">
      <h2 className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight first:mt-0">
        Hello, {user?.displayName || "Anonymous"}. Let's make today productive!
      </h2>
      <TaskForm />
      <Tasklist />

      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Usage: Drag the task until the area's background turns blue, then drop
        it.
      </blockquote>
    </div>
  );
};

export default Dashboard;
