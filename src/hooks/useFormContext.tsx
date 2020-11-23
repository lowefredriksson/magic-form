import React from "react";
import { ContextType } from "../types";

export const Context = React.createContext<ContextType>({
  registerField: () => {},
  registerValueObserver: () => () => {},
  registerErrorObserver: () => () => {},
  registerTouchedObserver: () => () => {},
  registerDescriptionObserver: () => () => {},
  addDescription: () => {},
  removeDescription: () => {},
  getError: () => undefined,
  setTouched: () => {},
  getTouched: () => false,
  setValue: () => {},
  getValue: () => undefined,
});

export const useFormContext = () => React.useContext(Context);
