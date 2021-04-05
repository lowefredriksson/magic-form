import React from "react";
import { ContextType } from "../types";

export const Context = React.createContext<ContextType>({
  registerField: () => {},
  registerValueObserver: () => () => {},
  registerErrorObserver: () => () => {},
  registerTouchedObserver: () => () => {},
  registerDescriptionObserver: () => () => {},
  registerFormStatusObserver: () => () => {},
  addDescription: () => {},
  removeDescription: () => {},
  setTouched: () => {},
  setValue: () => {},
  getError: () => undefined,
  getFormStatus: () => undefined,
  getTouched: () => undefined,
  getValue: () => undefined,
});

export const useFormContext = () => React.useContext(Context);
