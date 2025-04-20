import React, { useState, useEffect } from "react";

const SettingsModal = ({ onClose, onSave, fields, initialValues }) => {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-[#00000055] z-2">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg z-10">
        <h2 className="text-xl font-semibold mb-4">{initialValues ? "Edit Entry" : "Add New Entry"}</h2>
        <div className="grid gap-4">
          {fields.map(({ name, type, placeholder, options }, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={name} className="text-sm font-medium">
                {name}
              </label>
              {type === "dropdown" ? (
                <select
                  id={name}
                  value={formValues[name] || ""}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="border rounded-md p-2"
                >
                  <option value="">{placeholder}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  type={type || "text"}
                  placeholder={placeholder}
                  value={formValues[name] || ""}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="border rounded-md p-2"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
