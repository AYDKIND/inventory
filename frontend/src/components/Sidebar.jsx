import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import NewPackageModal from "./Modals/NewPackageModal";
import NewOrderModal from "./Modals/NewOrderModal";
import home from "../assets/home.svg"; 
import logo from "../assets/logo.png";
import dispatch from "../assets/dispatch.svg";
import pending from "../assets/pending.svg";
import summary from "../assets/summary.svg";
import newOrder from "../assets/newOrder.svg";
import newPack from "../assets/newPack.svg";
import logoutIcon from "../assets/logout.svg";
import Settings from "../assets/settings.svg";

const Sidebar = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-red-300 text-red-500"
      : "bg-[#f8f8f8] text-black";

  return (
    <div className="w-1/5 h-screen fixed left-0 top-0 flex flex-col ">
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="Home"
          className="w-34"
        />
      </div>

      <div className="w-full h-4/5  flex flex-col justify-around gap-20 ">
        <div className="h-2/3 w-full flex-col gap-12">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
                isActive ? "bg-red-300" : "bg-[#110505]"
              }`
            }
          >
            <img
              src={home}
              alt="Home"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter:
                  location.pathname === "/"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname === "/" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Home
            </div>
          </NavLink>

          <NavLink
            to="/dispatch"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
                isActive || location.pathname.startsWith("/dispatch")
                  ? "bg-red-300"
                  : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={dispatch}
              alt="Dispatch"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter: location.pathname.startsWith("/dispatch")
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname.startsWith("/dispatch")
                  ? "text-red-500"
                  : "text-black"
              } lg:block`}
            >
              Dispatch
            </div>
          </NavLink>

          <NavLink
            to="/pending"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={pending}
              alt="Pending"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter:
                  location.pathname === "/pending"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname === "/pending" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Pending
            </div>
          </NavLink>

          <NavLink
            to="/summary"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 rounded-lg flex items-center ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={summary}
              alt="Summary"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter:
                  location.pathname === "/summary"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname === "/summary" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Summary
            </div>
          </NavLink>
        </div>

        <div className="h-2/3 w-full flex-col">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={Settings}
              alt="Settings"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter:
                  location.pathname === "/settings"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname === "/settings"
                  ? "text-red-500"
                  : "text-[#5E5E5E]"
              } lg:block`}
            >
              Settings
            </div>
          </NavLink>

          <div
            className={`h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
              openOrderModal ? "bg-red-300" : "bg-[#f8f8f8] cursor-pointer"
            }`}
            onClick={() => setOpenOrderModal(true)}
          >
            <img
              src={newOrder}
              alt="New Order"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter: openOrderModal
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                openOrderModal ? "text-red-500" : "text-[#5E5E5E]"
              } lg:block`}
            >
              New Order
            </div>
          </div>

          <div
            className={`h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
              openPackageModal ? "bg-red-300" : "bg-[#f8f8f8] cursor-pointer"
            }`}
            onClick={() => setOpenPackageModal(true)}
          >
            <img
              src={newPack}
              alt="New Packaging"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter: openPackageModal
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                openPackageModal ? "text-red-500" : "text-[#5E5E5E]"
              } lg:block`}
            >
              New Packaging
            </div>
          </div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
            onClick={logout}
          >
            <img
              src={logoutIcon}
              alt="New Packaging"
              className="w-4 h-4 sm:relative left-16"
              style={{
                filter:
                  location.pathname === "/login"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={`hidden font-medium font-inter relative left-20 ${
                location.pathname === "/login"
                  ? "text-red-500"
                  : "text-[#5E5E5E]"
              } lg:block`}
            >
              Logout
            </div>
          </NavLink>

          {openPackageModal && (
            <NewPackageModal
              openPackageModal
              onClose={() => setOpenPackageModal(false)}
            />
          )}

          {openOrderModal && (
            <NewOrderModal
              openOrderModal
              onClose={() => setOpenOrderModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
