import React, { useState, useEffect } from "react";
import { useOrderStore } from "../../../src/store/useOrderStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const NewOrderModal = ({ openOrderModal, onClose }) => {
  const { fetchOrderData, createOrder, quality, agent, firm, transport, getPendingOrders } = useOrderStore();
  const [formData, setFormData] = useState({
    selectedQuality: "",
    selectedAgent: "",
    selectedFirm: "",
    selectedTransport: "",
    quantity: "",
    rate: "",
    poNumber: "",
    remark: "",
  });

  const [filteredFirms, setFilteredFirms] = useState([]);
  const [filteredTransport, setFilteredTransport] = useState([]);
  const timestamp = Date.now();
  
  useEffect(() => {
    if (openOrderModal) {
      fetchOrderData();
    }
  }, [fetchOrderData, openOrderModal]);


  useEffect(() => {
    if (formData.selectedAgent) {
      const filtered = firm.filter(
        (f) => f.agent && f.agent._id.toString() === formData.selectedAgent
      );
      setFilteredFirms(filtered);
      setFormData((prevData) => ({
        ...prevData,
        selectedFirm: "", 
        selectedTransport: "",  
      }));
    } else {
      setFilteredFirms(firm);
      setFormData((prevData) => ({
        ...prevData,
        selectedFirm: "",  
        selectedTransport: "", 
      }));
    }
  }, [formData.selectedAgent, firm]);

 
  useEffect(() => {
    if (formData.selectedFirm) {
      const filtered = transport.filter(
        (t) => t.firm && t.firm._id.toString() === formData.selectedFirm
      );
      setFilteredTransport(filtered);
      setFormData((prevData) => ({
        ...prevData,
        selectedTransport: "",  
      }));
    } else {
      setFilteredTransport(transport);
      setFormData((prevData) => ({
        ...prevData,
        selectedTransport: "", 
      }));
    }
  }, [formData.selectedFirm, transport]);


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

  const sortedAgents = agent.sort((a, b) => a.name.localeCompare(b.name));
  const sortedFirms = filteredFirms.sort((a, b) => a.name.localeCompare(b.name));
  const sortedTransport = filteredTransport.sort((a, b) => a.name.localeCompare(b.name));

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { selectedQuality, selectedAgent, selectedFirm, selectedTransport, quantity, rate } = formData;
    if (!selectedQuality || !selectedAgent || !selectedFirm || !selectedTransport || !quantity || quantity <= 0 || !rate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    await createOrder(formData);
    await getPendingOrders();

    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      selectedQuality: "",
      selectedAgent: "",
      selectedFirm: "",
      selectedTransport: "",
      quantity: "",
      rate: "",
      poNumber: "",
      remark: "",
    });
  };

  return (
    <div className={`h-full fixed inset-0 flex items-center justify-center bg-[#00000055] ${openOrderModal ? "" : "hidden"} z-1000 overflow-y-scroll`}>
      <div className="h-9/10 w-7/10 p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-black text-2xl">Create new Order</h2>
          <div className="flex gap-3 items-center">
            <p className="text-gray-500 relative pt-2.5">{formatDate(timestamp)}</p>
            <button onClick={handleClose} className="h-6 w-6 text-2xl text-gray-500 hover:text-gray-700 bg-black rounded-2xl flex items-center pl-1 pb-1">
              &times;
            </button>
          </div>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">Agent Name *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                name="selectedAgent"
                value={formData.selectedAgent}
                onChange={handleChange}
              >
                <option value="" disabled>Select agent</option>
                {sortedAgents.map((a, index) => (
                  <option key={index} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">Firm Name *</label>
              {filteredFirms.length === 0 ? (
                <option value="" disabled>
                  No firm linked to selected agents
                </option>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                  name="selectedFirm"
                  value={formData.selectedFirm}
                  onChange={handleChange}
                  disabled={!formData.selectedAgent}
                >
                  <option value="" disabled>Select firm</option>
                  {sortedFirms.map((f, index) => (
                    <option key={index} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">Quality *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                name="selectedQuality"
                value={formData.selectedQuality}
                onChange={handleChange}
              >
                <option value="" disabled>Select a quality</option>
                {sortedQuality.map((q, index) => (
                  <option key={index} value={q._id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">Quantity *</label>
              <input
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="mb-1 text-sm font-medium text-gray-700 block">Transport *</label>
              {filteredTransport.length === 0 ? (
               <option value="" disabled>
               No transport linked to selected firm
             </option>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                  name="selectedTransport"
                  value={formData.selectedTransport}
                  onChange={handleChange}
                  disabled={!formData.selectedAgent || !formData.selectedFirm}
                >
                  <option value="" disabled>Select transport</option>
                  {sortedTransport.map((t, index) => (
                    <option key={index} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="w-1/3">
              <label className="mb-1 text-sm font-medium text-gray-700 block">Rate *</label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>
            <div className="w-1/3">
              <label className="mb-1 text-sm font-medium text-gray-700 block">PO Number</label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>
          </div>
          <div className="w-full h-[150px] gap-4 mb-10">
            <div className="h-full gap-4">
              <label className="mb-1 text-sm font-medium text-gray-700 block">Remark</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                className="h-full w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[#C0282E] font-semibold border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#C0282E] text-white rounded-md hover:bg-red-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
