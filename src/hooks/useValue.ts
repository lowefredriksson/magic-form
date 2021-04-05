import { useFormContext } from "./useFormContext";
import { Value } from "../types";
import { useObservedValue } from "./useObserver";

export const useValue = (key: string) => {
  const { registerValueObserver } = useFormContext();
  return useObservedValue<Value>(key, registerValueObserver);
};
