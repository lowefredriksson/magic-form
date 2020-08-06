import React from "react";
import { ContextType } from "./types";

export const Context = React.createContext<ContextType>({
  registerValueListener: () => {},
  unregisterValueListener: () => {},
  registerField: () => {},
  unregisterErrorListener: () => {},
  registerErrorListener: () => {},
  unregisterTouchedListener: () => {},
  registerTouchedListener: () => {},
  getError: () => undefined,
  setTouched: () => {},
  getTouched: () => false,
  setValue: () => {},
  getValue: () => undefined,
});
