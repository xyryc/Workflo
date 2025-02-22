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
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";

const ActivityLog = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch task by id
  const { data: activities = [], refetch } = useQuery({
    queryKey: ["activities", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/activity/${user?.email}`);
      return data;
    },
  });

  // Refetch data when dialog opens
  const handleDialogOpen = (open) => {
    setIsOpen(open);
    if (open) {
      refetch();
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          <Button>Activity Log</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription className="max-h-[300px] overflow-y-auto">
              {activities?.map((item) => (
                <span
                  className="grid grid-cols-3 items-center gap-2 text-left py-0.5"
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
