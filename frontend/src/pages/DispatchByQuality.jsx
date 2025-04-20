import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
import { formatDate } from "../lib/utils";
import Prev from "../components/Prev";
import Next from "../components/Next";

const ITEMS_PER_PAGE = 10; 

const DispatchByQuality = () => {
  const { getPendingOrders, pendingOrders } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);


  const filteredOrders = pendingOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${
      ord?.transport
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

 
  const uniqueQualities = Array.from(
    new Map(
      filteredOrders.map((order) => [order.quality, order.qualityId])
    ).entries()
  );

  const sortedQualities = uniqueQualities.sort((a, b) => {
    const qualityA = a[0].toLowerCase();
    const qualityB = b[0].toLowerCase();
    return qualityA < qualityB ? -1 : qualityA > qualityB ? 1 : 0; 
  });

  
  const totalPages = Math.ceil(sortedQualities.length / ITEMS_PER_PAGE);
  const paginatedData = sortedQualities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevClick = () => {
    navigate(`/dispatch`);
  };

  const handleQualityClick = (id) => {
    navigate(`/dispatch/qualities/${id}`);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
 
      <div className="w-full max-w-4xl mb-10 flex items-center gap-8">
        <button
          className="btn btn-circle  w-6 h-6 bg-gray-200"
          onClick={() => {
            handlePrevClick();
          }}
        >
          <Prev />
        </button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Dispatch By Quality</h1>
          <p className="text-gray-500">Select a quality to Dispatch</p>
        </div>
      </div>

      
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div className="w-1/3 flex max-w-xl h-10 rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
          />
          <div className="h-full flex items-center mr-4">
            <Search className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 ">
              <th className="p-3">Quality Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(([quality, id], index) => (
                <tr
                  key={index}
                  className="text-[#5E5E5E] border-b border-gray-200 flex justify-between"
                >
                  <td className="p-3">{quality}</td>
                  <td className="p-3">
                    <button
                      className="btn btn-circle  w-6 h-6 bg-gray-200"
                      onClick={() => {
                        handleQualityClick(id);
                      }}
                    >
                      <Next />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    
      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === currentPage ? "bg-red-500 text-white" : "text-gray-700"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DispatchByQuality;
