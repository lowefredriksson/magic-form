import { useFormContext } from "./useFormContext";
import { useObservedValue } from "./useObserver";

export function useFormStatus(key: string) {
  const { registerFormStatusObserver } = useFormContext();
  return useObservedValue<string>(key, registerFormStatusObserver);
}
