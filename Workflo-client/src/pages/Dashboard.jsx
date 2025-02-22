import ActivityLog from "../components/ActivityLog";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import Tasklist from "../components/Tasklist";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center gap-6 h-screen py-4 container mx-auto px-4">
      <Navbar />

      <div className="flex items-center gap-4">
        <TaskForm />
        <ActivityLog />
      </div>

      <Tasklist />

      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Usage: Drag the task until the area's background turns blue, then drop
        it.
      </blockquote>
    </div>
  );
};

export default Dashboard;
