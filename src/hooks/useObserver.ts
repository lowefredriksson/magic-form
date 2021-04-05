import { useState, useEffect } from "react";
import { RegisterObserver } from "../types";

export function useObservedValue<T>(
  key: string,
  register: RegisterObserver<T>
) {
  const [state, setState] = useState<T | undefined>(undefined);
  useEffect(() => {
    return register(key, setState);
  }, [register, setState, key]);
  return state;
}

/**
 * Creates an observer that observes a given key of a given subject.
 * @param key the key to observe in the given subject.
 * @param register a register belonging to the subject to observe.
 */
