import { useEffect, useState } from "react";
import { formatDate } from "../lib/utils";
import { usePackageStore } from "../store/usePackageStore";

const LastProduced = () => {
  const { getLastProduced, lastProduced } = usePackageStore();

  useEffect(() => {
    getLastProduced();
  }, [getLastProduced]);


  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="pl-3">Date</th>
            <th className="pr-3">Quality</th>
            <th className="p-3">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if lastProduced is an array and has data */}
          {Array.isArray(lastProduced) && lastProduced.length > 0 ? (
            lastProduced.map((q, index) => (
              <tr key={index} className="text-[#5E5E5E]">
                <td className="pl-3">{formatDate(q.date)}</td>
                <td className="pr-3">{q.name}</td>
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
  );
};

export default LastProduced;
