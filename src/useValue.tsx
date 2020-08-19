import { useFormContext } from "./useFormContext";
import { Value } from "./types";
import { useObserver } from "./useObserver";

export const useValue = (key: string) => {
  const { registerValueObserver } = useFormContext();
  return useObserver<Value>(key, registerValueObserver);
};
