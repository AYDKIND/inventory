import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
import DispatchModal from "../components/Modals/DispatchModal";
import Prev from "../components/Prev";
import Next from "../components/Next";

const ITEMS_PER_PAGE = 10; 

const DispatchFirm = () => {
  const { getPendingOrdersOfSelectedFirmId, pendingOrdersOfSelectedFirmId } =
    useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    getPendingOrdersOfSelectedFirmId(id);
  }, [getPendingOrdersOfSelectedFirmId]);


  const filteredOrders = pendingOrdersOfSelectedFirmId.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${
      ord?.transport
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 📊 Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevClick = () => {
    navigate(`/dispatch/firms`);
  };
  const handleNextClick = (id) => {
    setOrderId(id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* 🏷️ Heading */}
      <div className="w-full max-w-4xl mb-10 flex items-center gap-8">
        <div className="w-3 h-3">
          <button
            className="btn btn-circle  w-6 h-6 bg-gray-200"
            onClick={() => {
              handlePrevClick();
            }}
          >
            <Prev />
          </button>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{paginatedData[0]?.firm}</h1>
          <p className="text-gray-500">Select the order to Dispatch</p>
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
              setCurrentPage(1);
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
              <th className="p-3">Agent</th>
              <th className="p-3">quality Name</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((order, index) => (
                <tr key={index} className="text-[#5E5E5E] ">
                  <td className="p-3">{order.agent}</td>
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.rate}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="pl-3">
                    <button
                      className="btn btn-circle  w-6 h-6 bg-gray-200"
                      onClick={() => {
                        handleNextClick(order._id);
                      }}
                    >
                      <Next />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
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

{orderId && <DispatchModal orderId={orderId} onClose={() => setOrderId(null)} />}
    </div>
  );
};

export default DispatchFirm;
