import { useFormContext } from "./useFormContext";
import { Error } from "../types";
import { useObservedValue } from "./useObserver";

export const useError = (key: string) => {
  const { registerErrorObserver } = useFormContext();
  return useObservedValue<Error>(key, registerErrorObserver);
};
