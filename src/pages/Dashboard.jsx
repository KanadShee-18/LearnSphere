import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="text-white mt-14 relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />

      <div className="h-[calc(100vh-3.5rem)] overflow-auto w-full">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
