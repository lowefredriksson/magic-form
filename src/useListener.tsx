import React, {
  useRef,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { Context } from "./Context";
import {
  RegisterListener,
  UnregisterListener,
  Value,
  Error,
  Listener,
} from "./types";
function useListener<T>(
  key: string,
  id: string,
  register: RegisterListener<T>,
  unregister: UnregisterListener
) {
  const [value, setValue] = useState<T | undefined>(undefined);
  const idRef = useRef(id);
  useEffect(() => {
    register(key, idRef.current, setValue);
    return () => {
      unregister(idRef.current);
    };
  }, [register, unregister, idRef, setValue, key]);
  return value;
}

export const useValue = (key: string) => {
  const { registerValueListener, unregisterValueListener } = useContext(
    Context
  );
  return useListener<Value>(
    key,
    `${key}_subscription`,
    registerValueListener,
    unregisterValueListener
  );
};

export const useError = (key: string) => {
  const { registerErrorListener, unregisterErrorListener } = useContext(
    Context
  );
  return useListener<Error>(
    key,
    `${key}_error_subscription`,
    registerErrorListener,
    unregisterErrorListener
  );
};
export const useTouched = (key: string) => {
  const { registerTouchedListener, unregisterTouchedListener } = useContext(
    Context
  );
  return useListener<boolean>(
    key,
    `${key}_touched_subscription`,
    registerTouchedListener,
    unregisterTouchedListener
  );
};
export function useListeners<T>() {
  const listeners = useRef<Listener<T>[]>([]);
  const registerCallback = useCallback(
    (listenTo: string, id: string, callback: (value: any) => void) => {
      listeners.current = [
        ...listeners.current.filter(({ id: _id }) => _id !== id),
        { listenTo, id, callback },
      ];
    },
    [listeners]
  );
  const unregisterCallback = useCallback(
    (id: string) => {
      listeners.current = listeners.current.filter(({ id: _id }) => _id !== id);
    },
    [listeners.current]
  );
  return [listeners, registerCallback, unregisterCallback] as const;
}
export function notifyListeners<T>(
  listners: React.MutableRefObject<Listener<T>[]>,
  name: string,
  value: any
) {
  listners.current.forEach((listner) => {
    if (listner.listenTo === name) {
      listner.callback(value);
    }
  });
}
