import { useContext } from "react";
import { Context } from "./Context";
import { useObserver } from "./useObserver";
export const useTouched = (key: string) => {
  const { registerTouchedObserver } = useContext(Context);
  return useObserver<boolean>(key, registerTouchedObserver);
};
