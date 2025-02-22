import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const ActivityLog = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Fetch task by id
  const { data: activities = [] } = useQuery({
    queryKey: ["activities", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/activity/${user?.email}`);
      return data;
    },
  });

  console.log(activities);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Activity Log</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription>
              {activities?.map((item) => (
                <span
                  className="grid grid-cols-3 gap-2 text-left"
                  key={item._id}
                >
                  <span className="col-span-2">{item?.activity}</span>

                  <span className="text-xs italic">
                    {new Date(item.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </span>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityLog;
