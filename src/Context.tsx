import React from "react";
import { ContextType } from "./types";

export const Context = React.createContext<ContextType>({
  registerField: () => {},
  registerValueObserver: () => () => {},
  registerErrorObserver: () => () => {},
  registerTouchedObserver: () => () => {},
  getError: () => undefined,
  setTouched: () => {},
  getTouched: () => false,
  setValue: () => {},
  getValue: () => undefined,
});
