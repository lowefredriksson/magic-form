import { useFormContext } from "./useFormContext";
import { useObservedValue } from "./useObserver";

export const useTouched = (key: string) => {
  const { registerTouchedObserver } = useFormContext();
  return useObservedValue<boolean>(key, registerTouchedObserver);
};
