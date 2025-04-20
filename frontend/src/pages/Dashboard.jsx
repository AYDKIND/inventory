import { useState, useEffect } from "react";
import { Clock, Send, Edit } from "lucide-react";
import SummaryCard from "../components/SummaryCard.jsx";
import WeeklyDispatchGraph from "../components/WeeklyDispatchGraph.jsx";
import LastProduced from "../components/LastProduced.jsx";
import { useOrderStore } from "../store/useOrderStore.js";
import { useDispatchStore } from "../store/useDispatchStore.js";

const Dashboard = () => {
  const { getPendingOrders, pendingOrders } = useOrderStore();
  const { getDispatchedOrders, dispatchedOrders } = useDispatchStore();

  useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);

  useEffect(() => {
    getDispatchedOrders();
  }, [getDispatchedOrders]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center z-0">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to Admin Dashboard</p>
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-4xl flex gap-4 mb-6">
        {/* Pending Orders Card */}
        <SummaryCard
          icon={<Clock className="text-red-400" size={32} />}
          title="Total Pending Orders"
          value={pendingOrders.length}
          navigateTo="/pending"
        />

        {/* Dispatched Orders Card */}
        <SummaryCard
          icon={<Send className="text-red-400" size={32} />}
          title="Total Dispatched Orders"
          value={dispatchedOrders.length}
          navigateTo="/dispatches"
        />

       <SummaryCard
          icon={<Edit className="text-red-400" size={32} />}
          title="Show/Edit Orders"
          value={null}
          navigateTo="/order-history"
        />
      </div>

      
      <WeeklyDispatchGraph />

     
      <LastProduced />
    </div>
  );
};

export default Dashboard;
