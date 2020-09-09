import { useRef, useCallback } from "react";
import { Observer } from "./types";
import { notifyObservers } from "./utils/notifyObservers";

interface ISubjectConfig<T> {
  onChange?: () => void;
  stateEquals?: (prevState: T | undefined, newState: T | undefined) => boolean;
}

function defaultEquals<T = any>(prevState: T, newState: T) {
  return prevState !== newState;
}

function useSubject<T>() {
  const observers = useRef<Map<number, Observer<T>>>(new Map());
  const nextId = useRef(0);
  const registerObserver = useCallback(
    (key: string, update: (state: any) => void) => {
      const id = nextId.current;
      nextId.current++;
      observers.current.set(id, { key, update });
      return () => {
        observers.current.delete(id);
      };
    },
    [observers]
  );
  return [observers, registerObserver] as const;
}

export function useMapSubject<T>({
  onChange = () => {},
  stateEquals = defaultEquals,
}: ISubjectConfig<T>) {
  const state = useRef<Map<string, T>>(new Map());
  const [observers, registerObserver] = useSubject<T>();
  const setState = useCallback(
    (key: string, value: T) => {
      const prev = state.current.get(key);
      state.current.set(key, value);
      if (stateEquals(prev, value)) {
        notifyObservers(observers, key, value);
        onChange();
      }
    },
    [state, notifyObservers, observers, stateEquals]
  );
  return {
    state,
    setState,
    observers,
    registerObserver,
  } as const;
}
