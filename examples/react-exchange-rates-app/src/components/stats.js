import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db, realtime } from "../configs/altogic";
import { sortArray } from "../helper/functions";

export default function Stats() {
  const [exchangeRates, setExchangeRates] = useState([]);

  const updateRates = ({ message }) => {
    toast.success("Rates are updated.");
    setExchangeRates(message);
  };

  useEffect(() => {
    db.model("exchange_rates")
      .get()
      .then(({ data }) => setExchangeRates(data));

    realtime.join("rates");

    realtime.on("update", updateRates);

    return () => {
      realtime.leave("rates");
      realtime.off("update");
    };
  }, []);

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {exchangeRates?.sort(sortArray).map((item) => (
        <div
          key={item.name}
          className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
        >
          <dt className="text-sm font-medium text-gray-500 truncate mb-6">
            {item.name}
          </dt>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Buying Rate
            </dt>
            <dt className="text-sm font-medium text-gray-500 truncate">
              Selling Rate
            </dt>
          </div>
          <div className="flex justify-between">
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {item.buyingRate}
            </dd>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {item.sellingRate}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
