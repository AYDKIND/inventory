import { useState } from "react";
import SettingsModal from "./Modals/SettingsModal";
import { useSettingStore } from "../store/useSettingStore.js";

const ITEMS_PER_PAGE = 4;

const TableSection = ({ title, hasStock }) => {
  const data = useSettingStore((state) => state[title.toLowerCase()]);
  const { quality, agent, firm, transport } = useSettingStore();

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const { addEntry, deleteEntry, editEntry } = useSettingStore();

  const sortedData = [...data].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true });
});
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const paginatedData = sortedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const emptyRows = Math.max(0, ITEMS_PER_PAGE - paginatedData.length);

  const truncateId = (id) => `${id.slice(0, 5)}...${id.slice(-2)}`;

  const handleAdd = (formData) => {
    addEntry(title.toLowerCase(), formData);
    setIsModalOpen(false);
  };

  const handleEdit = (formData) => {
    editEntry(title.toLowerCase(), formValues._id, formData); // Pass the _id to identify which entry to edit
    setIsModalOpen(false);
  };

  const getFieldsForSchema = (schema) => {
    switch (schema.toLowerCase()) {
      case "agent":
        return [{ name: "name", label: "Name", placeholder: "Enter name" }];

      case "firm":
        return [
          { name: "name", label: "Name", placeholder: "Enter firm name" },
          {
            name: "agent",
            label: "Agent",
            placeholder: "Select agent",
            type: "dropdown",
            options: agent.map((agent) => ({
              value: agent._id,
              label: agent.name,
            })),
          },
        ];

      case "transport":
        return [
          { name: "name", label: "Name", placeholder: "Enter transport name" },
          {
            name: "firm",
            label: "Firm",
            placeholder: "Select firm",
            type: "dropdown",
            options: firm.map((firm) => ({
              value: firm._id,
              label: firm.name,
            })),
          },
        ];

      case "quality":
        return [
          { name: "name", label: "Name", placeholder: "Enter name" },
          {
            name: "description",
            label: "Description",
            placeholder: "Enter description",
          },
          {
            name: "inStock",
            label: "In Stock",
            placeholder: "Enter stock",
            type: "number",
          },
          {
            name: "produced",
            label: "Produced",
            placeholder: "Enter produced quantity",
            type: "number",
          },
          {
            name: "dispatched",
            label: "Dispatched",
            placeholder: "Enter dispatched quantity",
            type: "number",
          },
        ];

      default:
        return [];
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="pt-5 pl-5 text-xl font-bold">{title}</h2>
        <button
          className="bg-red-300 text-red-700 px-4 py-2 rounded-md"
          onClick={() => {
            setIsModalOpen(true);
            setFormValues(null); // Clear formValues for new entry
          }}
        >
          Add {title}
        </button>
      </div>
      <div className=" bg-white shadow-md rounded-lg overflow-hidden">
        <table className="flex-col w-full text-left border-collapse">
          <thead className="font-extralight text-sm">
            <tr>
              <th className="p-3">{title} ID</th>
              <th className="p-3">{title} Name</th>
              {hasStock && <th className="p-3">In Stock</th>}
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            className="overflow-y-auto text-[#5E5E5E]"
            style={{ height: "200px" }}
          >
            {Array.isArray(paginatedData) && paginatedData.map((item, index) => (
              <tr key={index} className="">
                <td className="px-3">#{truncateId(item._id)}</td>
                <td className="px-3">{item.name}</td>
                {hasStock && <td className="p-3">{item.inStock || "-"}</td>}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    className="bg-green-200 text-green-700 px-3 rounded-md"
                    onClick={() => {
                      setIsModalOpen(true);
                      setFormValues(item); // Set the form values to the current item values
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-200 text-red-700 px-3 rounded-md"
                    onClick={() => {
                      const id = item._id; // Get the ID of the item to delete
                      deleteEntry(title.toLowerCase(), id); // Call deleteEntry with the type and the item ID
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${page}-${index}`} className="">
                <td className="p-3 text-gray-300">-</td>
                <td className="p-3 text-gray-300">-</td>
                {hasStock && <td className="p-3 text-gray-300">-</td>}
                <td className="p-3 text-gray-300">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-center">
        {totalPages > 1 && (
          <div className="mt-4 flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1 rounded ${
                  p === page ? "bg-red-500 text-white" : "text-gray-700"
                }`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SettingsModal
          onClose={() => setIsModalOpen(false)}
          onSave={formValues ? handleEdit : handleAdd} // Decide whether to edit or add based on formValues
          fields={getFieldsForSchema(title)}
          initialValues={formValues} // Pass initialValues to pre-fill the form
        />
      )}
    </div>
  );
};

export default TableSection;
