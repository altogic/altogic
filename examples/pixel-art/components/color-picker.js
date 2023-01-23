import { ChromePicker } from "react-color";
import { Popover, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import cs from "classnames";

function ColorPicker({ color, onChange, colorPaletteSize, canDraw }) {
  const [pickedColor, setPickedColor] = useState(color);
  const [opened, setOpened] = useState(false);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (didMount && !opened) {
      onChange(pickedColor);
    }
    setDidMount(true);
  }, [opened]);

  return (
    <Popover>
      {({ open }) => {
        setOpened(open);

        return (
          <>
            <Popover.Button
              type="button"
              disabled={!canDraw}
              className="w-8 h-8 md:w-12 md:h-12 border-2 border-violet-500 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-violet-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel
                className={cs([
                  "absolute z-10 top-1",
                  colorPaletteSize % 4 > 1 ? "right-0" : "left-0",
                ])}
              >
                <ChromePicker
                  color={pickedColor}
                  onChange={({ hex }) => setPickedColor(hex)}
                  disableAlpha
                />
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
}

export default ColorPicker;
