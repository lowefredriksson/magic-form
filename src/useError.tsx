import { useContext } from "react";
import { Context } from "./Context";
import { Error } from "./types";
import { useObserver } from "./useObserver";

export const useError = (key: string) => {
  const { registerErrorObserver } = useContext(Context);
  return useObserver<Error>(key, registerErrorObserver);
};
