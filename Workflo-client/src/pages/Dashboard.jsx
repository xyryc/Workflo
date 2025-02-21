import TaskForm from "../components/TaskForm";
import Tasklist from "../components/Tasklist";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center gap-6 h-screen py-10 container mx-auto">
      <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Your Workflo
      </h2>
      <TaskForm />
      <Tasklist />
    </div>
  );
};

export default Dashboard;
