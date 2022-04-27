import { useContext, useState } from "react";
import { Tab } from "@headlessui/react";
import ChangePhone from "./ChangePhone";
import ChangePasswordForm from "./ChangePassword";
import { AuthenticationContext } from "../../context/AuthenticationContext";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ChangeCredentials = () => {
  const context = useContext(AuthenticationContext);

  const [tabs] = useState({
    "Change Phone": {
      title: "Change Phone",
      component: <ChangePhone context={context} />,
    },
    "Change Password": {
      title: "Change Password",
      component: <ChangePasswordForm context={context} />,
    },
  });

  return (
    <div className="w-full max-w-md px-2 mt-7">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-white">
          {Object.keys(tabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "w-full py-2 text-sm font-medium",
                  "focus:outline-none ring-white ring-opacity-60",
                  selected
                    ? " text-indigo-700 bg-white shadow"
                    : "text-slate-500 hover:text-slate-800 bg-slate-100 border-"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(tabs).map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "bg-white rounded-xl p-3",
                "ring-opacity-60"
              )}
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ChangeCredentials;
