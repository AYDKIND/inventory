import React from "react";
import { useNavigate } from "react-router-dom"; 
import Next from "../components/Next";

const SummaryCard = ({ icon, title, value, navigateTo }) => {
  const navigate = useNavigate(); 

  const handleNavigation = () => {
    navigate(navigateTo);
  };

  return (
    <div className="flex-1 bg-white shadow-md rounded-lg p-6 flex items-center justify-between text-black">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-black">{title}</p>
        </div>
      </div>
      <button
        className="btn btn-circle w-6 h-6 bg-gray-200"
        onClick={handleNavigation}
      >
        <Next />
      </button>
    </div>
  );
};

export default SummaryCard;
