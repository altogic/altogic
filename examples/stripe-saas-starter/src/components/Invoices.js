import React from "react";
import { altogic } from "../helpers/altogic";
import { useAuth } from "../contexts/Auth";

export function Invoices() {
  const [invoices, setInvoices] = React.useState([]);
  const { setUser } = useAuth();

  async function getInvoices() {
    const response = await altogic.endpoint.get("invoices");
    setInvoices(response.data.data);
  }

  async function getSubscriptions() {
    const response = await altogic.endpoint.get("subscription/list");
    setUser(response);
  }

  // call getInvoices function on component mount
  React.useEffect(() => {
    getInvoices();
    getSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            Invoices
          </h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Display invoices of your subscriptions or purchases. . View and
            download invoices in PDF format.
          </p>
        </div>
      </div>
      {/* If loading state true display loader */}

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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                        Invoice Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Invoice Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Due Date
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
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        {/* Map invoice.line.data and display amount, type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {invoice.number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {/* Convert epoch to readable format */}
                            {new Date(
                              invoice.created * 1000
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        {/* map invoice.lines.data  to display, line.due_date */}

                        {invoice.lines.data.map((line) => (
                          <td
                            key={line.id}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="text-sm text-gray-900">
                              {new Date(
                                line.period.end * 1000
                              ).toLocaleDateString()}
                            </div>
                          </td>
                        ))}

                        {invoice.lines.data.map((line) => (
                          <td
                            key={line.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {line.amount / 100} {line.currency.toUpperCase()}
                          </td>
                        ))}
                        <td className="flex items-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Capitalize first character */}
                          {/* If invoice.status == paid display green check icon */}
                          {invoice.status === "paid" ? (
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
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* Display view, download, access svg icons in a row */}

                          <div className="flex flex-row items-center">
                            <a
                              href={invoice.hosted_invoice_url}
                              className="text-gray-700 hover:text-gray-900 mr-4"
                            >
                              View
                            </a>
                            <a
                              href={invoice.invoice_pdf}
                              className="text-gray-700 hover:text-gray-900"
                            >
                              Download
                            </a>

                            {/* Display this icon only for the first invoice */}
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
                  href="/subscriptions"
                  className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  View subscriptions
                </a>
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
