import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.js";
import { Outlet } from "react-router-dom";

const App = () => {
  const { authUser } = useAuthStore();

  return (
    <>
      <Toaster />
      <div className="flex h-screen gap-10">
        {authUser && (
          <div className="w-1/5 h-screen fixed left-0 top-0  text-white">
            <Sidebar />
          </div>
        )}
        <div
          className={`flex-1 ${
            authUser ? "ml-[calc(100vw/5)]" : "ml-0"
          } overflow-y-auto`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
