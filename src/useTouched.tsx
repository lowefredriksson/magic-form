import { useFormContext } from "./useFormContext";
import { useObserver } from "./useObserver";
export const useTouched = (key: string) => {
  const { registerTouchedObserver } = useFormContext();
  return useObserver<boolean>(key, registerTouchedObserver);
};
