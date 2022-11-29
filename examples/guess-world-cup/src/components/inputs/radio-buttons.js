import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import _ from "lodash";

export default function RadioButtons({ options, value, setValue }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">First Goal</h2>
      </div>

      <RadioGroup value={value} onChange={setValue} className="mt-2">
        <RadioGroup.Label className="sr-only">
          Choose first goal
        </RadioGroup.Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {_.map(options, (opt) => (
            <RadioGroup.Option
              key={opt.label}
              value={opt.value}
              className={({ active, checked }) =>
                classNames(
                  "cursor-pointer focus:outline-none",
                  active ? "ring-2 ring-offset-2 ring-pink-500" : "",
                  checked
                    ? "bg-pink-600 border-transparent text-white hover:bg-pink-700"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                  "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
                )
              }
            >
              <RadioGroup.Label as="p">{opt.label}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
