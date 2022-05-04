import { ModalContext } from "../context/ModalContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const Notification = () => {
  const context = useContext(ModalContext);
  useEffect(() => {
    setStyle(
      context.type === "error"
        ? {
            bgColor: "bg-red-50",
            textColor: "text-red-700",
          }
        : {
            bgColor: "bg-green-50",
            textColor: "text-green-700",
          }
    );
  });
  const [style, setStyle] = useState({
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  });

  return (
    <Transition appear show={context.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={context.closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full max-w-md p-6 my-4 fixed top-14 right-0 mr-2 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl ${style.bgColor}`}
            >
              <div className="mt-2">
                <p className={`leading-6 text-gray-900 ${style.textColor}`}>
                  <FontAwesomeIcon
                    icon={
                      context.type === "error"
                        ? faCircleExclamation
                        : faCircleCheck
                    }
                  />
                  &nbsp;&nbsp;{context.content}
                </p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Notification;
