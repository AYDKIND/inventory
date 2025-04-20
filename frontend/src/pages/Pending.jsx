import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { formatDate } from "../lib/utils";

const ITEMS_PER_PAGE = 10; 

const Pending = () => {
  const { getPendingOrders, pendingOrders } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);



  const filteredOrders = pendingOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${ord?.transport}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );



  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* 🏷️ Heading */}
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold">Pending Orders</h1>
        <p className="text-gray-500">Pending</p>
      </div>

      {/* 🔍 Search Bar & ➕ Add Order */}
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
        {/* <button className="bg-red-300 text-[#C0282E] font-semibold px-4 py-2 rounded-lg">
          + Add Order
        </button> */}
      </div>

      {/* 📋 Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="text-left">
              <th className="p-3">Date</th>
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
                  <td className="p-3">{formatDate(order.date)}</td>
                  <td className="p-3">{order.agent}</td>
                  <td className="p-3">{order.firm}</td>
                  <td className="p-3">{order.rate }</td>
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.pendingQuantity}</td>
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

export default Pending;
