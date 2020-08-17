import { useState, useEffect } from "react";
import { RegisterObserver } from "./types";

export function useObserver<T>(key: string, register: RegisterObserver<T>) {
  const [state, setState] = useState<T | undefined>(undefined);
  useEffect(() => {
    return register(key, setState);
  }, [register, setState, key]);
  return state;
}
