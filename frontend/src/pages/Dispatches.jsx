import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatchStore } from "../store/useDispatchStore";
import Prev from "../components/Prev";
import Next from "../components/Next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

const Dispatches = () => {
  const { getDispatchedOrders, dispatchedOrders } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getDispatchedOrders();
  }, [getDispatchedOrders]);

  const filteredOrders = dispatchedOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${
      ord?.transport
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevClick = () => {
    navigate(`/dispatch`);
  };
  const handleButtonClick = () => {
    navigate(`/dispatch`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-semibold flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-10 flex items-center gap-8">
        <button
          className="btn btn-circle  w-6 h-6 bg-gray-200"
          onClick={() => {
            handlePrevClick();
          }}
        >
          <Prev />
        </button>
        <h1 className="text-3xl font-bold">All Dispatches</h1>
      </div>

      {/* Search Bar & Add Order Button */}

      <div className="w-full max-w-4xl h-10 flex justify-between items-center mb-4">
        <div className="w-1/3 flex max-w-xl h-full rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none font-light text-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
          <div className="h-full flex items-center mr-4">
            <Search className="text-gray-400" />
          </div>
        </div>
        <button
          className="bg-red-300 text-[#C0282E] font-semibold px-4 py-1 rounded-lg flex items-center gap-2 text-center"
          onClick={handleButtonClick}
        >
          <p className="text-3xl relative bottom-0.5">+</p> Dispatch
        </button>
      </div>

      {/* Dispatch Options */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="text-left">
              <th className="pl-1">Date</th>
              <th className="p-3">Agent</th>
              <th className="p-3">Firm Name</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Quality</th>
              <th className="p-3">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((order, index) => (
                <tr key={index} className="text-[#5E5E5E] ">
                  <td className="pl-1">{formatDate(order.dispatchedDate)}</td>
                  <td className="p-3">{order.agent}</td>
                  <td className="p-3">{order.firm}</td>
                  <td className="p-3">{order.rate}</td>
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.quantity}</td>
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

export default Dispatches;
