import { useRef, useCallback } from "react";
import { Observer } from "../types";
import { notifyObservers } from "../utils/notifyObservers";

interface ISubjectConfig<T> {
  onChange?: () => void;
  stateEquals?: (prevState: T | undefined, newState: T | undefined) => boolean;
}

function defaultEquals<T = any>(prevState: T, newState: T) {
  return prevState !== newState;
}

export function useObservers<T>() {
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

export function useValueSubject<T>({
  onChange = () => {},
  stateEquals = defaultEquals,
}: ISubjectConfig<T>) {
  const state = useRef<T>();
  const [observers, registerObserver] = useObservers<T>();

  const setState = useCallback(
    (value: T) => {
      const prev = state.current;
      state.current = value;
      if (stateEquals(prev, value)) {
        notifyObservers(observers, "default", value);
      }
    },
    [observers, stateEquals]
  );
}

export function useMapSubject<T>({
  onChange = () => {},
  stateEquals = defaultEquals,
}: ISubjectConfig<T>) {
  const state = useRef<Map<string, T>>(new Map());
  const [observers, registerObserver] = useObservers<T>();
  const setState = useCallback(
    (key: string, value: T) => {
      const prev = state.current.get(key);
      state.current.set(key, value);
      if (stateEquals(prev, value)) {
        notifyObservers(observers, key, value);
        onChange();
      }
    },
    [state, observers, stateEquals, onChange]
  );
  return {
    state,
    setState,
    observers,
    registerObserver,
  } as const;
}
