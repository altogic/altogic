import { useEffect, useState } from "react";
import { altogic } from "../helpers/altogic";
export function Pricing() {
  const [priceData, setPriceData] = useState([]);

  const getPriceData = async () => {
    let { data } = await altogic.endpoint.get("products");
    setPriceData(data.data);
    console.log(data);
  };

  const subscription = async (id) => {
    let { data } = await altogic.endpoint.post("subscription", {
      priceID: id,
    });

    window.location.href = data.url;
  };

  useEffect(() => {
    getPriceData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            Choose your plan
          </h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            We've got the right plan for you. Choose from our monthly or daily
            plan and get started today.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {priceData.map((plan) => (
            <div
              key={plan.id}
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {plan.nickname}
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  Start small and grow your business with our daily plan.
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.unit_amount / 100}
                  </span>{" "}
                  <span className="text-base font-medium text-gray-500">
                    / {plan.recurring.interval}
                  </span>
                </p>
                <a
                  data-id={plan.id}
                  key={plan.id}
                  href={plan.href}
                  onClick={() => {
                    subscription(plan.id);
                  }}
                  className="flex justify-center mt-8 w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900 hover:cursor-pointer"
                >
                  Buy {plan.nickname}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add centered full width card to display test credit card with number, expireDate, cvv */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            Test Credit Card
          </h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Use this test credit card to test your payment integration.
          </p>
          <div className="mt-8">
            <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <span className="text-md font-base text-gray-700">
                  When testing interactively, use a card number, such as{" "}
                  <strong>4242 4242 4242 4242</strong>. Enter the card number in
                  the Dashboard or in any payment form.
                  <br />
                  <br />
                  {/* Create an horizontal list */}
                  <ul className="list-disc list-inside">
                    <li>Use a valid future date, such as 12/34.</li>
                    <li>
                      Use any three-digit CVC (four digits for American Express
                      cards).
                    </li>
                    <li>Use any value you like for other form fields.</li>
                  </ul>
                  <br />
                  You can see more information about testing in Stripe docs.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
