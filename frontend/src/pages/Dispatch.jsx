import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dispatch = () => {
  const navigate = useNavigate();

  const handleDispatchByQuality = () => {
    navigate("/dispatch/qualities"); 
  };

  const handleDispatchByFirm = () => {
    navigate("/dispatch/firms"); 
  };

  const handleShowAllDispatches = () => {
    navigate("/dispatches");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold">Dispatch</h1>
        <p className="text-gray-500">Select the option to Dispatch</p>
      </div>

      {/* Search Bar & Add Order Button
      <div className="w-full max-w-4xl h-10 flex justify-between items-center mb-4">
        <div className="w-1/3 flex max-w-xl h-full rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none text-gray-400"
            // value={searchTerm}
            // onChange={(e) => {
            //   setSearchTerm(e.target.value);
            //   setCurrentPage(1); // Reset to first page on search
            // }}
          />
          <div className="h-full flex items-center mr-4">
            <Search className="text-gray-400" />
          </div>
        </div>
        {/* <button className="bg-red-300 text-[#C0282E] font-semibold px-4 py-2 rounded-lg">
          + Add Order
        </button> 
      </div> */}

     
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <button
          className="w-full p-4 text-lg font-semibold bg-gray-100 rounded-lg"
          onClick={handleShowAllDispatches}
        >
          Show All Dispatches
        </button>
        <hr className="border-gray-300" />
        <button
          className="w-full p-4 text-lg font-semibold bg-gray-100 rounded-lg"
          onClick={handleDispatchByQuality}
        >
          Dispatch by Quality
        </button>
        <button
          className="w-full p-4 text-lg font-semibold bg-gray-100 rounded-lg"
          onClick={handleDispatchByFirm}
        >
          Dispatch by Firm
        </button>
      </div>
    </div>
  );
};

export default Dispatch;
