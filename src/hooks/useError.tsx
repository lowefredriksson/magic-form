import { useFormContext } from "./useFormContext";
import { Error } from "../types";
import { useObserver } from "./useObserver";

export const useError = (key: string) => {
  const { registerErrorObserver } = useFormContext();
  return useObserver<Error>(key, registerErrorObserver);
};
