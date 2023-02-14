import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stats from "./components/stats";

const MINUTES = 5;

function App() {
  const [minutesLeft, setMinutesLeft] = useState(
    MINUTES - (new Date().getMinutes() % MINUTES)
  );

  useEffect(() => {
    setInterval(timer, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const timer = () => {
    setMinutesLeft(MINUTES - (new Date().getMinutes() % MINUTES));
  };

  return (
    <div className="px-6 py-6 bg-slate-300 h-full">
      <h1 className="text-center">
        Rates are updated instantly every {MINUTES} minutes. ({minutesLeft}{" "}
        minutes left)
      </h1>

      <Stats />

      <ToastContainer
        position="top-center"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
