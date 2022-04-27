import { createContext, useEffect, useState } from "react";

export const CounterContext = createContext();

const CounterProvider = ({ children }) => {
  const [counter, setCounter] = useState(null);

  const initiateCounter = () => {
    setCounter(150);
  };
  const [flag, setFlag] = useState(true);
  const terminateCounter = () => {
    setCounter(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((currentTime) => {
        if (currentTime > 0) {
          return currentTime - 1;
        } else {
          clearInterval(interval);
          return currentTime;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <CounterContext.Provider
      value={{
        counter,
        initiateCounter,
        terminateCounter,
      }}
    >
      {" "}
      {children}
    </CounterContext.Provider>
  );
};

export default CounterProvider;
