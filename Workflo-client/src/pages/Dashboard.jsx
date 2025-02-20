import TaskForm from "../components/TaskForm";
import Tasklist from "../components/Tasklist";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center gap-6 h-screen py-10">
      <h2>Your Workflo</h2>
      <TaskForm />
      <Tasklist />
    </div>
  );
};

export default Dashboard;
