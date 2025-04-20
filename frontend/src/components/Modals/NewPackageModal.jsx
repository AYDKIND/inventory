import React, { useState, useEffect } from "react";
import { usePackageStore } from "../../../src/store/usePackageStore.js";
import { formatDate } from "../../lib/utils.js";

const NewPackageModal = ({ openPackageModal, onClose }) => {
  const { quality, getQuality, newPackage, getLastProduced } = usePackageStore();
  const [selectedQuality, setSelectedQuality] = useState(""); // Store quality ID
  const [quantity, setQuantity] = useState(""); // Store quantity input
  const timestamp = Date.now();

  useEffect(() => {
    if (openPackageModal) {
      getQuality(); // Fetch available quality options when modal opens
    }
  }, [openPackageModal, getQuality]);

  const sortedQuality = [...quality].sort((a, b) => {
    const extractNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
let A;
console.log(A)
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);

    if (nameA === nameB) return numA - numB;
    return nameA.localeCompare(nameB, undefined, { numeric: true });
  });

  const handleClose = () => {
    onClose();
    setSelectedQuality("");
    setQuantity(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedQuality,quantity)
    if (!selectedQuality || !quantity || quantity <= 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    await newPackage(selectedQuality, quantity); 
    await getQuality();
    await getLastProduced();
    handleClose(); 
  };

  
  

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[#00000055] ${openPackageModal ? "" : "hidden"} z-50`}>
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Create New Packaging</h2>
          <button
            onClick={handleClose}
            className="h-6 w-6 text-2xl text-gray-500 hover:text-gray-700 bg-black rounded-2xl flex items-center pl-1 pb-1"
          >
            &times;
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700 block">Created on:</label>
            <input
              type="text"
              value={formatDate(timestamp)}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700 block">Quality *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              value={selectedQuality} 
              onChange={(e) => setSelectedQuality(e.target.value)} 
            >
              <option value="" disabled>Select a quality</option>
              {sortedQuality.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.name} 
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700 block">Quantity *</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-[#C0282E] border border-gray-300 rounded-md">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-[#C0282E] text-white rounded-md hover:bg-red-600">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPackageModal;
