import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  createRoutesFromElements,
  Router,
  Route,
  Navigate,
} from "react-router-dom"; 
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dispatch from "./pages/Dispatch.jsx";
import Pending from "./pages/Pending.jsx";
import Settings from "./pages/Settings.jsx";
import Summary from "./pages/Summary.jsx";
import AllOrders from "./pages/AllOrders.jsx";
import Dispatches from "./pages/Dispatches.jsx";
import DispatchByQuality from "./pages/DispatchByQuality.jsx";
import DispatchByFirm from "./pages/DispatchByFirm.jsx";
import DispatchQuality from "./pages/DispatchQuality.jsx";
import DispatchFirm from "./pages/DispatchFirm.jsx";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import { useAuthStore } from "./store/useAuthStore.js";





function RoutesComponent() {
  const {authUser,checkAuth, isCheckingAuth, onlineUsers}=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser)return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  

  const appRoutes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/pending"
          element={authUser ? <Pending /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch"
          element={authUser ? <Dispatch /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatches"
          element={authUser ? <Dispatches /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch/qualities"
          element={authUser ? <DispatchByQuality /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch/qualities/:id"
          element={authUser ? <DispatchQuality /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch/firms"
          element={authUser ? <DispatchByFirm /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch/firms/:id"
          element={authUser ? <DispatchFirm /> : <Navigate to="/login" />}
        />
        <Route
          path="/summary"
          element={authUser ? <Summary /> : <Navigate to="/login" />}
        />
        <Route
          path="/order-history"
          element={authUser ? <AllOrders /> : <Navigate to="/login" />}
        />
      </Route>
    )
  );

  return <RouterProvider router={appRoutes} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RoutesComponent />
  </StrictMode>
);
