import React from "react";
import { altogic } from "../helpers/altogic";
import { useAuth } from "../contexts/Auth";

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = React.useState([]);
  const { setUser } = useAuth();

  async function getSubscriptions() {
    const response = await altogic.endpoint.get("subscription/list");
    setUser(response);
    // set subscriptions in state
    setSubscriptions(response.data.data);
  }

  // call handleCancelSubscription function
  async function handleCancelSubscription(subscriptionId) {
    const response = await altogic.endpoint.delete("subscription");
    setUser(response);
  }

  // call getSubscriptions function on component mount
  React.useEffect(() => {
    getSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            Subscriptions
          </h1>
          <p className="mt-5 text-2xl w-full text-center items-center text-gray-500 sm:text-center">
            Display plan of your subscriptions or purchases. View and display
            the status of your subscriptions and ancel your subscriptions if you
            want.
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mt-12 mx-auto">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-96 sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="flex items-center align-baseline px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Plan name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Subscription Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        End Date
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Operations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td
                          key={subscription.plan.nickname}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {subscription.plan.nickname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {/* Convert epoch to readable format */}
                            {new Date(
                              subscription.start_date * 1000
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              subscription.current_period_end * 1000
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {subscription.plan.amount / 100}{" "}
                            {subscription.plan.currency.toUpperCase()}
                          </div>
                        </td>
                        <td className="flex items-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Capitalize first character */}
                          {/* If subscription.status == active display green check icon */}
                          {subscription.status === "active" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            ""
                          )}
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-row items-center">
                            <span
                              className="h-6 w-6 text-red-500 cursor-pointer"
                              onClick={() => {
                                handleCancelSubscription({
                                  subscriptionId: subscription.id,
                                });
                              }}
                            >
                              Unsubscribe
                            </span>
                          </div>
                        </td>
                        {/* Add delete icon with red color x button and onClick trigger handleCancelSubscription */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-10 flex flex-row mx-auto justify-center">
                <a
                  href="/invoices"
                  className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  View invoices
                </a>
                {/* Add button to go back home page */}
                <a
                  href="/"
                  className="ml-4 bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {/* Heroicon: home icon */}
                  Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
