import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatchStore } from "../../store/useDispatchStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const DispatchModal = ({ orderId, onClose }) => {
  const { getPendingOrderById, selectedOrder, dispatchOrder, getPendingOrdersOfSelectedQualityId,
    getPendingOrdersOfSelectedFirmId } = useDispatchStore();
  const { id } = useParams();
  const location = useLocation();

  // Initialize formData with empty strings to ensure controlled inputs from the start
  const [formData, setFormData] = useState({
    selectedQuality: "",
    selectedAgent: "",
    selectedFirm: "",
    selectedTransport: "",
    pendingQuantity: "",
    dispatchQuantity: "",
    rate: "",
    poNumber: "",
    remark: "",
  });

  console.log(orderId);

  useEffect(() => {
    if (orderId) {
      getPendingOrderById(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (selectedOrder) {
      setFormData({
        selectedQuality: selectedOrder?.quality || "",
        selectedAgent: selectedOrder?.agent || "",
        selectedFirm: selectedOrder?.firm || "",
        selectedTransport: selectedOrder?.transport || "",
        pendingQuantity: selectedOrder?.pendingQuantity || "",
        dispatchQuantity: "",
        invoiceNumber: "",
        rate: selectedOrder?.rate || "",
        remark: selectedOrder?.remark || "",
      });
    }
  }, [selectedOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "dispatchQuantity" ? Number(value) || "" : value,
    }));
  };

  const truncateId = (id) => `${id.slice(0, 5)}...${id.slice(-5)}`;

  const timestamp = Date.now();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dispatchQuantity, invoiceNumber, remark } = formData;

    if (!dispatchQuantity || dispatchQuantity <= 0 || dispatchQuantity > formData.pendingQuantity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await dispatchOrder(orderId, { dispatchQuantity, invoiceNumber, remark });

      if (location.pathname.startsWith("/dispatch/firms")) {
        await getPendingOrdersOfSelectedFirmId(id);
      }
      if (location.pathname.startsWith("/dispatch/quality")) {
        await getPendingOrdersOfSelectedQualityId(id);
      }
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      selectedQuality: "",
      selectedAgent: "",
      selectedFirm: "",
      selectedTransport: "",
      pendingQuantity: "",
      dispatchQuantity: "",
      rate: "",
      poNumber: "",
      remark: "",
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#00000055] ${
        orderId ? "" : "hidden"
      } z-40 overflow-y-scroll`}
    >
      <div className="h-9/10 w-7/10 p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-black text-2xl">
            Dispatch for #{truncateId(orderId)}
          </h2>
          <div className="flex gap-3 items-center">
            <p className="text-gray-500 relative pt-2.5">
              {formatDate(timestamp)}
            </p>
            <button
              onClick={handleClose}
              className="h-6 w-6 text-2xl text-gray-500 hover:text-gray-700 bg-black rounded-2xl flex items-center pl-1 pb-1"
            >
              &times;
            </button>
          </div>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Agent Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                type="text"
                value={formData.selectedAgent}
                readOnly
              />
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Firm Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                type="text"
                value={formData.selectedFirm}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Quality
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                type="text"
                value={formData.selectedQuality}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Rate
              </label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Pending Qty
              </label>
              <input
                type="number"
                value={formData.pendingQuantity}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Transport Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-[#F8F8F8]"
                type="text"
                value={formData.selectedTransport}
                readOnly
              />
            </div>

            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Invoice Number *
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>

            <div>
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Dispatch Quantity *
              </label>
              <input
                type="number"
                name="dispatchQuantity"
                value={formData.dispatchQuantity}
                min={1}
                max={formData.pendingQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-[#F8F8F8] rounded-md text-black"
              />
            </div>
          </div>

          <div className="w-full h-[120px] gap-4 mb-10">
            <div className="h-full gap-4">
              <label className="mb-1 text-sm font-medium text-gray-700 block">
                Remark
              </label>
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
              Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchModal;
