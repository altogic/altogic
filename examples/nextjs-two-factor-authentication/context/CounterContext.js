import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const CounterContext = createContext({ counter: null });

export function CounterContextProvider(props) {
  const router = useRouter();
  const [counter, setCounter] = useState(null);
  function initiateCounter() {
    setCounter(60);
  }

  function terminateCounter() {
    setCounter(0);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((currentTime) => {
        if (currentTime > 0) {
          return currentTime - 1;
        } else {
          clearInterval(interval);
          if (counter !== null) router.push("/auth/sign-in");
          return currentTime;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  const value = {
    counter,
    initiateCounter,
    terminateCounter,
  };

  return <CounterContext.Provider value={value} {...props} />;
}

export default CounterContextProvider;
