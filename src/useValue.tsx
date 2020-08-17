import { useContext } from "react";
import { Context } from "./Context";
import { Value } from "./types";
import { useObserver } from "./useObserver";
export const useValue = (key: string) => {
  const { registerValueObserver } = useContext(Context);
  return useObserver<Value>(key, registerValueObserver);
};
