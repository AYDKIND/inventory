import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { usePackageStore } from "../store/usePackageStore";

const ITEMS_PER_PAGE = 10; 

const Summary = () => {
  const { getQuality, quality } = usePackageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getQuality();
  }, [getQuality]);

  const sortedQuality = [...quality].sort((a, b) => {
    const extractNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);

    if (nameA === nameB) return numA - numB;
    return nameA.localeCompare(nameB, undefined, { numeric: true });
  });

  // Filter data based on search term
  const filteredQuality = sortedQuality.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages dynamically based on filtered results
  const totalPages = Math.ceil(filteredQuality.length / ITEMS_PER_PAGE);

  // Paginate the filtered data
  const paginatedData = filteredQuality.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Heading */}
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold">Summary Table</h1>
        <p className="text-gray-500">For all Qualities</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-4xl h-10 flex justify-between items-center mb-4">
        <div className="w-1/3 flex max-w-xl h-full rounded-lg bg-white ">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none text-gray-400"
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
      </div>

      {/* Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="text-left">
              <th className="p-3">Quality Name</th>
              <th className="p-3">In Stock</th>
              <th className="p-3">Dispatched</th>
              <th className="p-3">Produced</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((q, index) => (
                <tr key={index} className="text-[#5E5E5E]">
                  <td className="p-3">{q.name}</td>
                  <td className="p-3">{q.inStock}</td>
                  <td className="p-3">{q.dispatched}</td>
                  <td className="p-3">{q.produced}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default Summary;